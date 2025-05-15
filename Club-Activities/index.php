<?php
require_once 'config/Database.php';

echo "<!DOCTYPE html>
<html>
<head>
    <title>DB Test</title>
    <style>
        .success { color: green; }
        .error { color: red; }
    </style>
</head>
<body>
    <h1>Database Connection Test</h1>";

try {
    $pdo = Database::getConnection();

    // Get DB info
    $dbName = $pdo->query("SELECT DATABASE()")->fetchColumn();
    $version = $pdo->getAttribute(PDO::ATTR_SERVER_VERSION);

    echo "<p class='success'>✓ Connected to <strong>$dbName</strong> on <strong>127.0.0.1</strong></p>
          <p>MySQL Version: $version</p>";

} catch (Exception $e) {
    echo "<p class='error'>✗ Connection failed</p>
          <p>Ensure these Replit Secrets exist:</p>
          <ul>
            <li>db_host (set to 127.0.0.1)</li>
            <li>db_name</li>
            <li>db_user</li>
            <li>db_pass</li>
          </ul>";
}

echo "</body></html>";
?>