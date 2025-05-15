<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../config/db.php';
require_once '../models/review.php';
require_once '../models/item.php';

$pdo = connectDB();

// Set headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

session_start();

// Include necessary files which are the helper and database
require_once '../config/db.php';


$pdo = connectDB();
$review = new Review($pdo);

// Get the HTTP method
$method = $_SERVER['REQUEST_METHOD'];

// Process request
switch ($method) {
    case 'GET':
        // Validate item_id parameter
        if (!isset($_GET['item_id'])) {
            http_response_code(400);
            echo json_encode(["message" => "Item ID is required"]);
            break;
        }
        $itemId = $_GET['item_id'];
        try {
            // Get reviews from database
            $reviews = $review->readByItem($itemId)->fetchAll(PDO::FETCH_ASSOC);
            $average = $review->getAverageRating($itemId);

            // Return successful response
            echo json_encode([
                    "status" => "success",
                    "reviews" => $reviews,
                    "average_rating" => $average
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Database error: " . $e->getMessage()]);
        }
        break;
case 'POST':
    try {

        $rawInput = file_get_contents('php://input');
        $data = json_decode($rawInput, true);

        // // Validate JSON decoding
        if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid JSON data received');
        }

        // Check for required fields with more flexible validation
        $required = ['item_id', 'review_text', 'rating'];
        $missing = array_diff($required, array_keys($data));

        if (!empty($missing)) {
            throw new Exception('Missing required fields: ' . implode(', ', $missing));
        }

        // Sanitize and validate data
        $id = $data['item_id'];
        $review_text = $data['review_text'];
        $rating = filter_var($data['rating'], FILTER_VALIDATE_INT, [
            'options' => ['min_range' => 1, 'max_range' => 5]
        ]);

        if ($id === false || $rating === false || empty($review_text)) {
            throw new Exception('Invalid field values');
        }

        $reviewer_name = isset($data['reviewer_name']) ? 
            trim($data['reviewer_name']) : 'Anonymous';

        // Set review properties
        $review->item_id = $id;
        $review->reviewer_name = $reviewer_name;
        $review->rating = $rating;
        $review->review_text = $review_text;

        // Create review
        if (!$review->createReview()) {
            throw new Exception("Failed to create review in database");
        }

        // Get updated reviews
        $reviews = $review->readByItem($id)->fetchAll(PDO::FETCH_ASSOC);
        $average = $review->getAverageRating($id);

        // Send response
        header('Content-Type: application/json');
        http_response_code(201);
        echo json_encode([
            'status' => 'success',
            'message' => 'Review created',
            'reviews' => $reviews,
            'average_rating' => $average
        ]);
        exit;

    } catch (Exception $e) {
        error_log("Review submission error: ".$e->getMessage());
        header('Content-Type: application/json');
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => $e->getMessage(),
            'received_data' => $data ?? null
        ]);
        exit;
    }
    break;
        
        // // Verify content type
        // if (!isset($_SERVER['CONTENT_TYPE']) || stripos($_SERVER['CONTENT_TYPE'], 'application/json') === false) {
        //     throw new Exception("Content-Type must be application/json");
        // }

        // Get and validate input
        // $input = file_get_contents('php://input');
        // if (empty($input)) {
        //     throw new Exception("No input data received");
        // }

        // $data = json_decode(file_get_contents('php://input'), true);

        // if (!isset($data['item_id']) || !isset($data['review_text'] || !isset($data['rating']) {
        //     throw new Exception('Missing required fields.');
        // }

        // // Validate required fields
        // $required = ['item_id', 'review_text'];
        // foreach ($required as $field) {
        //     if (empty($data->$field)) {
        //         throw new Exception("Missing required field: ".$field);
        //     }
        // }

        // $id = $data['item_id'];
        // $review_text = $data['review_text'];
        // $rating = $data['rating'];

        // // Sanitize and validate data
        // $review->item_id = filter_var($data->item_id, FILTER_VALIDATE_INT);
        // $review->review_text = htmlspecialchars(strip_tags($data->review_text));
        // $review->rating = isset($data->rating) ? 
        //     min(max(1, (int)$data->rating), 5) : 5;
        // $review->reviewer_name = !empty($data->reviewer_name) ? 
        //     htmlspecialchars(strip_tags($data->reviewer_name)) : 'Anonymous';

        // if ($review->item_id === false) {
        //     throw new Exception("Invalid item ID");
        // }

        // $review = new Review(, $)
        
        // // Create review
        // if (!$review->createReview()) {
        //     throw new Exception("Failed to create review in database");
        // }

        // // Get updated reviews
        // $reviews = $review->readByItem($data->item_id)->fetchAll(PDO::FETCH_ASSOC);
        // $average = $review->getAverageRating($data->item_id);

        // // Send clean JSON response
        // header('Content-Type: application/json');
        // http_response_code(201);
        // echo json_encode([
        //     'status' => 'success',
        //     'message' => 'Review created',
        //     'reviews' => $reviews,
        //     'average_rating' => $average
        // ]);
        // exit;

    // } catch (Exception $e) {
    //     // Log the error
    //     error_log("Review submission error: ".$e->getMessage());

    //     // Send clean error response
    //     header('Content-Type: application/json');
    //     http_response_code(400);
    //     echo json_encode([
    //         'status' => 'error',
    //         'message' => $e->getMessage()
    //     ]);
    //     exit;
    // }
    // break;
    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
}
    ?>