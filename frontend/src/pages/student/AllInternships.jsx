import { IoBriefcase } from "react-icons/io5";
import { IoLocationSharp } from "react-icons/io5";
import { FaRupeeSign } from "react-icons/fa";
import NoDataUI from "../../components/ui/NoDataUI";
import { useInternships } from "../../context/useInternships";
import { useAuth } from "../../context/AuthContext.jsx";
import AddInternship from "./AddInternship";
import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8080/api/internships";

const AllInternships = ({ selectedOption }) => {
  return <ShowSettingsContent selectedOption={selectedOption} />;
};

const ShowSettingsContent = ({ selectedOption }) => {
  const { allRelated, setAllRelated } = useInternships();
  const { user, token } = useAuth(); // ✅ need token for authorization
  const [localRelated, setLocalRelated] = useState(allRelated || []);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all internships on mount (for admin)
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const endpoint =
          user?.role === "admin"
            ? `${API_BASE}/` // admin → get all
            : `${API_BASE}/list`; // student → get approved only

        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = Array.isArray(res.data)
          ? res.data
          : res.data.recommendations || [];

        setLocalRelated(data);
        if (typeof setAllRelated === "function") setAllRelated(data);
      } catch (err) {
        console.error("❌ Error fetching internships:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, [user?.role, token]);

  const handleAdded = (newItem) => {
    setLocalRelated((p) => [newItem, ...p]);
    if (typeof setAllRelated === "function") setAllRelated((p) => [newItem, ...p]);
    setShowAdd(false);
  };

  return (
    <div className="mt-4 p-4 bg-[#1C2222] rounded-md border-[.1rem] border-[var(--primary-text-muted)]">
      <div>
        <h2 className="text-2xl font-semibold">{selectedOption.heading}</h2>
        <p className="text-sm text-[var(--primary-text-muted)]">
          {selectedOption.subheading}
        </p>
      </div>

      {/* Admin-only Add button */}
      {user?.role === "admin" && (
        <div className="mt-3">
          <button
            onClick={() => setShowAdd((s) => !s)}
            className="bg-[#FFE066] text-black px-3 py-1 rounded-md text-sm font-semibold"
          >
            {showAdd ? "Close" : "Add Internship"}
          </button>
        </div>
      )}

      {showAdd && user?.role === "admin" && (
        <AddInternship onAdded={handleAdded} />
      )}

      {/* Data Grid */}
      <div className="mt-4 flex flex-wrap gap-4">
        {loading ? (
          <p className="text-gray-400">Loading internships...</p>
        ) : localRelated.length === 0 ? (
          <NoDataUI />
        ) : (
          <SettingsCardWrapper allRelatedInternships={localRelated} />
        )}
      </div>
    </div>
  );
};

// --- List Wrapper ---
const SettingsCardWrapper = ({ allRelatedInternships }) => {
  return allRelatedInternships.map((data, i) => (
    <SettingsCard key={i} {...data} />
  ));
};

// --- Card Component ---
const SettingsCard = (props) => {
  const handleApply = () => {
    window.open(props.applyLink, "_blank");
  };

  return (
    <div className="border-[.1rem] h-fit w-[22rem] p-6 rounded-lg text-[var(--primary-text-muted)] bg-[#1a1a1a] shadow-md">
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-white">{props.program}</h2>
        <h3 className="flex items-center gap-2 text-sm">
          <IoBriefcase /> {props.organization}
        </h3>
      </div>

      <p className="text-sm italic">{props.perks}</p>

      <div className="my-4">
        <p className="text-sm mb-1">Requirements:</p>
        <div className="flex flex-wrap gap-2">
          {props.skills?.map((skill) => (
            <SettingCardSkills key={skill} skill={skill} />
          ))}
        </div>
      </div>

      <div className="my-3 text-sm space-y-1">
        <p className="flex items-center gap-2">
          <IoLocationSharp /> {props.location}
        </p>
        <p className="flex items-center gap-2">
          <FaRupeeSign /> {props.stipend || "Not specified"}
        </p>
        <p>
          <strong>Duration:</strong> {props.duration || "N/A"}
        </p>
        <p>
          <strong>Eligibility:</strong> {props.eligibility || "N/A"}
        </p>
        <p>
          <strong>Mode:</strong> {props.mode || "N/A"}
        </p>
        {props.contact_details && (
          <p>
            <strong>Contact:</strong>{" "}
            <a
              href={props.contact_details}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 underline"
            >
              {props.contact_details}
            </a>
          </p>
        )}
      </div>

      <button
        className="bg-[#FFE066] text-black w-full py-2 rounded-md text-sm font-semibold cursor-pointer hover:bg-yellow-400 transition"
        onClick={handleApply}
      >
        Apply Now
      </button>
    </div>
  );
};

const SettingCardSkills = ({ skill }) => {
  return (
    <span className="bg-[#2B3434] text-white rounded-xl px-2 text-xs py-1">
      {skill}
    </span>
  );
};

export default AllInternships;
