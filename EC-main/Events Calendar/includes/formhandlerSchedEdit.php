<?php
require 'connection.php';
header('Content-Type: application/json');

try {
    $data = [
        'id' => $_POST['id'],
        'course_code' => $_POST['course_code'],
        'day' => strtolower($_POST['day']),
        'start_time' => $_POST['start_time'],
        'location' => $_POST['location'],
        'cell_id' => $_POST['cell_id']
    ];

    $sql = "UPDATE courses SET 
            course_code = :course_code,
            day = :day,
            start_time = :start_time,
            location = :location,
            cell_id = :cell_id
            WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($data);

    echo json_encode([
        'success' => true,
        'message' => 'Course updated successfully',
        'course' => $data
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>