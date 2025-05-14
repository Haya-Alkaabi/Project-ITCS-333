<?php
require_once __DIR__.'/../dbconfig.php';
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
} else {
  echo "Database connected!";
}