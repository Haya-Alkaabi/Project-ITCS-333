<?php

require('../db.php');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');


$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $limit = 6;
    $offset = ($page - 1) * $limit;

    $query = $pdo->prepare("SELECT * FROM notes LIMIT :limit OFFSET :offset");
    $query->bindValue(':limit', $limit, PDO::PARAM_INT);
    $query->bindValue(':offset', $offset, PDO::PARAM_INT);
    $query->execute();

    echo json_encode($query->fetchAll());
} else if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['courseName'], $input['description'], $input['date'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields.']);
        exit;
    }

    $query = $pdo->prepare("INSERT INTO notes (course_name, description, note_date) VALUES (?, ?, ?)");
    $query->execute([$input['courseName'], $input['description'], $input['date']]);
    
    echo json_encode(['message' => 'Note created successfully.']);
}
