CREATE TABLE course_reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_code TEXT,
    reviewer_name TEXT,
    category TEXT,
    review_text TEXT,
    rating INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO course_reviews (course_code, reviewer_name, category, review_text, rating)
VALUES ('IT101', 'Sara Ali', 'Information system', 'Great intro to IT.', 5);
