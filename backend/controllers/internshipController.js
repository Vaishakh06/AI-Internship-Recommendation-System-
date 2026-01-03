// backend/controllers/internshipController.js
import Internship from '../models/Internship.js';
import User from '../models/User.js';
import AI_recommendation from "../utils/AI_recommendation.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- Lists all APPROVED internships for students ---
export const listInternships = async (req, res) => {
  try {
    const internships = await Internship.find({ status: 'approved' });
    res.json(internships);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// --- Creates a new internship (as pending) ---
export const createInternship = async (req, res) => {
  try {
    // 1. Get only the "lite" fields from the body
    const {
      program,
      organization,
      applyLink,
      skills,
      location,
      stipend,
    } = req.body;

    // 2. Create the new internship
    const newInternship = new Internship({
      program,
      organization,
      applyLink,
      skills,
      location,
      stipend,
      createdBy: req.user.id, // We know who created it from authMiddleware
      status: 'pending', // Default status
    });

    // 3. Save it
    const savedInternship = await newInternship.save();

    // 4. Send success response
    res.status(201).json(savedInternship);

  } catch (err) {
    console.error('Error creating internship:', err.message);
    // This will now send the validation error (e.g. "Program is required")
    // back to the frontend toast message.
    res.status(500).json({ message: err.message });
  }
};

// --- Updates an internship's status (approve/reject) ---
export const updateInternshipStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const internshipId = req.params.id;

    const updatedInternship = await Internship.findByIdAndUpdate(
      internshipId,
      { status: status },
      { new: true } // This option returns the updated document
    );

    if (!updatedInternship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    // Send a success response
    res.json(updatedInternship);
  } catch (err) {
    console.error('Error updating status:', err.message);
    res.status(500).json({ message: 'Failed to update status' });
  }
};

// --- Deletes an internship ---
export const deleteInternship = async (req, res) => {
  try {
    const internshipId = req.params.id;
    const deletedInternship = await Internship.findByIdAndDelete(internshipId);

    if (!deletedInternship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    // Send a success response
    res.json({ message: 'Internship deleted successfully' });
  } catch (err) {
    console.error('Error deleting internship:', err.message);
    res.status(500).json({ message: 'Failed to delete internship' });
  }
};

// --- Generates recommendations for a student ---
function computeSkillScore(userSkills, internshipSkills = []) {
  const userSet = new Set(userSkills.map((s) => s.toLowerCase()));
  const inter = internshipSkills.map((s) => s.toLowerCase());
  const overlap = inter.filter((s) => userSet.has(s)).length;
  return inter.length ? Math.round((overlap / inter.length) * 100) : 0;
}

// backend/controllers/internshipController.js

// ... keep computeSkillScore function as is ...

export const recommendedInternships = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Get ALL internships
    const allInternships = await Internship.find({});

    const userSkills = user.skills || [];

    const recommendations = allInternships
      .map((internship) => {
        const skillScore = computeSkillScore(userSkills, internship.skills);
        const baseScore = Math.round(skillScore);

        return {
          _id: internship._id,
          title: internship.program,
          company: internship.organization,
          location: internship.location,

          // ✅ FIX: Add these lines so the Frontend gets the data
          stipend: internship.stipend,
          applyLink: internship.applyLink,

          skillsMatched: internship.skills.filter((s) =>
            userSkills.includes(s)
          ),
          matchScore: Math.min(baseScore, 100),
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);

    console.log(`✅ Sending ${recommendations.length} recommendations`);
    return res.status(200).json({ recommendations });
  } catch (err) {
    console.error("❌ Error generating recommendations:", err);
    return res.status(500).json({
      message: "Error generating recommendations",
      details: err.message,
    });
  }
};


// --- ADD THIS NEW ADMIN-ONLY FUNCTION ---
export const getAllInternships = async (req, res) => {
  try {

    const internships = await Internship.find({})
      .populate({
        path: 'appliedBy', // Populate the appliedBy field
        select: 'email fullName skills education experience portfolioLink resumeLink' // Select these fields
      });

    res.json(internships);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const applyToInternship = async (req, res) => {
  try {
    const internshipId = req.params.id;
    const userId = req.user.id; // From authMiddleware

    const internship = await Internship.findById(internshipId);

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    // Check if user has already applied
    if (internship.appliedBy.includes(userId)) {
      return res.status(400).json({ message: 'You have already applied' });
    }

    // Add user to the appliedBy array
    internship.appliedBy.push(userId);
    await internship.save();

    res.json({ message: 'Application successful' });
  } catch (err) {
    console.error('Error applying to internship:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- ADD THIS SECOND NEW FUNCTION ---
export const getAppliedInternships = async (req, res) => {
  try {
    const userId = req.user.id; // From authMiddleware

    // Find all internships where the 'appliedBy' array contains this user's ID
    const internships = await Internship.find({ appliedBy: userId });

    res.json(internships);
  } catch (err) {
    console.error('Error fetching applied internships:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};