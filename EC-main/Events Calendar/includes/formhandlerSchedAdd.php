<?php
require 'connection.php';
header('Content-Type: application/json');

try {
    $data = [
        'course_code' => $_POST['course_code'],
        'day' => strtolower($_POST['day']),
        'start_time' => $_POST['start_time'],
        'location' => $_POST['location'],
        'cell_id' => $_POST['cell_id']
    ];

    $sql = "INSERT INTO courses (course_code, day, start_time, location, cell_id) 
            VALUES (:course_code, :day, :start_time, :location, :cell_id)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($data);

    $data['id'] = $pdo->lastInsertId();

    echo json_encode([
        'success' => true,
        'message' => 'Course added successfully',
        'course' => $data
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>