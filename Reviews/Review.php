<?php
class Review
{
    private $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function addReview($course_code, $reviewer_name, $rating, $review_text, $category)
    {
        try {
            $sql = "INSERT INTO course_reviews (course_code, reviewer_name, rating, review_text, category, created_at)
                VALUES (:course_code, :reviewer_name, :rating, :review_text, :category, NOW())";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                ':course_code' => $course_code,
                ':reviewer_name' => $reviewer_name,
                ':rating' => $rating,
                ':review_text' => $review_text,
                ':category' => $category
            ]);

            return ['success' => true, 'message' => 'Review added successfully'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Database error: ' . $e->getMessage()];
        }
    }


    // Read all (with filters & pagination)
    public function getReviews($category = null, $sortBy = null, $page = 1, $limit = 6)
    {
        try {
            $offset = ($page - 1) * $limit;

            $sql = "SELECT * FROM course_reviews";
            $where = [];
            $params = [];

            if ($category) {
                $where[] = "category = :category";
                $params[':category'] = $category;
            }

            if (!empty($where)) {
                $sql .= " WHERE " . implode(" AND ", $where);
            }

            if ($sortBy === 'rating') {
                $sql .= " ORDER BY rating DESC";
            } elseif ($sortBy === 'level') {
                $sql .= " ORDER BY course_code ASC";
            } else {
                $sql .= " ORDER BY created_at DESC";
            }

            $sql .= " LIMIT :limit OFFSET :offset";

            $stmt = $this->db->prepare($sql);
            foreach ($params as $key => $val) {
                $stmt->bindValue($key, $val);
            }
            $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);

            $stmt->execute();
            $rawReviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Transform keys to match frontend expectation
            $reviews = array_map(function ($row) {
                return [
                    'id' => $row['id'],
                    'course_name' => $row['course_code'],
                    'reviewer' => $row['reviewer_name'],
                    'rating' => $row['rating'],
                    'comment' => $row['review_text'],
                    'category' => $row['category'],
                    'created_at' => $row['created_at']
                ];
            }, $rawReviews);

            // Count total for pagination
            $countSql = "SELECT COUNT(*) FROM course_reviews";
            if (!empty($where)) {
                $countSql .= " WHERE " . implode(" AND ", $where);
            }

            $countStmt = $this->db->prepare($countSql);
            foreach ($params as $key => $val) {
                $countStmt->bindValue($key, $val);
            }
            $countStmt->execute();
            $total = $countStmt->fetchColumn();
            $totalPages = ceil($total / $limit);

            return ['data' => $reviews, 'totalPages' => $totalPages];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Error fetching reviews: ' . $e->getMessage()];
        }
    }

    // Read single review
    public function getReviewById($id)
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM course_reviews WHERE id = ?");
            $stmt->execute([$id]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return null;
        }
    }

    public function updateReview($id, $course_code, $reviewer_name, $rating, $review_text)
    {
        $sql = "UPDATE course_reviews 
            SET course_code = :course_code, 
                reviewer_name = :reviewer_name, 
                rating = :rating, 
                review_text = :review_text 
            WHERE id = :id";

        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':course_code', $course_code);
        $stmt->bindParam(':reviewer_name', $reviewer_name);
        $stmt->bindParam(':rating', $rating, PDO::PARAM_INT);
        $stmt->bindParam(':review_text', $review_text);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Review updated successfully'];
        } else {
            return ['success' => false, 'message' => 'Failed to update review'];
        }
    }

    // Delete
    public function deleteReview($id)
    {
        try {
            $stmt = $this->db->prepare("DELETE FROM course_reviews WHERE id = ?");
            $stmt->execute([$id]);

            return ['success' => true, 'message' => 'Review deleted successfully'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Error deleting review: ' . $e->getMessage()];
        }
    }
}
