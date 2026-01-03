import axios from "axios";
import { toast } from "react-toastify"; 

export const updateUserProfile = async (formData) => {
  try {
    const response = await toast.promise(
      async () => {
        const res = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/auth/signup`,
          formData,
          { headers: { "Content-Type": "application/json" } }
        );
        return res.data; // return only data here
      },
      {
        pending: "🤖 AI is viewing your profile...",
        success:
          "✅ AI has approved your resume! Connecting you to employers...",
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
