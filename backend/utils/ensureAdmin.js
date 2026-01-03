import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

// Creates a default admin user if none exists.
// Controlled by env vars:
//   ADMIN_EMAIL, ADMIN_PASSWORD
export default async function ensureAdmin() {
  try {
    if (!process.env.MONGO_URI) {
      return; // DB not configured; skip seeding
    }
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";

    let admin = await User.findOne({ email: adminEmail });
    if (admin) return;

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(adminPassword, salt);
    await User.create({ email: adminEmail, password: hashed, role: "admin", fullName: "Administrator" });
    console.log(`✅ Default admin ensured: ${adminEmail}`);
  } catch (err) {
    console.log("⚠️  ensureAdmin failed:", err.message);
  }
}


