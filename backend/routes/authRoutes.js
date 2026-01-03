// backend/routes/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/User.js";

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

/* ================================
   📧 EMAIL TRANSPORTER SETUP
================================== */
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/* ================================
   🧍 REGISTER USER + SEND EMAIL
================================== */
router.post("/register", async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString("hex");

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            role,
            verificationToken,
            isVerified: false,
        });

        await newUser.save();

        // ✅ FIX 1: Removed the accidental space before 'https'
        // ✅ FIX 2: Used the variable BACKEND_URL for cleaner code
        const verifyUrl = `${BACKEND_URL}/api/auth/verify/${verificationToken}`;

        await transporter.sendMail({
            from: `"AI Internship System" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify Your Email",
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h2 style="color: #333;">Welcome, ${fullName}!</h2>
            <p>Click below to activate your account:</p>
            <a href="${verifyUrl}" target="_blank" 
               style="display:inline-block;padding:12px 20px;
               background:#E9CD5F;color:black;font-weight:bold;
               text-decoration:none;border-radius:6px;margin-top:10px;">
               Verify Email Now
            </a>
          </div>
        </div>
      `,
        });

        return res.status(201).json({
            message: "User registered successfully. Check your email to verify.",
        });
    } catch (err) {
        console.error("❌ Registration error:", err);
        res.status(500).json({ message: "Server error during registration" });
    }
});

/* ================================
   ✅ VERIFY EMAIL (SHOW SUCCESS PAGE)
================================== */
router.get("/verify/:token", async (req, res) => {
    try {
        const token = req.params.token;
        const user = await User.findOne({ verificationToken: token });

        // ✅ FIX 3: Use FRONTEND_URL variable.
        // If FRONTEND_URL is localhost, remote users can't open it.
        // You need to tunnel the frontend too if you want this to work fully remotely.
        const loginLink = `${FRONTEND_URL}/login`;

        if (!user) {
            return res.status(400).send(`
                <html>
                  <body style="background:#1a1a1a; color:white; font-family:sans-serif; display:flex; justify-content:center; align-items:center; height:100vh; margin:0;">
                    <div style="text-align:center; padding:40px; border:1px solid #333; border-radius:10px; background:#222;">
                        <h1 style="color:#ff4444;">⚠️ Link Invalid</h1>
                        <p style="color:#aaa;">We could not find this verification token.</p>
                    </div>
                  </body>
                </html>
             `);
        }

        if (user.isVerified) {
            return res.status(200).send(`
                <html>
                  <body style="background:#1a1a1a; color:white; font-family:sans-serif; display:flex; justify-content:center; align-items:center; height:100vh; margin:0;">
                    <div style="text-align:center; padding:40px; border:1px solid #333; border-radius:10px; background:#222; max-width:400px;">
                        <h1 style="color:#E9CD5F;">Already Verified!</h1>
                        <p style="color:#ccc; margin-bottom:30px;">Your email was already verified successfully.</p>
                        <a href="${loginLink}" style="background:#E9CD5F; color:black; padding:12px 25px; text-decoration:none; font-weight:bold; border-radius:5px;">Go to Login</a>
                    </div>
                  </body>
                </html>
            `);
        }

        user.isVerified = true;
        await user.save();

        console.log(`✅ User ${user.email} verified! Showing success page.`);

        return res.status(200).send(`
            <html>
              <body style="background:#1a1a1a; color:white; font-family:sans-serif; display:flex; justify-content:center; align-items:center; height:100vh; margin:0;">
                <div style="text-align:center; padding:40px; border:1px solid #333; border-radius:10px; background:#222; max-width:400px;">
                    <div style="font-size:50px; margin-bottom:20px;">🎉</div>
                    <h1 style="color:#4CAF50; margin-bottom:10px;">Verification Successful!</h1>
                    <p style="color:#ccc; margin-bottom:30px;">Your account has been activated. You can now log in.</p>
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

/* ================================
   🔐 LOGIN USER
================================== */
router.post("/login", async (req, res) => {
    // ... (Your login code is fine, no changes needed here) ...
    try {
        const { email, password } = req.body;
        // console.log("📩 Login attempt:", email); // Optional: Uncomment for debugging

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.isVerified) {
            return res.status(403).json({ message: "Please verify your email first." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            message: "Login successful",
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
        res.status(500).json({ message: "Server error during login" });
    }
});

export default router;