import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import API from "../../utils/api";

/* =======================
   Helper Components
======================= */

const TabButton = ({ tabName, label, activeTab, setActiveTab }) => {
  const isActive = activeTab === tabName;

  return (
    <button
      type="button"
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 font-semibold transition-all duration-200
        ${isActive
          ? "border-b-4 border-yellow-400 text-yellow-400"
          : "text-gray-400 hover:text-white"
        }`}
    >
      {label}
    </button>
  );
};

const EmptyState = ({ message }) => (
  <div className="col-span-full bg-gray-800 border border-gray-700 rounded-lg p-10 text-center">
    <p className="text-gray-400">{message}</p>
  </div>
);

/* =======================
   Modal
======================= */

const InternshipModal = ({ internship, onClose, onApply, isApplied, showMatched }) => {
  if (!internship) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 p-8 rounded-lg max-w-lg w-full border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-yellow-400 mb-3">
          {internship.program || internship.title}
        </h2>

        <p className="text-xl text-gray-300 mb-4">
          {internship.organization || internship.company}
        </p>

        <p className="text-gray-400 mb-2">
          <strong>Location:</strong> {internship.location || "N/A"}
        </p>

        {/* ONLY FOR RECOMMENDED */}
        {showMatched && (
          <p className="text-gray-400 mb-2">
            <strong>Skills Matched:</strong>{" "}
            {Array.isArray(internship.skillsMatched) &&
              internship.skillsMatched.length > 0
              ? internship.skillsMatched.join(", ")
              : "N/A"}
          </p>
        )}

        {/* ONLY FOR ALL OPPORTUNITIES */}
        {!showMatched && (
          <p className="text-gray-400 mb-2">
            <strong>Required Skills:</strong>{" "}
            {Array.isArray(internship.skillsRequired) &&
              internship.skillsRequired.length > 0
              ? internship.skillsRequired.join(", ")
              : "N/A"}
          </p>
        )}

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 px-5 py-2 rounded"
          >
            Close
          </button>

          {isApplied ? (
            <span className="text-green-500 font-semibold">✓ Applied</span>
          ) : (
            internship._id && (
              <button
                onClick={() => onApply(internship._id)}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-2 rounded font-semibold"
              >
                Apply Now
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

/* =======================
   Main Component
======================= */

const StudentDashboard = () => {
  const { user, token } = useAuth();

  const [activeTab, setActiveTab] = useState("recommended");
  const [selectedInternship, setSelectedInternship] = useState(null);

  const [recommendations, setRecommendations] = useState([]);
  const [allInternships, setAllInternships] = useState([]);
  const [appliedInternships, setAppliedInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------- Fetch Data ---------- */
  useEffect(() => {
    if (!user || !token) return;

    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [recs, all, applied] = await Promise.all([
          API.post(
            "/api/internships/recommendations",
            { userId: user.id },
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          API.get("/api/internships/list"),
          API.get("/api/internships/applied", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setRecommendations((recs.data?.recommendations || []).filter(Boolean));
        setAllInternships((all.data || []).filter(Boolean));
        setAppliedInternships((applied.data || []).filter(Boolean));
      } catch (err) {
        console.error("Error fetching internships:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [user, token]);

  /* ---------- Apply ---------- */
  const handleApply = async (internshipId) => {
    if (!internshipId) return;

    try {
      await API.post(
        `/api/internships/${internshipId}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const res = await API.get("/api/internships/applied", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppliedInternships((res.data || []).filter(Boolean));
      setSelectedInternship(null);
      alert("Application successful!");
    } catch (err) {
      alert(err.response?.data?.message || "Apply failed");
    }
  };

  const appliedIds = appliedInternships
    .filter((i) => i && i._id)
    .map((i) => i._id);

  /* ---------- Render ---------- */
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Welcome {user?.email}</h1>

      {/* Tabs */}
      <div className="flex space-x-8 border-b border-gray-700 mb-8 text-lg">
        <TabButton
          tabName="recommended"
          label="✨ Recommended For You"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabButton
          tabName="applied"
          label="📌 Applied Internships"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabButton
          tabName="all"
          label="📂 All Opportunities"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* RECOMMENDED */}
          {activeTab === "recommended" &&
            (recommendations.length > 0 ? (
              recommendations.map(
                (internship) =>
                  internship && (
                    <div
                      key={internship._id || internship.title}
                      className="bg-[#1f2937] p-6 rounded-xl border border-gray-700"
                    >
                      <h3 className="text-xl font-bold text-yellow-400 mb-1">
                        {internship.title}
                      </h3>
                      <p className="text-gray-300 mb-2">
                        {internship.company}
                      </p>
                      <p className="text-gray-400 text-sm mb-4">
                        Match Score: {internship.matchScore || 0}%
                      </p>

                      <button
                        onClick={() => setSelectedInternship(internship)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                      >
                        View Details
                      </button>
                    </div>
                  )
              )
            ) : (
              <EmptyState message="No recommendations found yet." />
            ))}

          {/* APPLIED */}
          {activeTab === "applied" &&
            (appliedInternships.length > 0 ? (
              appliedInternships.map(
                (internship) =>
                  internship && (
                    <div
                      key={internship._id}
                      className="bg-[#1f2937] p-6 rounded-xl border border-gray-700"
                    >
                      <h3 className="text-xl text-yellow-400">
                        {internship.program}
                      </h3>
                      <p className="text-green-500 font-semibold mt-2">
                        ✓ Applied
                      </p>
                    </div>
                  )
              )
            ) : (
              <EmptyState message="You haven't applied yet." />
            ))}

          {/* ALL */}
          {activeTab === "all" &&
            (allInternships.filter((i) => i?.status === "approved").length >
              0 ? (
              allInternships
                .filter((i) => i?.status === "approved")
                .map(
                  (internship) =>
                    internship && (
                      <div
                        key={internship._id}
                        className="bg-[#1f2937] p-6 rounded-xl border border-gray-700"
                      >
                        <h3 className="text-xl text-yellow-400">
                          {internship.program}
                        </h3>

                        <button
                          onClick={() => setSelectedInternship(internship)}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 mt-4 rounded"
                        >
                          View Details
                        </button>
                      </div>
                    )
                )
            ) : (
              <EmptyState message="No internships available." />
            ))}
        </div>
      )}

      {selectedInternship && (
        <InternshipModal
          internship={selectedInternship}
          onClose={() => setSelectedInternship(null)}
          onApply={handleApply}
          isApplied={appliedIds.includes(selectedInternship?._id)}
          showMatched={activeTab === "recommended"}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
