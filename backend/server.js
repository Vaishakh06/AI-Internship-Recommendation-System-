console.log("🔥 SERVER FILE FROM BACKEND FOLDER LOADED");

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import ensureAdmin from "./utils/ensureAdmin.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import internshipRoutes from "./routes/internshipRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import geminiChatRoute from "./routes/geminiChat.js";

dotenv.config();

const app = express();

// ===============================
// DATABASE
// ===============================
connectDB();
ensureAdmin();

// ===============================
// CORS — PRODUCTION ONLY
// ===============================
app.use(
  cors({
    origin: "https://ai-internship-recommendation-system.vercel.app",
    credentials: true,
  })
);

app.use(express.json());

// ===============================
// ROUTES
// ===============================
app.get("/", (req, res) => {
  res.send("Backend running successfully");
});

app.use("/api/auth", authRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", geminiChatRoute);

// ===============================
// SERVER
// ===============================
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
