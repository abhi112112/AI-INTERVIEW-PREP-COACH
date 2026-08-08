# AI Interview Prep Coach

A full-stack web application built with **React (Vite)**, **Express REST API**, **MongoDB**, **JWT Authentication**, and **Anthropic Claude 3.5 Sonnet API**. 

The app generates realistic behavioral and technical interview questions, evaluates candidate answers using the **STAR Method** (Situation, Task, Action, Result), and tracks performance analytics over time.

---

## ✨ Features

- **Tailored Question Generator**: Generate 5 role-specific interview questions based on category (*Behavioral*, *Technical/DSA*, *Project Walkthrough*) or by pasting a target **Job Description (JD)**.
-  **STAR Method AI Evaluation**: Receives instant structured AI feedback scoring responses from 1 to 10 with strengths, weaknesses, key suggestions, and a breakdown of Situation, Task, Action, and Result.
-  **History & Score Progression**: View past practice sessions, filter by interview category, and track average score growth over time with interactive **Recharts** line graphs.
-  **JWT Authentication**: Secure user registration and login with `bcryptjs` password hashing and stateless token protection on API endpoints.
-  **Resilient Offline Fallback**: Features an in-memory database (`MongoMemoryServer`) and intelligent fallback question/evaluation generator when MongoDB or Claude API keys are unconfigured.

---

##  Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React Icons, Recharts, React Router DOM, Axios |
| **Backend** | Node.js, Express.js (REST API), Express Validator |
| **Database** | MongoDB (Mongoose ORM) + MongoMemoryServer |
| **Authentication** | JWT (JSON Web Tokens) + Bcrypt.js |
| **AI Integration** | Anthropic Claude API (`@anthropic-ai/sdk`) |

---

##  Project Structure

```
AI-INTERVIEW-PREP-COACH/
├── backend/
│   ├── config/
│   │   └── db.js                 # Resilient MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.js     # User registration, login & profile
│   │   └── interviewController.js# Question generation, evaluation & analytics
│   ├── middleware/
│   │   ├── auth.js               # JWT verification middleware
│   │   └── validate.js           # Request payload validation middleware
│   ├── models/
│   │   ├── User.js               # Mongoose User Schema
│   │   └── Session.js            # Mongoose Session & Answer Schema
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth endpoints
│   │   └── interviewRoutes.js    # /api/interview endpoints
│   ├── services/
│   │   └── claudeService.js      # Anthropic SDK integration & JSON prompt engineering
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express API server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, ProtectedRoute, UI cards
│   │   ├── context/              # AuthContext provider
│   │   ├── pages/                # Landing, Login, Register, Dashboard, Setup, Room, History
│   │   ├── services/             # Axios API client instance
│   │   ├── App.jsx               # Main React router & layout setup
│   │   ├── main.jsx              # React DOM entry point
│   │   └── index.css             # Tailwind CSS & glassmorphism styles
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── DECISIONS.md                  # Comprehensive architectural decision log
└── README.md
```

---

##  Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/abhi112112/AI-INTERVIEW-PREP-COACH.git
cd AI-INTERVIEW-PREP-COACH
```

### 2. Configure Backend & Environment Variables
Navigate to the `backend` directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai-interview-prep
JWT_SECRET=super_secret_jwt_key_interview_prep_2026
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```
> **Note**: If `ANTHROPIC_API_KEY` is not provided or local MongoDB is offline, the backend automatically uses `MongoMemoryServer` and intelligent fallback AI responses.

Start the backend server:
```bash
npm run dev
```
*(Backend API will run on `http://localhost:5000`)*

---

### 3. Configure & Start Frontend
In a **new terminal window**, navigate to `frontend/`:
```bash
cd frontend
npm install
npm run dev
```
*(Frontend app will run on `http://localhost:3000`)*

---

##  API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create a new user account (`name`, `email`, `password`)
- `POST /api/auth/login` - Authenticate user & receive JWT token (`email`, `password`)
- `GET /api/auth/me` - Fetch logged-in user profile *(Protected)*

### Interview Practice (`/api/interview`) *(All Protected)*
- `POST /api/interview/generate-questions` - Generate 5 interview questions (`category`, `jobDescription`)
- `POST /api/interview/evaluate-answer` - Submit answer for STAR AI feedback (`sessionId`, `questionId`, `userAnswer`)
- `GET /api/interview/history` - Retrieve practice sessions with optional category query (`?category=Behavioral`)
- `GET /api/interview/analytics` - Fetch overall score statistics & timeline progression dataset

---

##  Architectural Decisions

For a full deep dive into technical decisions (JWT vs session auth, LLM JSON prompt engineering, and bug resolutions), read [DECISIONS.md](DECISIONS.md).

---

##  License

This project is open source and available under the [ISC License](LICENSE).
