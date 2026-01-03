// backend/controllers/userController.js
import User from '../models/User.js';

// --- Get a user's profile ---
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            // User not found is a 404 error
            return res.status(404).json({ message: 'User not found' });
        }
        
        // --- THIS IS THE CORRECT WAY ---
        // Send status 200 OK and the user data as JSON
        res.status(200).json(user);
        // -----------------------------

    } catch (err) {
        console.error("Error fetching profile:", err.message);
        // Any other error is a 500 server error
        res.status(500).send('Server Error');
    }
};

// --- Update a user's profile ---
export const updateUserProfile = async (req, res) => {
    // Destructure ALL the fields (including removed bio for safety)
    const {
        fullName,
        skills,
        education,
        experience,
        portfolioLink,
        resumeLink
    } = req.body;

    // Build the profileFields object
    const profileFields = {};
    if (fullName !== undefined) profileFields.fullName = fullName; // Allow empty string
    if (portfolioLink !== undefined) profileFields.portfolioLink = portfolioLink;
    if (resumeLink !== undefined) profileFields.resumeLink = resumeLink;

    if (typeof skills === 'string') {
        profileFields.skills = skills.split(',').map(skill => skill.trim()).filter(skill => skill); // Filter out empty strings
    } else if (Array.isArray(skills)) {
        profileFields.skills = skills.filter(skill => skill); // Filter out empty strings
    }

    // Handle nested objects
    if (education) {
        profileFields.education = {};
        if (education.university !== undefined) profileFields.education.university = education.university;
        if (education.degree !== undefined) profileFields.education.degree = education.degree;
        if (education.graduationYear !== undefined) profileFields.education.graduationYear = education.graduationYear;
    }

    // Handle array of objects
    if (experience && Array.isArray(experience)) {
        profileFields.experience = experience;
    }

    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user in the database
        user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: profileFields },
            { new: true, runValidators: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        console.error("Error updating profile:", err.message);
        res.status(500).send('Server Error');
    }
};