<?php
require_once __DIR__ . '/../config/Database.php';

// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

try {
    $pdo = Database::getConnection();

    $stmt = $pdo->query("SELECT id, name, description, category, image FROM clubs ORDER BY name");
    $records = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'records' => $records
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
         'records' => [],
        'error' => 'Database error'
    ]);
}

?>