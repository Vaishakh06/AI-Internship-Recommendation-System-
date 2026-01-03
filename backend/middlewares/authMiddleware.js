// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js"; 

export function authMiddleware(req, res, next) {
  // 1. Check for the header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // 2. Verify the token
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔍 DEBUG LOG: See what is inside the token
    console.log("🔑 Decoded Token Payload:", decoded);

    // 3. Attach user to request
    // FIX: Try 'decoded.user' first. If that doesn't exist, use 'decoded' directly.
    req.user = decoded.user || decoded; 

    // 4. Double check we actually have an ID
    if (!req.user || !req.user.id) {
         console.error("❌ Token decoded, but no User ID found:", req.user);
         return res.status(401).json({ message: "Token valid but structure invalid" });
    }

    next();
  } catch (err) {
    console.error("❌ Middleware Error:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
}