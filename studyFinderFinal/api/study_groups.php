<?php
header('Content-Type: application/json');
require_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM study_groups ORDER BY id DESC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON']);
            exit;
        }
            case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing ID']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM study_groups WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode(['message' => 'Group deleted']);
        break;


        $stmt = $pdo->prepare("INSERT INTO study_groups (name, subject, meeting_details, contact_email) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $data['name'],
            $data['subject'],
            $data['meeting'],
            $data['contact']
        ]);

        echo json_encode(['message' => 'Group added successfully']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}


  


?>
