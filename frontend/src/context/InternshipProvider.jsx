import { useEffect, useState } from "react";
import axios from "axios";
import { InternshipContext } from "./InternshipContext";

export const InternshipProvider = ({ children }) => {
  const [recommended, setRecommended] = useState([]);
  const [allRelated, setAllRelated] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL;

  /* ===============================
     FETCH ALL INTERNSHIPS (PUBLIC)
  =============================== */
  const fetchInternships = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_BASE}/api/internships/list`
      );

      setInternships(res.data || []);
    } catch (err) {
      console.error("Error fetching internships:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     PLACEHOLDERS (ADMIN ONLY)
     These are intentionally empty
  =============================== */
  const addInternship = async () => {
    // Requires admin token – intentionally not implemented
  };

  const deleteInternship = async () => {
    // Requires admin token – intentionally not implemented
  };

  /* ===============================
     LOAD ON APP START
  =============================== */
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
        internships,
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
