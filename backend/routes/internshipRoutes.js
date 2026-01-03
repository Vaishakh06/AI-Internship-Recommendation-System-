// backend/routes/internshipRoutes.js
import express from "express";
import {
  listInternships,
  getAllInternships,
  recommendedInternships,
  applyToInternship,
  getAppliedInternships,
  createInternship,
  updateInternshipStatus,
  deleteInternship,
} from "../controllers/internshipController.js";

// ✅ FIXED IMPORT: Using curly braces { } because your middleware uses named exports
import { authMiddleware as auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ======================================
   1. Public Routes
   ====================================== */
// Matches: /api/internships/list
router.get("/list", listInternships);


/* ======================================
   2. Student Routes (Login Required)
   ====================================== */
// Matches: /api/internships/recommendations
router.post("/recommendations", auth, recommendedInternships);

// Matches: /api/internships/applied
router.get("/applied", auth, getAppliedInternships);

// Matches: /api/internships/:id/apply
router.post("/:id/apply", auth, applyToInternship);


/* ======================================
   3. Admin Routes (Login Required)
   ====================================== */
// Matches: /api/internships/all
router.get("/all", auth, getAllInternships);

// Matches: /api/internships/create
router.post("/create", auth, createInternship);

// Matches: /api/internships/:id/status
router.put("/:id/status", auth, updateInternshipStatus);

// Matches: /api/internships/:id
router.delete("/:id", auth, deleteInternship);

export default router;