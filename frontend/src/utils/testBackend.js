import axios from "axios";

export const fetchInternships = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/internships/list`
    );

    return response.data;
  } catch (err) {
    console.error("Error fetching internships:", err);
    throw err;
  }
};
