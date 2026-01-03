// ✅ backend/server.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import ensureAdmin from "./utils/ensureAdmin.js";

dotenv.config();
console.log("✅ Gemini API Key Loaded:", process.env.GEMINI_API_KEY ? "Yes" : "No");

// ✅ Import routes
import internshipRoutes from "./routes/internshipRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import geminiChatRoute from "./routes/geminiChat.js"; // ✅ Correct

// Connect to database (optional for chatbot to work)
connectDB();
// Ensure a default admin exists (runs only when DB connected)
ensureAdmin();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Backend server is running!");
});

// ✅ Register all routes
app.use("/api/auth", authRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", geminiChatRoute); // ✅ Important



const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});
