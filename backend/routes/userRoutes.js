// backend/routes/userRoutes.js
import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user's profile
router.get(
  '/profile',
  authMiddleware, // Protect this route
  getUserProfile
);

// @route   POST /api/users/profile
// @desc    Update current user's profile
router.post(
  '/profile',
  authMiddleware, // Protect this route
  updateUserProfile
);

export default router;