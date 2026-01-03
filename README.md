# PM Internship AI Recommendation Engine | pm-internship-ai

This project is an **AI-powered Internship Recommendation Portal** built for the PM Internship Scheme. It matches students to the most suitable government-backed internships based on their skills, interests, and backgrounds, providing a personalized, transparent, and scalable experience.

## 🏗️ Tech Stack

- **Frontend:** React (Next.js), Tailwind CSS, Axios
- **Backend:** Node.js, Express, Gemini API (for skill extraction and recommendations), JWT Auth
- **Database:** MongoDB Atlas (Free Tier for demo)
- **Deployment:** Vercel (frontend), Render/Heroku (backend)

## 🚀 Features

- **🤖 AI Chatbot** - Gemini-powered chatbot for instant internship help and career advice
- Secure login & registration for students and admins
- Resume upload (PDF/DOCX) or manual skill/interest entry
- AI-based skills & interest extraction using Gemini API
- Personalized internship recommendations with skill match score
- Filters on domain, location, stipend, duration, skill match %
- Admin panel to add/edit/manage internships
- Edge case handling (missing skills, no matches, resume issues)
- Analytics dashboard (optional)
- Clean, intuitive interface for both students and admins

## 📊 Workflow

1. **Student Side**
   - Register/Login
   - Upload resume or enter skills manually
   - Receive AI-analyzed skills/interests and get ranked internship matches
   - Dashboard displays matches with filters, match score, and "why matched" info

2. **Admin Side**
   - Register/Login as admin
   - Post and manage internships with required skills, duration, stipend, etc.
   - Optional: view analytics on popular listings, trends

3. **Backend & AI**
   - Handles auth, stores student & internship data in MongoDB
   - Integrates with Gemini API for resume parsing and semantic matching
   - Returns top-fit internships based on student profile

## 🤝 Team & Collaboration

- **Frontend:** [Team member name(s)] — Student/admin dashboard, UI/UX, API integration
- **Backend:** [Team member name(s)] — APIs, DB, Gemini integration, match logic
- **Data Preparation & Testing:** [Names] — Mock data prep, edge case testing, demo support
- **Presentation:** [Name] — Slides, live demo, documentation, project explanation

Workflow uses GitHub issues/branches/pull requests for collaborative, transparent code development. Each team member commits to their respective module and collaborates on integration/testing.

## 🧑‍💻 Getting Started

👉 **For detailed setup instructions with the new AI Chatbot, see [RUN_INSTRUCTIONS.md](RUN_INSTRUCTIONS.md)**

Quick Start:
1. **Clone the repository**
2. **Create `.env` file in `backend/` with:**
   - `MONGO_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Any random secret string
   - `GEMINI_API_KEY` - Your Gemini API key
3. **Install dependencies:**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
4. **Start the servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm start
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```
5. **Open http://localhost:5173** and click the chatbot icon! 🤖

## 📁 Directory Structure
```
pm-internship-ai-engine/
│
├── frontend/
│ └── ... (React app, component folders)
├── backend/
│ └── ... (Express app, routes, controllers)
└── README.md
```

## 🌟 Contribution Guidelines

- Feature branches for major changes
- Descriptive commit messages
- Pull requests with code reviews before merge
- Open issues for bugs/feature requests

---

**Let’s empower students with transparent, AI-driven government internship opportunities!**
