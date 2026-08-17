<?php
session_start();
require 'db_connect.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Please log in to add items to your cart.']);
    exit;
}

$data = json_decode(file_get_contents("php://input"));
$user_id = $_SESSION['user_id'];

if (isset($data->product_id)) {
    $product_id = $data->product_id;
    try {
        $stmt = $pdo->prepare('
            INSERT INTO cart_items (user_id, product_id, quantity) 
            VALUES (?, ?, 1) 
            ON DUPLICATE KEY UPDATE quantity = quantity + 1
        ');      
        $stmt->execute([$user_id, $product_id]);
        
        echo json_encode(['status' => 'success', 'message' => 'Item added to cart!']);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'No product specified.']);
}
?>