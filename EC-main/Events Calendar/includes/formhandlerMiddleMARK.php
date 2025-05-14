<?php
header('Content-Type: application/json');
require_once 'connection.php';

$response = ['success' => false, 'message' => ''];

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $id = $_POST['id'] ?? null;
        $marked = isset($_POST['marked']) ? (int)$_POST['marked'] : 0;
        
        if (empty($id)) {
            throw new Exception('Invalid event ID');
        }
        
        $stmt = $pdo->prepare("UPDATE events SET marked = ? WHERE id = ?");
        $stmt->execute([$marked, $id]);
        
        if ($stmt->rowCount() > 0 || $marked == 0) {
            // Consider success if either:
            // 1. Rows were actually updated, or
            // 2. We're unmarking (marked=0) and the event was already unmarked
            $response['success'] = true;
            $response['message'] = $marked ? 'Event marked' : 'Event unmarked';
        } else {
            $response['message'] = 'Event not found or no changes made';
        }
    }
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>