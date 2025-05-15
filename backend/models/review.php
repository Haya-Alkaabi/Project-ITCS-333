<?php
class Review {
private const TABLE_NAME = 'reviews';
/**
* Database Helper for Item-Class 
* which is for market items 
*/
private $pdo;
public $id;
public $item_id;
public $reviewer_name;
public $review_text;
public $rating;
public $created_at;
// Constructor
public function __construct($pdo, $id=null, $item_id=null, $reviewer_name=null, $review_text=null, $rating=null, $created_at=null) {
    $this->pdo = $pdo;
    $this->id = $id;
    $this->item_id = $item_id;
    $this->reviewer_name = $reviewer_name;
    $this->review_text = $review_text;
    $this->rating = $rating;
    $this->created_at = $created_at;
}
public function createReview() {
    $query = "INSERT INTO " . self::TABLE_NAME . " 
    SET item_id=:item_id, reviewer_name=:reviewer_name, 
    review_text=:review_text, rating=:rating, created_at=NOW()";
    $stmt = $this->pdo->prepare($query);
    // Sanitize input
    $this->item_id = htmlspecialchars(strip_tags($this->item_id));
    $this->reviewer_name = htmlspecialchars(strip_tags($this->reviewer_name));
    $this->review_text = htmlspecialchars(strip_tags($this->review_text));
    $this->rating = htmlspecialchars(strip_tags($this->rating));
    // Bind parameters
    $stmt->bindParam(":item_id", $this->item_id);
    $stmt->bindParam(":reviewer_name", $this->reviewer_name);
    $stmt->bindParam(":review_text", $this->review_text);
    $stmt->bindParam(":rating", $this->rating);
    if($stmt->execute()) {
        return true;
    }
    return false;
    }
    
    public function readByItem($item_id) {
        $query = "SELECT * FROM " . self::TABLE_NAME . " 
                 WHERE item_id = :item_id 
                 ORDER BY created_at DESC";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(":item_id", $item_id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt;
    }
    
    public function getAverageRating($item_id) {
        $query = "SELECT AVG(rating) as average_rating FROM " . self::TABLE_NAME . " 
    WHERE item_id = :item_id";
    $stmt = $this->pdo->prepare($query);
    $stmt->bindParam(":item_id", $item_id);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row['average_rating'] ? round($row['average_rating'], 1) : 0;
    }
}
?>