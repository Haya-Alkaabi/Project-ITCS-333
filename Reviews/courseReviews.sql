DROP TABLE IF EXISTS course_reviews;

CREATE TABLE course_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(255),
    reviewer_name VARCHAR(255),
    category ENUM('Information system', 'Engineering', 'Mathamatics'),
    review_text TEXT,
    rating INT(5),
    level VARCHAR(4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO course_reviews (course_code, reviewer_name, category, review_text, rating, level)
VALUES
('IT101', 'Sara Ali', 'Information system', 'Great introduction to IT.', 5, '100'),
('ENG201', 'Ahmed Hasan', 'Engineering', 'Very technical but useful.', 4, '200'),
('MATH150', 'Lina Yusuf', 'Mathamatics', 'Challenging exam, good practice.', 3, '150');

