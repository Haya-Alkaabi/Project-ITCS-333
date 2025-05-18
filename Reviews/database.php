<?php
class Database
{
    private $db_file = __DIR__ . '/data/course_reviews.db';
    public $conn;

    public function connect()
    {
        try {
            $this->conn = new PDO('sqlite:' . $this->db_file);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Database Error: ' . $e->getMessage()]);
            exit;
        }

        return $this->conn;
    }
}
