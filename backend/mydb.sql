USE mydb;

-- Main market-items table
CREATE TABLE marketitems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category ENUM('books', 'notes', 'external') NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    format VARCHAR(50) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    overview TEXT NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    student_id VARCHAR(9) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    college ENUM('it', 'science', 'law', 'engineering', 'business', 'healthSC', 'arts', 'appStudies', 'teachers') NOT NULL,
    major VARCHAR(100) NOT NULL
);

-- market-Reviews table
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    reviewer_name VARCHAR(100) DEFAULT 'Anonymous',
    review_text TEXT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES marketitems(id) ON DELETE CASCADE
);