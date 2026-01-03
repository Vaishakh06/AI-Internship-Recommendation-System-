// frontend/src/context/InternshipProvider.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { InternshipContext } from "./InternshipContext"; 

export const InternshipProvider = ({ children }) => {
  const [recommended, setRecommended] = useState([]);
  const [allRelated, setAllRelated] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      // --- THIS IS THE FIX ---
      // Change the URL to the public-facing "list" route
      const res = await axios.get("http://localhost:8080/api/internships/list");
      setInternships(res.data || []);
    } catch (err) {
      console.error("Error fetching internships:", err);
    } finally {
      setLoading(false);
    }
  };

  // Note: addInternship and deleteInternship shouldn't be in this public
  // provider, as only admins can do this. They should be in AdminDashboard.jsx
  // but we can leave them for now.
  const addInternship = async (data) => {
    // ... (this function won't work without a token) ...
  };
  const deleteInternship = async (id) => {
    // ... (this function won't work without a token) ...
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  return (
    <InternshipContext.Provider
      value={{
        recommended,
        setRecommended,
        allRelated,
        setAllRelated,
        internships, // This now holds only "approved" internships
        fetchInternships,
        addInternship,
        deleteInternship,
        loading,
      }}
    >
      {children}
    </InternshipContext.Provider>
  );
};