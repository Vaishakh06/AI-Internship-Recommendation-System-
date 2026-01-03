import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.log("⚠️  MongoDB URI not configured. Some features may be limited.");
      return;
    }
    
    // Set connection options
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    
    await mongoose.connect(process.env.MONGO_URI, options);
    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.log("⚠️  MongoDB connection failed:", error.message);
    console.log("⚠️  Authentication features won't work, but chatbot still works.");
    console.log("⚠️  Please check:");
    console.log("   1. Your IP is whitelisted in MongoDB Atlas");
    console.log("   2. Database credentials are correct");
    console.log("   3. Network connection is stable");
  }
};

export default connectDB;
