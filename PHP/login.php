<?php
session_start();
require 'db_connect.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"));

if(isset($data->email) && isset($data->password)) {
    
    $email = $data->email;
    $password = $data->password;

    try {
        $stmt = $pdo->prepare('SELECT id, name, password_hash FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];
            
            echo json_encode(['status' => 'success', 'name' => $user['name']]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid email or password.']);
        } 
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Please provide an email and password.']);
}
?>