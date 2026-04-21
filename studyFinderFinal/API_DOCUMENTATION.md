# 📘 Study Group API Documentation

This API handles the backend operations for managing study groups (Create, Read, Delete).

---

## 📥 POST /api/study_groups.php

**Description:** Add a new study group  
**Request Format:** `application/json`

### Body Parameters:
```json
{
  "name": "AI Team",
  "subject": "Artificial Intelligence",
  "meeting": "Room 404",
  "contact": "team@university.com"
}
```

### Response:
```json
{ "message": "Group added successfully" }
```

---

## 📤 GET /api/study_groups.php

**Description:** Retrieve all study groups

### Response:
```json
[
  {
    "id": 1,
    "name": "AI Team",
    "subject": "Artificial Intelligence",
    "meeting_details": "Room 404",
    "contact_email": "team@university.com",
    "created_at": "2025-05-13 22:32:00"
  }
]
```

---

## ❌ DELETE /api/study_groups.php?id={id}

**Description:** Delete a study group by its id

### Example:
```http
DELETE /api/study_groups.php?id=3
```

### Response:
```json
{ "message": "Group deleted" }
```

---

## 🛡️ Notes

- The database used is: `campus_hub`
- The table: `study_groups`
- The backend is built using PHP and PDO with proper error handling.
- Inputs are validated and sanitized.
- Responses are returned as JSON.