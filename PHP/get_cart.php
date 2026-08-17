<?php
session_start();
require 'db_connect.php';
header('Content-Type: application/json');
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Not logged in', 'data' => []]);
    exit;
}
$user_id = $_SESSION['user_id'];
try {
    $stmt = $pdo->prepare('
        SELECT 
            c.quantity, 
            p.id, 
            p.name, 
            p.price, 
            p.image 
        FROM cart_items c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
    ');
    $stmt->execute([$user_id]);
    $cart_items = $stmt->fetchAll();
    echo json_encode(['status' => 'success', 'data' => $cart_items]);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error', 'data' => []]);
}
?>