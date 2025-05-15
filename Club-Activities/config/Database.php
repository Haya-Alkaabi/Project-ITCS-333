<?php
class Database {
    private static $instance = null;
    private $connection;

    private function __construct() {
    
        $host = getenv('db_host') ?: '127.0.0.1'; // Default to your specified host
        $name = getenv('db_name');
        $user = getenv('db_user');
        $pass = getenv('db_pass');

        try {
            $this->connection = new PDO(
                "mysql:host=$host;dbname=$name;charset=utf8mb4",
                $user,
                $pass,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]
            );
        } catch (PDOException $e) {
            throw new Exception("Database connection failed: Check Replit Secrets");
        }
    }

    public static function getConnection() {
        if (!self::$instance) {
            self::$instance = new Database();
        }
        return self::$instance->connection;
    }
}

// $host = "127.0.0.1";
// $user = getenv("db_user");
// $pass = getenv("db_pass");
//  $db = getenv("db_name");
// function connectDB() {
//     global $host, $user, $pass, $db;
    
//     try {
//        $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
//          $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
//          echo ("Connected successfully");
//          return $pdo;
//     } catch (PDOException $e) {
//          die("Database connection error: " . $e->getMessage());
//      }
//  }
//  ?>