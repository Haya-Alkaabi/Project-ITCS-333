<?php
header('Content-Type: application/json'); // Always return JSON

// Check if it's a POST request
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Initialize response array
    $response = [
        'success' => false,
        'message' => '',
        'eventId' => null
    ];

    // Extract and sanitize data from $_POST
    $date = $_POST['EventDate'] ?? '';
    $start = $_POST['EventStartTime'] ?? '';
    $end = $_POST['EventEndTime'] ?? '';
    $title = trim($_POST['EventTitle'] ?? '');
    $location = trim($_POST['EventLocation'] ?? '');
    $description = trim($_POST['EventDes'] ?? '');

    // Validate required fields
    if (empty($date) || empty($start) || empty($end) || empty($title)) {
        $response['message'] = 'All required fields must be filled';
        http_response_code(400); // Bad Request
        echo json_encode($response);
        exit();
    }

    // Validate date format (optional)
    if (!strtotime($date)) {
        $response['message'] = 'Invalid date format';
        http_response_code(400);
        echo json_encode($response);
        exit();
    }

    // Connect to database
    require "connection.php";

    // Prepare SQL query
    $sql = "INSERT INTO events 
            (event_date, start_time, end_time, title, location, description)
            VALUES (?, ?, ?, ?, ?, ?)";

    try {
        $stmt = $pdo->prepare($sql);
        $success = $stmt->execute([$date, $start, $end, $title, $location, $description]);

        if ($success) {
            $response['success'] = true;
            $response['eventId'] = $pdo->lastInsertId();
            $response['message'] = 'Event created successfully';
            http_response_code(201); // Created
        } else {
            $response['message'] = 'Failed to create event';
            http_response_code(500);
        }
    } catch (PDOException $e) {
        $response['message'] = 'Database error: ' . $e->getMessage();
        http_response_code(500);
    }

    // Return JSON response
    echo json_encode($response);
    exit();

} else {
    $response = [
        'success' => false,
        'message' => 'Only POST requests are allowed'
    ];
    http_response_code(405); // Method Not Allowed
    echo json_encode($response);
    exit();
}
?>