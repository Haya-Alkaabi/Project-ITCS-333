<?php
require 'connection.php';
header('Content-Type: application/json');

try {
    $stmt = $pdo->prepare("DELETE FROM courses WHERE id = ?");
    $stmt->execute([$_POST['id']]);

    echo json_encode([
        'success' => true,
        'message' => 'Course deleted successfully'
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>