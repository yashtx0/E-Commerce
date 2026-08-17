<?php
session_start();
require 'db_connect.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Authentication required.']);
    exit;
}

$user_id = $_SESSION['user_id'];
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->address) || empty($data->address)) {
    echo json_encode(['status' => 'error', 'message' => 'Shipping address is required.']);
    exit;
}

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare('
        SELECT c.quantity, p.id, p.price 
        FROM cart_items c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
    ');
    $stmt->execute([$user_id]);
    $cart_items = $stmt->fetchAll();

    if (count($cart_items) === 0) {
        throw new Exception("Your cart is empty.");
    }

    $total_amount = 0;
    foreach ($cart_items as $item) {
        $total_amount += ($item['price'] * $item['quantity']);
    }
    $orderStmt = $pdo->prepare('INSERT INTO orders (user_id, total_amount, shipping_address) VALUES (?, ?, ?)');
    $orderStmt->execute([$user_id, $total_amount, $data->address]);

    $order_id = $pdo->lastInsertId();

    $itemStmt = $pdo->prepare('INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)');
    foreach ($cart_items as $item) {
        $itemStmt->execute([$order_id, $item['id'], $item['quantity'], $item['price']]);
    }
    $clearCart = $pdo->prepare('DELETE FROM cart_items WHERE user_id = ?');
    $clearCart->execute([$user_id]);

    $pdo->commit();

    echo json_encode(['status' => 'success']);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>