<?php

// Turn on all error reporting at the VERY TOP
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Add connection test
require_once '../config/db.php';
$pdo = connectDB();

// Basic connection test
try {
    $pdo->query("SELECT 1");
} catch (PDOException $e) {
    die(json_encode([
        'status' => 'error',
        'message' => 'Database connection failed',
        'error' => $e->getMessage()
    ]));
}

// Turn off error display but log them
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__.'/../../logs/php_errors.log');

//headers for JSON API
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

session_start();

// Include necessary files which are the helper and database
require_once '../config/db.php';
require_once '../models/item.php';


$pdo = connectDB();
$item = new Item($pdo);

$method = $_SERVER['REQUEST_METHOD'];

// switch the request based on the endpoint
switch ($method) {
    case 'GET':
    if(isset($_GET['id'])) {
        $item->id = $_GET['id'];

        if($item->readOne()) {
            $item_arr = [
                "id" => $item->id,
                "title" => $item->title,
                "author" => $item->author,
                "price" => $item->price,
                "category" => $item->category,
                "image" => $item->image_path,
                "format" => $item->format,
                "contact" => $item->contact,
                "overview" => $item->overview,
                "quantity" => $item->quantity,
                "student_id" => $item->student_id,
                "email" => $item->email,
                "college" => $item->college,
                "major" => $item->major
            ];
            http_response_code(200);
            echo json_encode($item_arr);
        } else {
            http_response_code(404);
            echo json_encode([
                "message" => "Item not found",
                "requested_id" => $_GET['id'],
                "success" => false
            ]);
        }
    } else {
        // Get all items with pagination
        $page = isset($_GET['page']) ? $_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? $_GET['limit'] : 4;
        $offset = ($page - 1) * $limit;

        // Check for search
        if(isset($_GET['search'])) {
            $stmt = $item->search($_GET['search']);
        } 
        // Check for category filter
        elseif(isset($_GET['category']) && $_GET['category'] != 'all') {
            $stmt = $item->filterByCategory($_GET['category']);
        } 
        // Default case - get all items
        else {
            $stmt = $item->readPaged($limit, $offset);
        }

        $num = $stmt->rowCount();

        if($num > 0) {
            $items_arr = [];
            $items_arr["data"] = [];
            $items_arr["pagination"] = [];

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);

                $item_item = [
                    "id" => $id,
                    "title" => $title,
                    "author" => $author,
                    "price" => $price,
                    "category" => $category,
                    "image" => $image_path,
                    "format" => $format,
                    "contact" => $contact,
                    "overview" => $overview,
                    "quantity" => $quantity
                ];

                array_push($items_arr["data"], $item_item);
            }

            // Pagination info
            $total_rows = $item->count();
            $total_pages = ceil($total_rows / $limit);

            $items_arr["pagination"] = [
                "total_rows" => $total_rows,
                "total_pages" => $total_pages,
                "current_page" => (int)$page,
                "limit" => (int)$limit
            ];

            http_response_code(200);
            echo json_encode($items_arr);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "No items found."]);
        }
    }
    break;

    case 'POST':
        // Handle form submission with file upload
        try {
            if (!isset($_FILES["itemImage"]) || $_FILES["itemImage"]["error"] !== UPLOAD_ERR_OK) {
                throw new Exception("No file uploaded or upload error occurred");
            }
            
            require_once '../config/upload.php';
            $image_path = handleFileUpload();

            // Get posted data
            $data = (object)$_POST;

            if(!empty($data->title)) {
                // Create new Item instance with all parameters
                $item = new Item(
                    $pdo,
                    null, // id
                    $data->title,
                    $data->author,
                    $data->price,
                    $data->category,
                    $image_path,
                    $data->format,
                    $data->contact ?? null, // Ensure contact is set or defaults to null
                    $data->overview,
                    $data->quantity,
                    $data->student_id,
                    $data->email,
                    $data->college,
                    $data->major
                );

                if($item->createItem()) {
                    http_response_code(201);
                    echo json_encode(["message" => "Item was created.", "image_path" => $image_path]);
                } else {
                    http_response_code(503);
                    echo json_encode(["message" => "Unable to create item."]);
                }
            } else {
                http_response_code(400);
                echo json_encode(["message" => "Data is incomplete."]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["message" => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed."]);
}
?>