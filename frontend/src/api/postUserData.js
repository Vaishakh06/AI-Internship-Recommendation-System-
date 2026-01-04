import axios from "axios";
import { toast } from "react-toastify";

export const updateUserProfile = async (formData, token) => {
  try {
    const response = await toast.promise(
      axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ),
      {
        pending: "🤖 Updating your profile...",
        success: "✅ Profile updated successfully!",
        error: "❌ Failed to update profile. Please try again.",
      }
    );

    return response.data;
  } catch (err) {
    console.error("Profile update error:", err);
    return null;
  }
};
