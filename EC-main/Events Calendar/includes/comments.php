<?php
header('Content-Type: application/json');
require 'connection.php'; // Your database connection file
session_start();

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Get raw POST data
$input = file_get_contents('php://input');
$data = json_decode($input, true) ?: $_POST;

$response = ['success' => false];
$userId = $_SESSION['user_id'] ?? null;

try {
    if (empty($data['action'])) {
        throw new Exception('Action parameter is required');
    }

    $action = filter_var($data['action']);

    switch ($action) {
        case 'register':
            $username = trim($data['username'] ?? '');
            $email = trim($data['email'] ?? '');
            $password = $data['password'] ?? '';
            
            if (empty($username) || empty($email) || empty($password)) {
                throw new Exception('All fields are required');
            }
            
            if (strlen($password) < 8) {
                throw new Exception('Password must be at least 8 characters');
            }
            
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            
            $stmt = $pdo->prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
            $stmt->execute([$username, $email, $passwordHash]);
            
            $response['success'] = true;
            $response['message'] = 'Registration successful';
            break;

        case 'login':
            $email = trim($data['email'] ?? '');
            $password = $data['password'] ?? '';
            
            $stmt = $pdo->prepare("SELECT id, username, password_hash FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();
            
            if (!$user || !password_verify($password, $user['password_hash'])) {
                throw new Exception('Invalid email or password');
            }
            
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            
            $response['success'] = true;
            $response['user'] = ['id' => $user['id'], 'username' => $user['username']];
            break;

        case 'logout':
            session_destroy();
            $response['success'] = true;
            break;

        case 'add_comment':
            if (!$userId) throw new Exception('You must be logged in to comment');
            
            $content = trim($data['content'] ?? '');
            if (empty($content)) throw new Exception('Comment cannot be empty');
            
            $stmt = $pdo->prepare("INSERT INTO comments (user_id, content) VALUES (?, ?)");
            $stmt->execute([$userId, $content]);
            
            $response['success'] = true;
            $response['comment_id'] = $pdo->lastInsertId();
            break;

        case 'like_comment':
            if (!$userId) throw new Exception('You must be logged in to like comments');
            
            $commentId = filter_var($data['comment_id'] ?? 0, FILTER_VALIDATE_INT);
            if (!$commentId) throw new Exception('Invalid comment ID');
            
            // Check if already liked
            $stmt = $pdo->prepare("SELECT id FROM comment_likes WHERE user_id = ? AND comment_id = ?");
            $stmt->execute([$userId, $commentId]);
            
            if ($stmt->fetch()) {
                // Unlike
                $pdo->prepare("DELETE FROM comment_likes WHERE user_id = ? AND comment_id = ?")->execute([$userId, $commentId]);
                $pdo->prepare("UPDATE comments SET like_count = like_count - 1 WHERE id = ?")->execute([$commentId]);
                $response['liked'] = false;
            } else {
                // Like
                $pdo->prepare("INSERT INTO comment_likes (user_id, comment_id) VALUES (?, ?)")->execute([$userId, $commentId]);
                $pdo->prepare("UPDATE comments SET like_count = like_count + 1 WHERE id = ?")->execute([$commentId]);
                $response['liked'] = true;
            }
            
            $stmt = $pdo->prepare("SELECT like_count FROM comments WHERE id = ?");
            $stmt->execute([$commentId]);
            $response['like_count'] = $stmt->fetchColumn();
            $response['success'] = true;
            break;

        case 'get_comments':
            $stmt = $pdo->prepare("
                SELECT c.*, u.username, 
                (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id) as like_count,
                (SELECT COUNT(*) > 0 FROM comment_likes WHERE comment_id = c.id AND user_id = ?) as liked
                FROM comments c
                JOIN users u ON c.user_id = u.id
                ORDER BY c.created_at DESC
            ");
            $stmt->execute([$userId]);
            $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $response['success'] = true;
            $response['comments'] = $comments;
            break;

        case 'get_current_user':
            if ($userId) {
                $response['success'] = true;
                $response['user'] = [
                    'id' => $userId,
                    'username' => $_SESSION['username']
                ];
            } else {
                $response['success'] = false;
            }
            break;

        default:
            throw new Exception('Invalid action');
    }
} catch (Exception $e) {
    http_response_code(400);
    $response['error'] = $e->getMessage();
}

echo json_encode($response);