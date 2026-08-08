# Architectural & Engineering Decisions

This document summarizes the technical choices, prompt designs, and resolution of engineering challenges encountered while building **AI Interview Prep Coach**.

---

## 1. Why This Tech Stack?

- **Frontend: React (Vite) + Tailwind CSS**
  - **Speed & Developer Experience**: Vite offers lightning-fast Hot Module Replacement (HMR) and optimized build bundling compared to traditional create-react-app.
  - **Decoupled Architecture**: Building a React Single Page Application (SPA) cleanly separates the visual presentation layer from the Express REST API backend, making both independently deployable.
  - **Tailwind CSS**: Utility-first CSS allows creation of bespoke, high-performance visual themes (glassmorphism dark mode, custom gauges, badging) without heavy framework overrides.

- **Backend: Node.js + Express (REST API)**
  - **Asynchronous Non-blocking I/O**: Ideal for handling concurrent API requests to external services like the Anthropic Claude API and MongoDB database.
  - **Modular Controller Pattern**: Routes, controllers, database models, and AI services are segregated cleanly into separate modules for maintainability and automated testability.

- **Database: MongoDB (Mongoose) + MongoMemoryServer Fallback**
  - **Flexible Document Schema**: Interview questions, candidate text responses, and nested AI evaluation metrics (scores, STAR analysis, suggestions) map naturally to JSON document subdocuments.
  - **Instant Local Deployment**: Integrating `mongodb-memory-server` alongside Mongoose guarantees that the application runs seamlessly in any local development environment without requiring a manual MongoDB server setup.

- **AI Engine: Anthropic Claude 3.5 Sonnet (`@anthropic-ai/sdk`)**
  - High contextual reasoning capabilities for analyzing human candidate responses and evaluating them against structured rubrics (STAR framework).

---

## 2. Why JWT Authentication Over Server-Side Sessions?

- **Stateless REST Architecture**: JSON Web Tokens (JWT) store session data in a digitally signed payload on the client side. The Express server verifies the signature on incoming requests (`Authorization: Bearer <token>`) without needing to query a centralized server-side session store (like Redis or memory cookies) on every API hit.
- **Scalability**: Allows horizontal scaling of API servers behind a load balancer without sticky session synchronization.
- **Cross-Domain & Mobile Readiness**: JWT headers are easy to attach in client applications regardless of platform or domain boundaries.

---

## 3. How LLM Prompts Are Structured

### A. Question Generation Prompt
- **System Prompt**: Enforces that the model acts strictly as a structured JSON API engine.
- **Output Constraint**: Instructs Claude to output **ONLY** a valid JSON array of 5 question objects, avoiding conversational preamble or markdown text wrappers.
- **Fields Schema**:
  ```json
  [
    {
      "id": "q1",
      "questionText": "...",
      "category": "Behavioral",
      "difficulty": "Medium"
    }
  ]
  ```

### B. Answer Evaluation Prompt (STAR Method)
- **Objective**: Evaluates user answers objectively with low temperature (`0.3`).
- **STAR Rubric**: Enforces evaluation of Situation, Task, Action, and Result for behavioral questions.
- **Structured JSON Schema**:
  ```json
  {
    "score": 8,
    "strengths": ["...", "..."],
    "weaknesses": ["..."],
    "suggestion": "...",
    "starAnalysis": {
      "situation": "...",
      "task": "...",
      "action": "...",
      "result": "..."
    }
  }
  ```

---

## 4. Tricky Bugs Hit & How They Were Fixed

### Bug 1: LLM Returning Markdown Code Fences (````json ... ````)
- **Issue**: Even when instructed to return raw JSON, LLMs sometimes wrap responses in markdown formatting block quotes like ````json { ... } ````, causing `JSON.parse()` to throw a SyntaxError.
- **Fix**: Created a `parseJSONFromLLM` utility function in `claudeService.js` using regular expressions (`replace(/```json\n?/g, '').replace(/```\n?/g, '')`) to strip markdown fences before parsing.

### Bug 2: Database Connection Timeout on Systems Without Local MongoDB
- **Issue**: If local MongoDB service (`mongod`) is not running on `localhost:27017`, `mongoose.connect()` blocks or crashes the backend server.
- **Fix**: Configured `serverSelectionTimeoutMS: 2000` on Mongoose connection and wrapped it in a try/catch block that automatically starts an in-memory database instance (`MongoMemoryServer`) upon failure.

### Bug 3: Handling Claude API Rate Limits (429) & Key Absence Gracefully
- **Issue**: Unconfigured or invalid `ANTHROPIC_API_KEY` would throw unhandled promise rejections and break user practice sessions.
- **Fix**: Built an intelligent fallback generator engine inside `claudeService.js`. If the key is missing or an API error occurs, it seamlessly returns curated question sets and heuristic STAR evaluations, preventing application crashes.
