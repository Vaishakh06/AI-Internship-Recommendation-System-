
import db from "../config/db.js";
import Internship from "./Internship.js"; // your Mongoose model

export const getAllInternships = async () => {
  // Return all internships from MongoDB
  return await Internship.find(); // simple find() fetches all documents
};


export const getRecommendedInternships = async (email) => {
  // Example: find internships that match the user's preferences
  return await Internship.find({ status: "approved" });
};
