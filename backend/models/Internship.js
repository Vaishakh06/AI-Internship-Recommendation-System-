import mongoose from "mongoose";

const InternshipSchema = new mongoose.Schema(
  {
    program: { type: String, required: true },
    organization: { type: String, required: true },
    applyLink: { type: String, required: true },
    skills: [{ type: String }],
    location: { type: String, required: true },
    stipend: { type: String },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
    
    // --- ADD THIS FIELD ---
    // An array of user IDs who have applied
    appliedBy: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }],
  },
  { timestamps: true }
);

const Internship = mongoose.model("Internship", InternshipSchema);
export default Internship;