<?php
require_once '../db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

header('Content-Type: application/json');


$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing or invalid note ID']);
    exit;
}

if ($method === 'GET') {
    $query = $pdo->prepare("SELECT * FROM notes WHERE id = ?");
    $query->execute([$id]);
    $note = $query->fetch();

    if ($note) {
        echo json_encode($note);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Note not found']);
    }
} else if ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['courseName'], $input['description'], $input['date'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }

    $query = $pdo->prepare("UPDATE notes SET course_name = ?, description = ?, note_date = ? WHERE id = ?");
    $query->execute([$input['courseName'], $input['description'], $input['date'], $id]);

    echo json_encode(['message' => 'Note updated successfully']);
} else if ($method === "DELETE") {
    $query = $pdo->prepare("DELETE FROM notes WHERE id = ?");
    $query->execute([$id]);

    if ($query->rowCount()) {
        echo json_encode(['message' => 'Note deleted successfully']);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Note not found']);
    }
}
