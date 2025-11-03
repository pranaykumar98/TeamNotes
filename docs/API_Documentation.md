# 📘 API Documentation — TeamNotes

This document provides detailed information about all backend endpoints for **TeamNotes**.

---

## 🧩 Base URL
```
http://localhost:5000/api
```
When deployed:
```
https://teamnotes-api.onrender.com/api
```

---

## 🔐 Authentication APIs

### 1️⃣ Signup — `POST /auth/signup`

**Description:** Registers a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "mypassword123"
}
```

**Success Response:**
```json
{
  "message": "Signup Successful",
  "token": "<jwt_token>",
  "user": {
    "id": "6714a2c1e4b0d4e9ab4e37a1",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `400` – Missing fields (name, email, password)
- `409` – Email already registered

---

### 2️⃣ Login — `POST /auth/login`

**Description:** Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "mypassword123"
}
```

**Success Response:**
```json
{
  "message": "Login Successful",
  "token": "<jwt_token>",
  "user": {
    "id": "6714a2c1e4b0d4e9ab4e37a1",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `400` – Email and Password required
- `401` – Invalid credentials or user not found

---

## 🗒️ Notes APIs

> Requires Authentication Header:
```
Authorization: Bearer <jwt_token>
```

### 3️⃣ Get All Notes — `GET /notes`

**Optional Query:** `?search=term` (case-insensitive match on title/content/tags)

**Success Response:**
```json
[
  {
    "_id": "6714a4b9e4b0d4e9ab4e37d3",
    "title": "Team Meeting Notes",
    "content": "Discussed project updates and deadlines.",
    "tags": ["meeting", "team"],
    "createdBy": "6714a2c1e4b0d4e9ab4e37a1",
    "createdAt": "2025-10-30T12:22:00.000Z"
  }
]
```

---

### 4️⃣ Create Note — `POST /notes`

**Request Body:**
```json
{
  "title": "New Task Plan",
  "content": "Outline for next sprint tasks.",
  "tags": ["planning", "tasks"]
}
```

**Success Response:**
```json
{
  "message": "Note created successfully",
  "note": {
    "_id": "6714a4b9e4b0d4e9ab4e37d3",
    "title": "New Task Plan",
    "content": "Outline for next sprint tasks.",
    "tags": ["planning", "tasks"],
    "createdBy": "6714a2c1e4b0d4e9ab4e37a1",
    "createdAt": "2025-10-30T12:22:00.000Z"
  }
}
```

---

### 5️⃣ Update Note — `PUT /notes/:id`

**Request Body:**
```json
{
  "title": "Updated Task Plan",
  "content": "Revised sprint backlog.",
  "tags": ["update", "tasks"]
}
```

**Success Response:**
```json
{
  "message": "Note updated successfully",
  "note": {
    "_id": "6714a4b9e4b0d4e9ab4e37d3",
    "title": "Updated Task Plan",
    "content": "Revised sprint backlog.",
    "tags": ["update", "tasks"]
  }
}
```

---

### 6️⃣ Delete Note — `DELETE /notes/:id`

**Success Response:**
```json
{
  "message": "Note deleted successfully"
}
```

**Error Response:**
- `404` – Note not found

---

## 📊 Analytics APIs

> Requires Authentication Header:
```
Authorization: Bearer <jwt_token>
```

### 7️⃣ Summary — `GET /analytics/summary`

**Description:** Returns user’s analytics data.

**Success Response:**
```json
{
  "totalNotes": 8,
  "notesPerDay": [
    { "date": "2025-10-27", "count": 2 },
    { "date": "2025-10-28", "count": 1 },
    { "date": "2025-10-29", "count": 3 },
    { "date": "2025-10-30", "count": 2 }
  ],
  "topTags": [
    { "tag": "work", "count": 5 },
    { "tag": "personal", "count": 3 },
    { "tag": "meeting", "count": 2 }
  ]
}
```

---

## ⚠️ Error Response Format

**Example:**
```json
{
  "message": "Invalid Token"
}
```

---

## ✅ Testing Tools

You can use **Postman** or **Thunder Client** for testing.  
Remember to include the **Bearer Token** in the request headers for protected routes.

---

## 👨‍💻 Author

**Pranay Manepally**  
Full-Stack Developer (MERN)  
📧 Email: [manepallypranay98@gmail.com](mailto:manepallypranay98@gmail.com)  
🔗 LinkedIn: [https://www.linkedin.com/in/pranay-manepally/](https://www.linkedin.com/in/pranay-manepally/)
