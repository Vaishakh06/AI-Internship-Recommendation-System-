// ✅ backend/server.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import ensureAdmin from "./utils/ensureAdmin.js";

// ✅ Import routes
import internshipRoutes from "./routes/internshipRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import geminiChatRoute from "./routes/geminiChat.js";

dotenv.config();
console.log("✅ Gemini API Key Loaded:", process.env.GEMINI_API_KEY ? "Yes" : "No");

// Connect to database
connectDB();
// Ensure a default admin exists
ensureAdmin();

const app = express();

// ======================================================
// 🚀 CORS CONFIGURATION (Deployment Ready)
// ======================================================
app.use(cors({
  origin: [
    "http://localhost:5173",                 // Trust Localhost (Local Testing)
    "https://ai-internship-recommendation-system.vercel.app"                 // Trust Vercel URL (Deployment)
  ],
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Backend server is running!");
});

// ✅ Register all routes
app.use("/api/auth", authRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", geminiChatRoute);

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});