<?php
require 'db_connect.php';
header('Content-Type: application/json');

try {
    
    $stmt = $pdo->query('SELECT id, name, price, image, description, link FROM products');
    $products = $stmt->fetchAll();
    echo json_encode($products);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>