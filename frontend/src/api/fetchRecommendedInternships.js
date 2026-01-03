import axios from "axios";
import { toast } from "react-toastify"; 

export const fetchRecommenedInternships = async (email) => {
  try {
    const response = await toast.promise(
      async () => {
        const res = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/internships/recommendations`,
          email,
          { headers: { "Content-Type": "application/json" } }
        );
        return res.data; // return only data here
      },
      {
        pending: "🤖 AI is finding internships from the server...",
        success:
          "✅ AI has approved your request! Enjoy your internships...",
        error: "❌ Something went wrong. Please try again.",
      }
    );

    // console.log("Server response inside toast.promise:", response);
    return response; // already the data
  } catch (err) {
    console.error(err);
    return null;
  }
};