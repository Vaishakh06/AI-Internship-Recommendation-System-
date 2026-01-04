// backend/routes/authRoutes.js

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendVerificationEmail } from "../utils/emailService.js";

const router = express.Router();

// ✅ Deployment-Ready URLs
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

/* ======================================================
   1️⃣ REGISTER (NO DB SAVE YET)
   Generates a token containing the user data and sends email.
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

        // 3. Create activation token (temporary storage)
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

        // 4. ✅ Send email using Resend
        try {
            await sendVerificationEmail(email, verifyUrl);
        } catch (err) {
            console.error("❌ Email sending failed:", err);
            return res.status(500).json({ message: "Email sending failed" });
        }

        // 5. Response (no DB save yet)
        return res.status(200).json({
            message:
                "Verification link sent! Check your email to complete registration.",
        });
    } catch (err) {
        console.error("❌ Registration error:", err);
        res.status(500).json({ message: "Server error during registration" });
    }
});

/* ======================================================
   2️⃣ VERIFY & CREATE USER (DB SAVE HAPPENS HERE)
====================================================== */
router.get("/verify/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const loginLink = `${FRONTEND_URL}/login`;

        // 1. Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            return res
                .status(400)
                .send("<h1>⚠️ Invalid or Expired Link. Please register again.</h1>");
        }

        const { fullName, email, password, role } = decoded;

        // 2. Prevent double creation
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(200).send(`
        <h1>✅ Account Already Active</h1>
        <p>You can already log in.</p>
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
        console.log(`✅ New User Created: ${email}`);

        // 4. Success page
        return res.status(200).send(`
      <html>
        <body style="background:#1a1a1a; color:white; font-family:sans-serif; display:flex; justify-content:center; align-items:center; height:100vh;">
          <div style="text-align:center; padding:40px; border-radius:10px; background:#222;">
            <div style="font-size:50px;">🎉</div>
            <h1 style="color:#4CAF50;">Account Created!</h1>
            <p>Your registration is complete.</p>
            <a href="${loginLink}" style="background:#E9CD5F; color:black; padding:12px 25px; text-decoration:none; font-weight:bold; border-radius:5px;">
              Go to Login
            </a>
          </div>
        </body>
      </html>
    `);
    } catch (err) {
        console.error("Verification error:", err);
        res.status(500).send("Server Error");
    }
});

router.get("/resend-test", async (req, res) => {
    try {
        console.log("🔑 Key exists:", !!process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: "InternDesk <onboarding@resend.dev>",
            to: "YOUR_PERSONAL_EMAIL@gmail.com",
            subject: "Resend Test",
            html: "<h1>Resend is working</h1>",
        });

        res.send("Email sent");
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});


/* ======================================================
   3️⃣ LOGIN (Standard)
====================================================== */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.isVerified) {
            return res.status(403).json({ message: "Account not verified." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});



export default router;
