# AI Internship Recommendation Portal 🚀

An intelligent internship discovery platform built with the **MERN Stack** and **Google Gemini**. This system uses Generative AI to perform semantic matching between student profiles and internship opportunities, going beyond simple keyword matching to understand context and intent.

## 🏗️ Tech Stack

- **Frontend:** React.js (Vite), Tailwind CSS, Axios
- **Backend:** Node.js, Express.js
- **AI Engine:** Google Gemini Pro Model (for semantic analysis & matching)
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens) + Bcrypt
- **Email Service:** Nodemailer (Gmail SMTP)
- **Deployment:** Vercel (Frontend) & Render (Backend)

## 🚀 Key Features

- **🧠 Semantic Matching:** Uses Google Gemini to analyze resumes/skills and match them with internship descriptions based on meaning.
- **🔐 Secure Authentication:** Role-based login (Student/Admin) with hashed passwords.
- **📧 Email Verification:** Account activation system using unique token links.
- **⚡ Admin Dashboard:** Interface for recruiters/admins to post internships.
- **📱 Responsive UI:** Dark-themed, mobile-friendly interface.

## 📂 Project Structure

The repository is organized into a monorepo structure separating the client and server logic:

```text
/InternDesk-Project-Root/
│
├── backend/                # Server-side logic (Node.js/Express)
│   ├── config/             # DB connections & App config
│   ├── controllers/        # Request logic (Auth, Internship, AI)
│   ├── models/             # Mongoose Schemas (User, Internship)
│   ├── routes/             # API Endpoints
│   ├── utils/              # Helper functions & Middleware
│   ├── server.js           # Entry point
│   └── .env                # Secrets (GitIgnored)
│
├── frontend/               # Client-side logic (React + Vite)
│   ├── src/
│   │   ├── api/            # Axios setup & API calls
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Global State (Auth Context)
│   │   ├── pages/          # Full page views
│   │   └── App.jsx         # Main Component
│   └── vite.config.js      # Vite Configuration
│
└── README.md               # Project Documentation


## ⚙️ Environment Setup

Create a `.env` file in your **backend** folder with the following keys:

```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_key
email=your_email@gmail.com
password=your_email_app_password
GEMINI_API_KEY=your_google_gemini_key

# 1. For Local Development:
BACKEND_URL=http://localhost:8080
FRONTEND_URL=http://localhost:5173

# 2. For Cloud Deployment (Render/Vercel):
# BACKEND_URL=[https://your-api.onrender.com](https://your-api.onrender.com)
# FRONTEND_URL=[https://your-project.vercel.app](https://your-project.vercel.app)