# MERN Backend – Scalable REST API with JWT Authentication

## Project Overview

This project is a **scalable backend API** built using **Node.js, Express, and MongoDB** implementing secure authentication, role-based access control, and CRUD operations for task management.

The system demonstrates **production-ready backend practices**, including:

* JWT Authentication (Access + Refresh Tokens)
* Secure HTTP-only cookie handling
* Role-Based Access Control (RBAC)
* Modular MVC architecture
* REST API versioning
* Token rotation & session security

Built as part of a **Backend Developer Internship Assignment** to showcase backend system design and scalability concepts.

---

## Architecture Overview

```
Client (React / Postman)
        │
        ▼
   Express API Layer
        │
Authentication Middleware (JWT)
        │
Controllers → Services → Models
        │
      MongoDB
```

The backend follows a **modular MVC pattern** ensuring scalability and maintainability.

---

## Tech Stack

### Backend

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**

### Authentication & Security

* **JWT (jsonwebtoken)**
* **bcrypt**
* **HTTP-only Cookies**
* **Refresh Token Rotation**

### Utilities

* Custom Error Handling
* Async Middleware Wrapper
* Structured API Responses

---

## Project Structure

```
backend/
│
├── src/
│   ├── controllers/
│   │     ├── auth.controllers.js
│   │     └── task.controllers.js
│   │
│   ├── models/
│   │     ├── user.models.js
│   │     └── task.models.js
│   │
│   ├── routes/
│   │     ├── auth.routes.js
│   │     └── task.routes.js
│   │
│   ├── middlewares/
│   │     ├── auth.middleware.js
│   │     └── errorHandler.middleware.js
│   │
│   ├── utils/
│   │     ├── ApiError.js
│   │     ├── ApiResponse.js
│   │     └── asyncHandler.js
│   │
│   ├── database/
│   │      └── db.js
│   ├── app.js
│   ├── index.js
│
│
└── package.json
└── .env
```

---

## 🔐 Authentication Flow

```
Signup/Login
      ↓
Access Token Issued (Short-lived)
      ↓
Protected API Access
      ↓
Access Token Expires
      ↓
Refresh Token Used
      ↓
New Access Token Generated
      ↓
Session Continues Securely
```

### Token Strategy

| Token         | Purpose           | Storage          |
| ------------- | ----------------- | ---------------- |
| Access Token  | API Authorization | HTTP-only Cookie |
| Refresh Token | Session Renewal   | DB + Cookie      |

---

## Features

✅ User Registration & Login
✅ JWT Authentication
✅ Refresh Token Rotation
✅ Secure Logout (token invalidation)
✅ Role-Based Access Control (User/Admin)
✅ Protected Routes Middleware
✅ CRUD APIs for Tasks
✅ Global Error Handling
✅ API Versioning (`/api/v1`)

---

##  API Endpoints

###  Authentication

| Method | Endpoint                     | Description          |
| ------ | ---------------------------- | -------------------- |
| POST   | `/api/v1/auth/signup`        | Register user        |
| POST   | `/api/v1/auth/login`         | Login user           |
| POST   | `/api/v1/auth/refresh-token` | Refresh access token |
| POST   | `/api/v1/auth/logout`        | Logout user          |
| GET    | `/api/v1/auth/me`            | Get current user     |

---

###  Tasks (Protected)

| Method | Endpoint            | Description |
| ------ | ------------------- | ----------- |
| GET    | `/api/v1/tasks`     | Get tasks   |
| POST   | `/api/v1/tasks`     | Create task |
| PUT    | `/api/v1/tasks/:id` | Update task |
| DELETE | `/api/v1/tasks/:id` | Delete task |

---

##  Environment Variables

Create `.env` file:

```
PORT=3001
MONGO_URI=your_mongodb_connection

ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret

ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

---

##  Installation & Setup

```bash
# Clone repository
git clone <repo-url>

# Move into backend
cd backend

# Install dependencies
npm install

# Run development server
npm run dev
```

Server runs at:

```
http://localhost:3001
```

---

##  Security Practices Implemented

* Password hashing using bcrypt
* HTTP-only cookies
* JWT expiration handling
* Refresh token validation against database
* Token rotation mechanism
* Centralized error handling
* Input validation
* Role-based authorization

---

##  Scalability Considerations

The backend is designed with scalability in mind:

* Stateless JWT authentication allows horizontal scaling
* Modular architecture enables microservice separation
* Database indexing supports performance optimization
* Refresh-token rotation improves session security

### Future Improvements

* Redis caching layer
* API Gateway integration
* Rate limiting
* Docker deployment
* Background job queues

---

##  Testing

APIs can be tested using:

* Postman Collection (included)
* Browser frontend client

---

##  Author

**Aman Kumar**
Backend Developer (MERN Stack)

---

##  License

This project is created for evaluation and educational purposes.
