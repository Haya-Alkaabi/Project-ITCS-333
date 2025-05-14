<?php
header('Content-Type: application/json');
require_once 'connection.php'; // Your connection file

try {
    $stmt = $pdo->query("SELECT * FROM events");
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format events for the frontend
    $formattedEvents = [];
    foreach ($events as $event) {
        // Convert 24-hour time format to 12-hour format with AM/PM
        $startTime = new DateTime($event['start_time']);
        $endTime = new DateTime($event['end_time']);

        // Format the time as 12-hour format with AM/PM
        $formattedStartTime = $startTime->format('g:i A'); // e.g., 8:09 AM
        $formattedEndTime = $endTime->format('g:i A'); // e.g., 9:00 AM
        
        $formattedEvents[] = [
            'id' => $event['id'],
            'title' => $event['title'],
            'date' => $event['event_date'],  // fixed key name
            'startTime' => $formattedStartTime,
            'endTime' => $formattedEndTime,
            'location' => $event['location'],
            'description' => $event['description'],
            'marked' => (bool)$event['marked']
        ];
    }

    echo json_encode([
        'success' => true,
        'events' => $formattedEvents
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
