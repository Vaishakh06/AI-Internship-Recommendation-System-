import axios from "axios";
import { toast } from "react-toastify";

export const fetchRecommendedInternships = async (email) => {
  try {
    const response = await toast.promise(
      axios.post(
        `${import.meta.env.VITE_API_URL}/api/internships/recommendations`,
        { email }, // ✅ send as JSON object
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ),
      {
        pending: "🤖 AI is finding internships from the server...",
        success: "✅ AI has approved your request! Enjoy your internships...",
        error: "❌ Something went wrong. Please try again.",
      }
    );

    return response.data; // ✅ return only data
  } catch (err) {
    console.error("Error fetching recommended internships:", err);
    return null;
  }
};
