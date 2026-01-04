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

const InternshipCard = ({ internship, onViewDetails, isApplied }) => (
  <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-700 shadow-lg hover:scale-[1.02] transition-transform">
    <h3 className="text-xl font-bold text-yellow-400 mb-1">
      {internship.program}
    </h3>

    <p className="text-gray-300 font-medium mb-2">
      {internship.organization}
    </p>

    <div className="text-sm text-gray-400 space-y-1 mb-4">
      <p><strong>Location:</strong> {internship.location}</p>
      <p><strong>Stipend:</strong> {internship.stipend || "N/A"}</p>
    </div>

    <div className="flex justify-between items-center">
      <button
        onClick={() => onViewDetails(internship)}
        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg"
      >
        View Details
      </button>

      {isApplied && (
        <span className="text-green-500 font-semibold">✓ Applied</span>
      )}
    </div>
  </div>
);

/* =======================
   Modal
======================= */

const InternshipModal = ({ internship, onClose, onApply, isApplied }) => (
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
        <strong>Location:</strong> {internship.location}
      </p>

      <p className="text-gray-400 mb-4">
        <p>
          <strong>Skills Matched:</strong>{" "}
          {(internship.skillsMatched && internship.skillsMatched.length > 0)
            ? internship.skillsMatched.join(", ")
            : "N/A"}
        </p>

      </p>

      <div className="flex justify-between items-center">
        <button
          onClick={onClose}
          className="bg-gray-600 hover:bg-gray-700 px-5 py-2 rounded"
        >
          Close
        </button>

        {isApplied ? (
          <span className="text-green-500 font-semibold">✓ Applied</span>
        ) : (
          <button
            onClick={() => onApply(internship._id)}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-2 rounded font-semibold"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  </div>
);

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

        setRecommendations(recs.data.recommendations || []);
        setAllInternships(all.data || []);
        setAppliedInternships(applied.data || []);
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
    try {
      await API.post(
        `/api/internships/${internshipId}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const res = await API.get("/api/internships/applied", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppliedInternships(res.data);
      setSelectedInternship(null);
      alert("Application successful!");
    } catch (err) {
      alert(err.response?.data?.message || "Apply failed");
    }
  };

  const appliedIds = appliedInternships.map((i) => i._id);

  /* ---------- Render ---------- */
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        Welcome {user?.email}
      </h1>

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
          {/* Recommended */}
          {activeTab === "recommended" &&
            (recommendations.length > 0 ? (
              recommendations.map((internship) => (
                <div
                  key={internship._id || internship.title}
                  className="bg-[#1f2937] p-6 rounded-xl border border-gray-700 shadow-lg"
                >
                  <h3 className="text-xl font-bold text-yellow-400 mb-1">
                    {internship.title}
                  </h3>

                  <p className="text-gray-300 mb-2">
                    {internship.company}
                  </p>

                  <div className="text-sm text-gray-400 space-y-1 mb-4">
                    <p><strong>Location:</strong> {internship.location}</p>
                    <p><strong>Match Score:</strong> {internship.matchScore}%</p>
                    <p>
                      <strong>Skills:</strong>{" "}
                      {(internship.skillsMatched || []).join(", ")}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setSelectedInternship(internship)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                    >
                      View Details
                    </button>

                    {internship._id && (
                      <button
                        onClick={() => handleApply(internship._id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded font-semibold"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <EmptyState message="No recommendations found yet." />
            ))}

          {/* Applied */}
          {activeTab === "applied" &&
            (appliedInternships.length > 0 ? (
              appliedInternships.map((internship) => (
                <InternshipCard
                  key={internship._id}
                  internship={internship}
                  onViewDetails={setSelectedInternship}
                  isApplied={true}
                />
              ))
            ) : (
              <EmptyState message="You haven't applied to any internships yet." />
            ))}

          {/* All */}
          {activeTab === "all" &&
            (allInternships.filter(i => i.status === "approved").length > 0 ? (
              allInternships
                .filter(i => i.status === "approved")
                .map((internship) => (
                  <InternshipCard
                    key={internship._id}
                    internship={internship}
                    onViewDetails={setSelectedInternship}
                    isApplied={appliedIds.includes(internship._id)}
                  />
                ))
            ) : (
              <EmptyState message="No internships are available." />
            ))}
        </div>
      )}

      {selectedInternship && (
        <InternshipModal
          internship={selectedInternship}
          onClose={() => setSelectedInternship(null)}
          onApply={handleApply}
          isApplied={appliedIds.includes(selectedInternship._id)}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
