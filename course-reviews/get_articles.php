<?php
header('Content-Type: application/json');

// Database connection (use the same credentials as create.php)
$host = "127.0.0.1";
$dbname = getenv("db_name");
$username = getenv("db_user");
$password = getenv("db_pass");

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->query("SELECT * FROM articles ORDER BY publish_date DESC");
    $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($articles);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>