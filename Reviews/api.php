<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'database.php';
require_once 'Review.php';

$database = new Database();
$db = $database->connect();
$review = new Review($db);

// Utility for success
function respond($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

// Utility for error
function error($message, $code = 400) {
    respond(['success' => false, 'message' => $message], $code);
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $id = $_GET['id'] ?? null;
        $category = $_GET['category'] ?? null;
        $sortBy = $_GET['sortBy'] ?? null;
        $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
        $limit = 6; // Items per page

        if ($id) {
            $result = $review->getReviewById($id);
            $result ? respond(['success' => true, 'review' => $result]) : error('Review not found', 404);
        } else {
            $result = $review->getReviews($category, $sortBy, $page, $limit);
            respond(['success' => true, 'reviews' => $result['data'], 'totalPages' => $result['totalPages'], 'page' => $page]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['course_code'], $data['reviewer_name'], $data['rating'], $data['review_text'], $data['category'])) {
            error("Missing fields", 422);
        }

        $result = $review->addReview(
            $data['course_code'],
            $data['reviewer_name'],
            (int)$data['rating'],
            $data['review_text'],
            $data['category']
        );

        $result['success'] ? respond($result, 201) : error($result['message'], 500);
        break;

    case 'PUT':
        parse_str($_SERVER['QUERY_STRING'], $query);
        $id = $query['id'] ?? null;

        if (!$id) {
            error("Missing review ID in query", 400);
        }

        $data = json_decode(file_get_contents("php://input"), true);
        $courseName = $data['course_name'] ?? '';
        $reviewerName = $data['reviewer'] ?? '';
        $rating = $data['rating'] ?? '';
        $comment = $data['comment'] ?? '';

        $result = $review->updateReview($id, $courseName, $reviewerName, $rating, $comment);
        $result['success'] ? respond($result) : error($result['message'], 500);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) error("Missing ID to delete", 400);

        $result = $review->deleteReview($id);
        $result['success'] ? respond($result) : error($result['message'], 500);
        break;

    default:
        error("Method not allowed", 405);
}
