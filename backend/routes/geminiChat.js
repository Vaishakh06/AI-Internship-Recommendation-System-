// ✅ geminiChat.js
import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Internship from "../models/Internship.js";

dotenv.config();
const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Optional auth middleware - doesn't block if no token
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user;
    } catch (err) {
      // Token invalid, continue without user
      req.user = null;
    }
  }
  next();
};

// ✅ Route: POST /api/chat
router.post("/", optionalAuth, async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;
    
    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Get user profile from request (if authenticated)
    const userProfile = req.user || {};
    
    // Build context from user profile
    const profileContext = userProfile.fullName || userProfile.email
      ? `You are helping ${userProfile.fullName || userProfile.email}, ` +
        `a ${userProfile.education?.degree || "student"} at ${userProfile.education?.university || "university"}. ` +
        (userProfile.skills?.length > 0 ? `Their skills include: ${userProfile.skills.join(", ")}. ` : "") +
        (userProfile.experience?.length > 0 ? `They have experience as: ${userProfile.experience.map(e => `${e.title} at ${e.company}`).join(", ")}. ` : "")
      : "You are an AI Internship Recommendation Assistant helping a student.";

    // Build conversation history if provided
    let historyString = "";
    if (conversationHistory && Array.isArray(conversationHistory)) {
      historyString = conversationHistory
        .slice(-5) // Keep last 5 messages for context
        .map(msg => `${msg.role === 'user' ? 'Student' : 'Assistant'}: ${msg.content}`)
        .join('\n');
    }

    // --- Simple intent routing for website-integrated answers ---
    const lowerMsg = message.toLowerCase();
    const wantsOpen = /\b(open|available|list|show)\b.*\b(internship|internships)\b/.test(lowerMsg);
    const wantsApplied = /(applied|applications|i applied|my applications)/.test(lowerMsg);

    if (wantsOpen) {
      const internships = await Internship.find({ status: 'approved' }).limit(10);
      if (!internships.length) {
        return res.json({ reply: "There are no open internships right now. Please check back later." });
      }
      const lines = internships.map((i, idx) => `${idx + 1}. ${i.program} — ${i.organization} ${i.location ? `(${i.location})` : ''} ${i.applyLink ? `\n   Apply: ${i.applyLink}` : ''}`);
      return res.json({ reply: `Here are some open internships:\n\n${lines.join('\n')}` });
    }

    if (wantsApplied) {
      if (!req.user) {
        return res.json({ reply: "Please log in to view your applied internships." });
      }
      const internships = await Internship.find({ appliedBy: req.user.id });
      if (!internships.length) {
        return res.json({ reply: "You haven't applied to any internships yet." });
      }
      const lines = internships.map((i, idx) => `${idx + 1}. ${i.program} — ${i.organization} ${i.location ? `(${i.location})` : ''}`);
      return res.json({ reply: `You have applied to:\n\n${lines.join('\n')}` });
    }

    const prompt = `
      ${profileContext}
      
      You are a helpful and friendly AI assistant for an internship platform. Your role is to help students find internships, provide career advice, and answer questions about the platform.
      
      ${historyString ? `Previous conversation:\n${historyString}\n` : ""}
      
      Please respond to this question in a helpful, encouraging, and concise manner: ${message}
      
      Keep your response under 300 words and be conversational and friendly.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);

    // ✅ Safely handle Gemini response
    const reply = result?.response?.text() || "I apologize, but I couldn't generate a response. Please try again.";

    return res.json({ reply });
  } catch (error) {
    console.error("❌ Error in chat:", error);
    return res.status(500).json({ 
      error: error.message.includes("API_KEY") 
        ? "AI service configuration error" 
        : "AI service temporarily unavailable. Please try again later."
    });
  }
});

export default router;
