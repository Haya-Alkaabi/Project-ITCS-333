# 📚 Study Group Finder (Phase 3)

This module is part of the Campus Hub project. It allows students to find, add, and manage study groups with meeting information and contact details.

## 🔧 Technologies Used

- HTML, CSS, JavaScript (Frontend)
- PHP (Backend API)
- MySQL (Database)
- PDO for secure DB interaction

## 🚀 Features

- Add a new study group via `studyForm.html`
- View all groups in `studyFinder.html`
- Delete study groups dynamically
- Responsive UI using Tailwind CSS

## 📁 Folder Structure

```
studyFinderFinal/
├── api/
│   └── study_groups.php
├── db.php
├── studyForm.html
├── studyFinder.html
├── studyFinder.js
├── studyDetail.html
├── API_DOCUMENTATION.md
└── README.md
```

## 🔌 API Overview

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for full details.

- `GET /api/study_groups.php` → List all groups
- `POST /api/study_groups.php` → Add new group
- `DELETE /api/study_groups.php?id={id}` → Delete group

## 🛠️ Setup (Local via XAMPP)

1. Move project folder into `C:/xampp/htdocs`
2. Create DB `campus_hub` and import table:
```sql
CREATE TABLE study_groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  subject VARCHAR(100),
  meeting_details TEXT,
  contact_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
3. Run Apache & MySQL via XAMPP.
4. Access the frontend via:  
   `http://localhost/Project-ITCS-333/studyFinderFinal/studyFinder.html`

## 👥 Team

- Your Name (your.email@domain.com)
- Add other team members here

## 📝 License

For academic use only.