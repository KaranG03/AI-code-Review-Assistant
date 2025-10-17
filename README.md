# 🤖 AI-Powered Code Review Assistant

An advanced **AI-driven Code Review Assistant** web application that analyzes uploaded source code files, generates detailed feedback using Gemini flash 2.0 Large Language Model (LLM), and provides a beautiful, interactive dashboard for users to view their code review history.

![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![AI](https://img.shields.io/badge/Powered%20By-AI%20%26%20LLM-orange)

---


###  Demo Video  : 

High Quality Video Link: https://drive.google.com/file/d/1nzdGBESo3UcnvgYxBIFP0YBnnbjPCrCh/view?usp=sharing


## 🌟 Overview

The **Code Review Assistant** leverages AI to simulate the experience of having a professional software engineer review your code.  
Users can upload their code files, receive structured, in-depth feedback, and access past analyses in a secure and seamless environment.

![image alt](https://github.com/KaranG03/eCom/blob/main/pic1.png?raw=true)

---

## 🧠 Core Functionality

- **Upload Source Code:** Users upload `.java`, `.cpp`, `.py`, or other supported source files.
- **AI Code Review:** The backend sends the code to Gemini LLM with a carefully engineered prompt for consistent, structured responses.
- **Comprehensive Feedback:** The AI returns a rich JSON object containing:
  - ✅ **Code Summary**
  - 🛠️ **Corrected Code**
  - 💬 **Positive & Critical Feedback**
  - 🧩 **Security Vulnerabilities**
  - ⏱️ **Worst-Case Time & Space Complexity**
- **User History:** All reviews are saved for authenticated users and can be revisited later.
- **Interactive Visualization:** Graphs plot the algorithm’s **time and space complexity** growth rates dynamically.

![pic5](https://github.com/KaranG03/eCom/blob/main/pic5.png?raw=true)  
## 
![pic6](https://github.com/KaranG03/eCom/blob/main/pic6.png?raw=true)

##  
![pic8](https://github.com/KaranG03/eCom/blob/main/pic8.png?raw=true)  

##  

![pic9](https://github.com/KaranG03/eCom/blob/main/pic9.png?raw=true)  


---

## ⚙️ Technology Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React, React Router, Recharts |
| **Backend** | Spring Boot (Java), Spring Security, Spring AI |
| **Database** | MongoDB |
| **Authentication** | Clerk |
| **Hosting** | (Optional) Vercel / Render / AWS / Azure |

---

## 🔐 Secure Authentication

- **Clerk** handles user registration, login, and JWT management.
- **Spring Security** protects backend APIs.
- Every request from the frontend includes a **JWT token**, which the backend verifies before allowing access to protected routes.

![image alt](https://github.com/KaranG03/eCom/blob/main/pic2.png?raw=true)

##   
![pic3](https://github.com/KaranG03/eCom/blob/main/pic3.png?raw=true)  

##  
![pic4](https://github.com/KaranG03/eCom/blob/main/pic4.png?raw=true)  

---

## 🧩 Backend Architecture

### Key Endpoints

| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/review-code` | `POST` | Upload code file for AI review |
| `/history` | `GET` | Fetch all code reviews for an authenticated user |


### LLM Integration
The backend uses **Spring AI** to interact with Gemini Flash 2.0 Large Language Model.  

It crafts structured prompts to return **machine-readable JSON**, ensuring consistency in parsing and visualization.

![pic7](https://github.com/KaranG03/eCom/blob/main/pic7.png?raw=true)  

---

## 💾 Data Persistence
![image alt](https://github.com/KaranG03/eCom/blob/main/db%20img.png?raw=true)

- MongoDB stores user data in a `users` collection.
- Each user document is linked by **Clerk ID**.
- Code reviews are stored as embedded objects in a `code` array:
  ```json
  {
    "userId": "clerk_123",
    "code": [
      {
        "filename": "Sample.java",
        "reviewSummary": "...",
        "correctedCode": "...",
        "feedback": "...",
        "complexity": {
          "time": "O(N^2)",
          "space": "O(N)"
        },
        "createdAt": "2025-10-11T18:00:00Z"
      }
    ]
  }
## 🖥️ Frontend Experience
Public Routes: Home, About, and Login pages.

Protected Routes: /dashboard, accessible only to authenticated users.

Beautiful Design: Gradient themes, modern typography, and professional spacing.

Dynamic Loader: Animated multi-step loader simulates the analysis process.

Graphical Analysis:

Interactive line graphs for complexity visualization.

Robust parsing for expressions like N*L, nlogn, or O(n^3).

## 🧩 Clerk Webhooks Integration
The system automatically syncs user data between Clerk and MongoDB.

When a user is deleted from Clerk:

A webhook triggers the /webhooks/clerk endpoint.

The corresponding MongoDB user document is removed.

This ensures perfect synchronization across services.

## 📊 Visualization Example

![seq dig](https://github.com/KaranG03/eCom/blob/main/seq%20dig.png?raw=true)
🧪 Future Enhancements
 🔍 Language Detection: Automatically identify the language of uploaded code.

 🧑‍💻 Collaborative Review: Allow sharing of code reviews with teammates.

 🧠  LLM Models: Gemini Flash 2.0.

 📈 Code Quality Metrics: Introduce maintainability and readability scoring.


## 🚀 Getting Started
**Prerequisites:**

- Node.js ≥ 18

- Java ≥ 17

- MongoDB

- Clerk API credentials

**Backend Setup:**

- cd code-review-backend
- ./mvnw spring-boot:run

**Frontend Setup:**

- cd code-review-frontend

- npm install

- npm run dev

## Environment Variables

**Backend (.env):**
- CLERK_PUBLISHABLE_KEY=${Key}

- CLERK_SECRET_KEY=${Key}

- MONGODB_URI=${Uri}

- GEMINI_API_KEY=${Key}

- FRONTEND_PORT(local)= localhost:5173

**Frontend (.env):**
- BACKEND_PORT(local)=localhost:8080

- VITE_CLERK_PUBLISHABLE_KEY=${Key}


---

