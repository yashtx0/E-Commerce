<?php
require 'db_connect.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"));

if(isset($data->username) && isset($data->email) && isset($data->password)) {  
    $username = $data->username;
    $email = $data->email;
    $password_hash = password_hash($data->password, PASSWORD_DEFAULT);

    try {
        $stmt = $pdo->prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)');
        $stmt->execute([$username, $email, $password_hash]);
        
        echo json_encode(['status' => 'success', 'message' => 'Account created successfully! Welcome to Atlas.']);
        
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) { 
            echo json_encode(['status' => 'error', 'message' => 'An account with this email already exists.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        }
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Please fill in all required fields.']);
}
?>