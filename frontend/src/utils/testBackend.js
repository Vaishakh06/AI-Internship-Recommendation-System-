import axios from "axios";

export const fetchInternships = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/test`,
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    console.error("Error fetching internships:", err);
    throw err;
  }
};
