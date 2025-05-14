<?php
require 'connection.php';
header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT * FROM courses ORDER BY day, start_time");
    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($courses);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>