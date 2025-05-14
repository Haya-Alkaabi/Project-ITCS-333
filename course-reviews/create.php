<?php
// Enable error reporting for debugging purposes (remove in production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Database connection
$host = "127.0.0.1"; // Your database host
$dbname = getenv("db_name"); // Your database name
$username = getenv("db_user"); // Your database username
$password = getenv("db_pass"); // Your database password

// Create a PDO connection
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
    exit;
}

// Check if form is submitted and process the data
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize form data
    $title = trim($_POST['title']);
    $content = trim($_POST['content']);
    $category = trim($_POST['category']);
    $author = trim($_POST['author']);
    $publish_date = $_POST['publish-date'];
    $created_at = date('Y-m-d H:i:s'); // Current date and time

    // Handle image upload
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $image_name = basename($_FILES['image']['name']);
        $image_tmp_name = $_FILES['image']['tmp_name'];
        $upload_dir = 'uploads/'; // The folder where the image will be saved
        $image_path = $upload_dir . $image_name;

        // Validate image type
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
        if (!in_array($_FILES['image']['type'], $allowed_types)) {
            echo json_encode(['error' => 'Only JPEG, PNG, and GIF images are allowed']);
            exit;
        }

        // Validate image size (max 2MB)
        if ($_FILES['image']['size'] > 2 * 1024 * 1024) {
            echo json_encode(['error' => 'Image size must be less than 2MB']);
            exit;
        }

        // Move uploaded image to the desired folder
        if (!move_uploaded_file($image_tmp_name, $image_path)) {
            echo json_encode(['error' => 'Failed to upload image']);
            exit;
        }
    } else {
        echo json_encode(['error' => 'Image upload error']);
        exit;
    }

    // Prepare and execute the database insertion
    $sql = 'INSERT INTO articles (title, content, category, image_path, author, publish_date, created_at) 
            VALUES (:title, :content, :category, :image_path, :author, :publish_date, :created_at)';

    $stmt = $pdo->prepare($sql);

    // Bind parameters
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':content', $content);
    $stmt->bindParam(':category', $category);
    $stmt->bindParam(':image_path', $image_path);
    $stmt->bindParam(':author', $author);
    $stmt->bindParam(':publish_date', $publish_date);
    $stmt->bindParam(':created_at', $created_at);

    try {
        $stmt->execute();
        echo json_encode(['success' => 'Article published successfully']);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request']);
}
?>
