import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendVerificationEmail } from "../utils/emailService.js";

const router = express.Router();

// ✅ Deployment-ready URLs
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

/* ======================================================
   1️⃣ REGISTER (NO DB SAVE YET)
====================================================== */
router.post("/register", async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        // 1. Check if user already exists
        const existing = await User.findOne({ email });
        if (existing) {
            return res
                .status(400)
                .json({ message: "User already exists. Please login." });
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create activation token (temporary data)
        const tokenPayload = {
            fullName,
            email,
            password: hashedPassword,
            role,
        };

        const activationToken = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const verifyUrl = `${BACKEND_URL}/api/auth/verify/${activationToken}`;

        // 4. Send verification email (IMPORTANT FIX)
        const emailSent = await sendVerificationEmail(email, verifyUrl);

        if (!emailSent) {
            return res.status(500).json({
                message: "Failed to send verification email. Please try again.",
            });
        }

        // 5. Success response (NO DB SAVE YET)
        return res.status(200).json({
            message:
                "Verification link sent! Please check your email to complete registration.",
        });
    } catch (err) {
        console.error("❌ Registration error:", err);
        return res.status(500).json({
            message: "Server error during registration",
        });
    }
});

/* ======================================================
   2️⃣ VERIFY EMAIL & CREATE USER
====================================================== */
router.get("/verify/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const loginLink = `${FRONTEND_URL}/login`;

        // 1. Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res
                .status(400)
                .send("<h1>⚠️ Invalid or expired verification link.</h1>");
        }

        const { fullName, email, password, role } = decoded;

        // 2. Prevent duplicate creation
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(200).send(`
        <h1>✅ Account Already Verified</h1>
        <p>You can log in directly.</p>
        <a href="${loginLink}">Go to Login</a>
      `);
        }

        // 3. Create user in DB
        const newUser = new User({
            fullName,
            email,
            password,
            role,
            isVerified: true,
        });

        await newUser.save();
        console.log(`✅ User verified & created: ${email}`);

        // 4. Success page
        return res.status(200).send(`
      <html>
        <body style="background:#1a1a1a;color:white;font-family:sans-serif;
                     display:flex;justify-content:center;align-items:center;height:100vh;">
          <div style="text-align:center;padding:40px;border-radius:10px;background:#222;">
            <div style="font-size:48px;">🎉</div>
            <h1 style="color:#4CAF50;">Account Verified!</h1>
            <p>Your registration is complete.</p>
            <a href="${loginLink}"
               style="background:#E9CD5F;color:black;padding:12px 24px;
                      text-decoration:none;font-weight:bold;border-radius:5px;">
              Go to Login
            </a>
          </div>
        </body>
      </html>
    `);
    } catch (err) {
        console.error("❌ Verification error:", err);
        return res.status(500).send("Server error");
    }
});

/* ======================================================
   3️⃣ LOGIN
====================================================== */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });

        if (!user.isVerified) {
            return res
                .status(403)
                .json({ message: "Please verify your email first." });
        }

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
