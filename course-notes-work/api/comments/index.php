<?php

require_once '../db.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

header('Content-Type: application/json');



$method = $_SERVER['REQUEST_METHOD'];
$note_id = isset($_GET['note_id']) ? intval($_GET['note_id']) : 0;

if (!$note_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing note_id']);
    exit;
}

if ($method === 'GET') {
    $query = $pdo->prepare("SELECT * FROM comments WHERE note_id = ? ORDER BY created_at DESC");
    $query->execute([$note_id]);
    echo json_encode($query->fetchAll());
}

elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!isset($input['text'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing comment text']);
        exit;
    }

    $author = $input['author'] ?? 'Anonymous';
    $query = $pdo->prepare("INSERT INTO comments (note_id, author, text) VALUES (?, ?, ?)");
    $query->execute([$note_id, $author, $input['text']]);
    echo json_encode(['message' => 'Comment added']);
}
