<?php

/**
 * Database Helper for Item-Class 
 * which is for market items 
 */
const TABLE_NAME = 'marketitems';

class Item {
    private $pdo;
    public $id;
    private $title;
    private $author;
    private $price;
    private $category;
    private $image_path;
    private $format;
    private $contact;
    private $overview;
    private $quantity;
    private $student_id;
    private $email;
    private $college;
    private $major;

    //constructor 
    public function __construct($pdo, $id=null, $title=null, $author=null, $price=null, $category=null, $image_path=null, $format=null, $contact=null, $overview=null, $quantity=null, $student_id=null, $email=null, $college=null, $major=null) {
        $this->pdo = $pdo;
        $this->id = $id;
        $this->title = $title ?? '';
        $this->author = $author ?? '';
        $this->price = $price ?? 0;
        $this->category = $category ?? 'books';
        $this->image_path = $image_path ?? '';
        $this->format = $format ?? '';
        $this->contact = $contact ?? null;  // Explicitly allow null
        $this->overview = $overview ?? '';
        $this->quantity = $quantity ?? 1;
        $this->student_id = $student_id ?? '';
        $this->email = $email ?? '';
        $this->college = $college ?? '';
        $this->major = $major ?? '';
    }

    public function read() {
        $query = "SELECT * FROM " . TABLE_NAME . " ORDER BY created_at DESC";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function readPaged($limit, $offset) {
        $query = "SELECT * FROM " . TABLE_NAME . " ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt;
    }

    public function readOne() {
        error_log("readOne() called with ID: " . $this->id);
        $query = "SELECT * FROM " . TABLE_NAME . " WHERE id = ? LIMIT 1";
        $stmt = $this->pdo->prepare($query);
        
        // Use proper parameter binding
        $stmt->execute([$this->id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            // Assign all properties including the ones you added to the array
            $this->id = $row['id']; // Make sure to set the ID
            $this->title = $row['title'];
            $this->author = $row['author'];
            $this->price = $row['price'];
            $this->category = $row['category'];
            $this->image_path = $row['image_path'];
            $this->format = $row['format'];
            $this->contact = $row['contact'];
            $this->overview = $row['overview'];
            $this->quantity = $row['quantity'];
            $this->student_id = $row['student_id'] ?? ''; // Added null coalescing
            $this->email = $row['email'] ?? '';
            $this->college = $row['college'] ?? '';
            $this->major = $row['major'] ?? '';
            return true; //success
        }
        return false; //fail
    }

    public function createItem() {
        $query = "INSERT INTO " . TABLE_NAME . " 
                SET title=:title, author=:author, price=:price, category=:category, 
                image_path=:image_path, format=:format, contact=:contact, overview=:overview,
                quantity=:quantity, student_id=:student_id, email=:email, college=:college, major=:major";

        // Validate required fields
        if (empty($this->title) || empty($this->author)) {
            return false;
        }
        // Prepare query
        $stmt = $this->pdo->prepare($query);

        // Sanitize
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->author = htmlspecialchars(strip_tags($this->author));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->category = htmlspecialchars(strip_tags($this->category));
        $this->image_path = htmlspecialchars(strip_tags($this->image_path));
        $this->format = htmlspecialchars(strip_tags($this->format));
        $this->contact = htmlspecialchars(strip_tags($this->contact));
        $this->overview = htmlspecialchars(strip_tags($this->overview));
        $this->quantity = htmlspecialchars(strip_tags($this->quantity));
        $this->student_id = htmlspecialchars(strip_tags($this->student_id));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->college = htmlspecialchars(strip_tags($this->college));
        $this->major = htmlspecialchars(strip_tags($this->major));

        // Bind
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":author", $this->author);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":category", $this->category);
        $stmt->bindParam(":image_path", $this->image_path);
        $stmt->bindParam(":format", $this->format);
        $stmt->bindParam(":contact", $this->contact);
        $stmt->bindParam(":overview", $this->overview);
        $stmt->bindParam(":quantity", $this->quantity);
        $stmt->bindParam(":student_id", $this->student_id);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":college", $this->college);
        $stmt->bindParam(":major", $this->major);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function count() {
        $query = "SELECT COUNT(*) as total FROM " . TABLE_NAME;
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total'];
    }

    public function search($keywords) {
        $query = "SELECT * FROM " . TABLE_NAME . " 
                 WHERE title LIKE :keywords OR author LIKE :keywords OR overview LIKE :keywords
                 ORDER BY created_at DESC";

        $stmt = $this->pdo->prepare($query);
        $keywords = "%" . htmlspecialchars(strip_tags($keywords)) . "%";
        $stmt->bindParam(":keywords", $keywords);
        $stmt->execute();
        return $stmt;
    }

    public function filterByCategory($category) {
        $query = "SELECT * FROM " . TABLE_NAME . " WHERE category = :category ORDER BY created_at DESC";
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(":category", $category);
        $stmt->execute();
        return $stmt;
    }
}
?>