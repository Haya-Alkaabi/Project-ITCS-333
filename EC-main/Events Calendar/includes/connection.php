<?php
$dsn = "mysql:host=localhost;dbname=records";
$username = "root";
$password = "";

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Let the caller handle the error — don't output anything here
    http_response_code(500);
    exit(json_encode(['success' => false, 'message' => 'Database connection failed']));
}
?>
