<?php
header('Content-Type: application/json');
require 'connection.php'; // Your database connection file
session_start();

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$response = ['success' => false, 'error' => ''];

try {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true) ?: $_POST;

    if (empty($data['action'])) {
        throw new Exception('Action parameter is required');
    }

    $action = filter_var($data['action']);

    switch ($action) {
        case 'register':
            $academicId = trim($data['academic_id'] ?? '');
            $username = trim($data['username'] ?? '');
            $email = trim($data['email'] ?? '');
            $password = $data['password'] ?? '';

            if (empty($academicId) || empty($username) || empty($email) || empty($password)) {
                throw new Exception('All fields are required');
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                throw new Exception('Invalid email format');
            }

            if (strlen($password) < 8) {
                throw new Exception('Password must be at least 8 characters');
            }

            // Check if academic ID or email already exists
            $stmt = $pdo->prepare("SELECT id FROM users WHERE academic_id = ? OR email = ?");
            $stmt->execute([$academicId, $email]);
            
            if ($stmt->fetch()) {
                throw new Exception('Academic ID or Email already exists');
            }

            $passwordHash = password_hash($password, PASSWORD_DEFAULT);

            $stmt = $pdo->prepare("INSERT INTO users (academic_id, username, email, password_hash) VALUES (?, ?, ?, ?)");
            $stmt->execute([$academicId, $username, $email, $passwordHash]);

            $response['success'] = true;
            $response['message'] = 'Registration successful';
            break;

        case 'login':
            $email = trim($data['email'] ?? '');
            $password = $data['password'] ?? '';

            $stmt = $pdo->prepare("SELECT id, academic_id, username, password_hash FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if (!$user || !password_verify($password, $user['password_hash'])) {
                throw new Exception('Invalid email or password');
            }

            $_SESSION['user_id'] = $user['id'];
            $_SESSION['academic_id'] = $user['academic_id'];
            $_SESSION['username'] = $user['username'];

            $response['success'] = true;
            $response['user'] = [
                'id' => $user['id'],
                'academic_id' => $user['academic_id'],
                'username' => $user['username']
            ];
            break;

        case 'logout':
            session_destroy();
            $response['success'] = true;
            break;

        case 'check_session':
            if (isset($_SESSION['user_id'])) {
                $response['success'] = true;
                $response['user'] = [
                    'id' => $_SESSION['user_id'],
                    'academic_id' => $_SESSION['academic_id'],
                    'username' => $_SESSION['username']
                ];
            }
            break;

        default:
            throw new Exception('Invalid action');
    }
} catch (Exception $e) {
    $response['error'] = $e->getMessage();
}

echo json_encode($response);