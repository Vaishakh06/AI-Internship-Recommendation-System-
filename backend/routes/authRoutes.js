// backend/routes/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/User.js";

const router = express.Router();

// ✅ Deployment-Ready URLs
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// 📧 Email Transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',     // Explicitly set host
    port: 587,                  // Use Port 587 (Best for cloud servers)
    secure: false,              // False for port 587 (it uses STARTTLS)
    requireTLS: true,           // Enforce security
    auth: {
        user: process.env.email,
        pass: process.env.password
    },
    // Fix for some certificate issues in cloud environments
    tls: {
        rejectUnauthorized: false
    }
});

/* ======================================================
   1️⃣ REGISTER (NO DB SAVE YET)
   Generates a token containing the user data and sends email.
====================================================== */
router.post("/register", async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        // 1. Check if a VERIFIED user already exists
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "User already exists. Please login." });
        }

        // 2. Hash the password immediately
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create a temporary token containing ALL user data
        // This acts as a "temporary storage" inside the link itself.
        const tokenPayload = {
            fullName,
            email,
            password: hashedPassword, // Store the HASH, not plain text
            role
        };

        // Token expires in 1 hour
        const activationToken = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const verifyUrl = `${BACKEND_URL}/api/auth/verify/${activationToken}`;

        // 4. Send Email
        await transporter.sendMail({
            from: `"AI Internship System" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Activate Your Account",
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h2 style="color: #333;">Welcome, ${fullName}!</h2>
            <p>You are one step away. Click below to create your account:</p>
            <a href="${verifyUrl}" target="_blank" 
               style="display:inline-block;padding:12px 20px;
               background:#E9CD5F;color:black;font-weight:bold;
               text-decoration:none;border-radius:6px;margin-top:10px;">
               Create Account Now
            </a>
            <p style="font-size:12px; color:#666; margin-top:20px;">Link expires in 1 hour.</p>
          </div>
        </div>
      `,
        });

        // 5. Success response (Note: We haven't touched MongoDB yet!)
        return res.status(200).json({
            message: "Verification link sent! Check your email to complete registration.",
        });

    } catch (err) {
        console.error("❌ Registration error:", err);
        res.status(500).json({ message: "Server error during registration" });
    }
});

/* ======================================================
   2️⃣ VERIFY & CREATE USER (DB SAVE HAPPENS HERE)
   Decodes the token and finally saves the user to MongoDB.
====================================================== */
router.get("/verify/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const loginLink = `${FRONTEND_URL}/login`;

        // 1. Verify and Decode the token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            return res.status(400).send("<h1>⚠️ Invalid or Expired Link. Please register again.</h1>");
        }

        const { fullName, email, password, role } = decoded;

        // 2. Final Check: Does user exist? (Prevent double clicking)
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(200).send(`
                <h1>✅ Account Already Active</h1>
                <p>You can already log in.</p>
                <a href="${loginLink}">Go to Login</a>
            `);
        }

        // 3. 🔥 CREATE USER IN MONGODB NOW 🔥
        const newUser = new User({
            fullName,
            email,
            password, // This is already hashed from step 1
            role,
            isVerified: true, // Auto-verified since they clicked the email
        });

        await newUser.save();
        console.log(`✅ New User Created: ${email}`);

        // 4. Show Success Page
        return res.status(200).send(`
            <html>
              <body style="background:#1a1a1a; color:white; font-family:sans-serif; display:flex; justify-content:center; align-items:center; height:100vh; margin:0;">
                <div style="text-align:center; padding:40px; border:1px solid #333; border-radius:10px; background:#222; max-width:400px;">
                    <div style="font-size:50px; margin-bottom:20px;">🎉</div>
                    <h1 style="color:#4CAF50; margin-bottom:10px;">Account Created!</h1>
                    <p style="color:#ccc; margin-bottom:30px;">Your registration is complete. You can now log in.</p>
                    <a href="${loginLink}" style="background:#E9CD5F; color:black; padding:12px 25px; text-decoration:none; font-weight:bold; border-radius:5px;">Go to Login</a>
                </div>
              </body>
            </html>
        `);

    } catch (err) {
        console.error("Verification error:", err);
        res.status(500).send("Server Error");
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

        // Extra safety check (though verify logic handles this)
        if (!user.isVerified) {
            return res.status(403).json({ message: "Account not verified." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

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