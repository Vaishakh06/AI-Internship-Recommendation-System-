import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// TEST LOG (must appear in Render logs)
console.log("✅ userRoutes loaded");

// GET profile
router.get("/profile", authMiddleware, getUserProfile);

// UPDATE profile
router.put("/profile", authMiddleware, updateUserProfile);

export default router;
