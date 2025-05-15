<!DOCTYPE html>

<html lang="en-US">

<head>

<title>PHP + MySQL</title>

 <meta charset="UTF-8">

</head>

<body>

<?php
  try {
      // Use Replit's built-in DB or environment variables
    $host = "127.0.0.1";
    $dbname = 'uob_club_database'; // your database name
    $username = 'clubadmin';       // default in Replit
    $password = 'afaaf1616'; 
      $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
      $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

      $version = $conn->getAttribute(PDO::ATTR_SERVER_VERSION);
      echo "<p class='success'> Successfully connected to the database '<strong>$dbname</strong>' on host '<strong>$host</strong>'!</p>";
      echo "<p>MySQL Server Version: <strong>$version</strong></p>";

      // Optional: Test a simple query (e.g., list tables)
      $tables = $conn->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
      if (!empty($tables)) {
          echo "<p>Tables in database: <strong>" . implode(', ', $tables) . "</strong></p>";
      } else {
          echo "<p>No tables found in database.</p>";
      }
  } catch(PDOException $e) {
      echo "<p class='error'> Connection failed: " . $e->getMessage() . "</p>";
  }
// $host = "127.0.0.1";

// $user = getenv("db_user");

// $pass = getenv("db_pass");

// $db = getenv("db_name");



// $conn = new mysqli($host, $user, $pass, $db);

// if ($conn->connect_error)

// die("Connection failed: " . $conn->connect_error);
//   echo "<p>DATABASE connected succesfully!</p>";


// $conn->close();

 ?>

</body>

 </html>