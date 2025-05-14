<?php
require 'connection.php';

header('Content-Type: application/json');

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method');
    }

    if (!isset($_POST['id']) || !isset($_POST['marked'])) {
        throw new Exception('Missing required parameters');
    }

    $id = filter_var($_POST['id'], FILTER_VALIDATE_INT);
    $marked = filter_var($_POST['marked'], FILTER_VALIDATE_BOOLEAN);

    $stmt = $pdo->prepare("UPDATE events SET marked = :marked WHERE id = :id");
    $stmt->bindParam(':marked', $marked, PDO::PARAM_BOOL);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>