import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

/* ======================================================
   1️⃣ REGISTER (DIRECT DB SAVE)
====================================================== */
router.post("/register", async (req, res) => {
    console.log("🔥 NEW REGISTER ROUTE HIT");
    try {
        const { fullName, email, password, role } = req.body;

        // Check if user already exists
        const existing = await User.findOne({ email });
        if (existing) {
            return res
                .status(400)
                .json({ message: "User already exists. Please login." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user directly
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            role,
        });

        await newUser.save();

        return res.status(201).json({
            message: "Registration successful. You can now login.",
        });
    } catch (err) {
        console.error("❌ Registration error:", err);
        return res.status(500).json({
            message: "Server error during registration",
        });
    }
});

/* ======================================================
   2️⃣ LOGIN
====================================================== */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("❌ Login error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});

export default router;
