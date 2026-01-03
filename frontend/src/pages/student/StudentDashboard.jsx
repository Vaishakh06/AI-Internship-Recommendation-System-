import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import axios from 'axios';

const API_BASE = "http://localhost:8080/api/internships";

// --- The Main Dashboard Component ---
const StudentDashboard = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('recommended'); // recommended, applied, all

  const [selectedInternship, setSelectedInternship] = useState(null);

  const [recommendations, setRecommendations] = useState([]);
  const [allInternships, setAllInternships] = useState([]);
  const [appliedInternships, setAppliedInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. Helper Components ---

  // ✅ FIX: Added fallbacks (||) so it works for both regular list and recommendations
  const InternshipModal = ({ internship, onClose, onApply, isApplied }) => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-lg w-full border border-gray-700 m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fix: Use 'program' OR 'title' */}
        <h2 className="text-3xl font-bold text-yellow-400 mb-3">
          {internship.program || internship.title}
        </h2>

        {/* Fix: Use 'organization' OR 'company' */}
        <p className="text-xl text-gray-300 mb-4">
          {internship.organization || internship.company}
        </p>

        <div className="text-gray-400 space-y-2 mb-6">
          <p><strong>Location:</strong> {internship.location}</p>
          <p><strong>Stipend:</strong> {internship.stipend || 'N/A'}</p>

          {/* Fix: Safe check for skills. If undefined, use empty array [] */}
          <p><strong>Skills:</strong>
            {(internship.skills || internship.skillsMatched || []).join(', ')}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-5 rounded-lg"
          >
            Close
          </button>

          {isApplied ? (
            <span className="font-semibold text-green-500 py-2 px-5">
              ✓ Already Applied
            </span>
          ) : (
            <button
              onClick={() => onApply(internship._id)}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-5 rounded-lg"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const InternshipCard = ({ internship, onViewDetails, isApplied }) => (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg transition-transform hover:scale-[1.02]">
      <h3 className="text-xl font-semibold text-yellow-400 mb-2">{internship.program}</h3>
      <p className="text-gray-300 mb-3">{internship.organization}</p>

      <div className="text-sm text-gray-400 mb-4">
        <p><strong>Location:</strong> {internship.location}</p>
      </div>

      <button
        onClick={() => onViewDetails(internship)}
        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg"
      >
        {isApplied ? "View Details" : "View & Apply"}
      </button>
    </div>
  );

  const EmptyState = ({ message }) => (
    <div className="text-center p-10 bg-gray-800 rounded-lg border border-gray-700 col-span-full">
      <p className="text-gray-400">{message}</p>
    </div>
  );

  // ✅ Simple, clean TabButton (no reload inside)
  const TabButton = ({ tabName, label }) => {
    const isActive = activeTab === tabName;
    return (
      <button
        onClick={() => setActiveTab(tabName)}
        className={`py-2 px-5 font-semibold transition-colors
          ${isActive
            ? 'border-b-2 border-yellow-400 text-yellow-400'
            : 'text-gray-400 hover:text-white'
          }`}
      >
        {label}
      </button>
    );
  };

  // --- 2. Data Fetching and Handling ---

  useEffect(() => {
    if (!user || !token) return;

    let hasFetched = false; // ✅ guard flag

    const fetchAllData = async () => {
      if (hasFetched) return; // ✅ prevent duplicates
      hasFetched = true;

      setLoading(true);
      try {
        const [recs, all, applied] = await Promise.all([
          axios.post(
            `${API_BASE}/recommendations`,
            { userId: user.id },
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(`${API_BASE}/list`),
          axios.get(`${API_BASE}/applied`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setRecommendations(recs.data.recommendations);
        setAllInternships(all.data);
        setAppliedInternships(applied.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    // Run only once on mount
    fetchAllData();

    // ✅ cleanup to prevent re-trigger
    return () => {
      hasFetched = true;
    };
  }, []); // ✅ empty dependency array


  const handleApply = async (internshipId) => {
    try {
      await axios.post(
        `${API_BASE}/${internshipId}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const res = await axios.get(`${API_BASE}/applied`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppliedInternships(res.data);

      alert('Application successful!');
      setSelectedInternship(null);
    } catch (err) {
      console.error("Error applying:", err);
      alert(err.response?.data?.message || 'Error applying');
    }
  };

  const appliedIds = appliedInternships.map(i => i._id);

  // --- 3. The JSX to Render ---
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        Welcome {user?.email || "Student"} 👋
      </h1>

      {/* 🔄 Re-run Button — appears only once */}
      <button
        onClick={() => window.location.reload()}
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-lg mb-6"
      >
        🔄 Re-run AI Recommendation
      </button>

      {/* --- Tab Navigation --- */}
      <div className="flex space-x-6 border-b border-gray-700 mb-8">
        <TabButton tabName="recommended" label="Recommended" />
        <TabButton tabName="applied" label="Applied" />
        <TabButton tabName="all" label="All Internships" />
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Recommended Tab */}
          {activeTab === "recommended" && (
            recommendations.length > 0 ? (
              recommendations.map((internship) => (
                <div
                  key={internship.title}
                  className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg hover:scale-[1.02] transition-transform"
                >
                  <h3 className="text-xl font-semibold text-yellow-400 mb-2">
                    {internship.title}
                  </h3>
                  <p className="text-gray-300 mb-1">
                    {internship.company}
                  </p>
                  <p className="text-gray-400 text-sm mb-3">
                    <strong>Location:</strong> {internship.location}
                  </p>
                  <p className="text-gray-400 text-sm mb-3">
                    <strong>Match Score:</strong> {internship.matchScore}%
                  </p>
                  <p className="text-gray-400 text-sm mb-4">
                    <strong>Skills Matched:</strong>{" "}
                    {internship.skillsMatched.join(", ") || "N/A"}
                  </p>

                  {/* --- Buttons --- */}
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => setSelectedInternship(internship)}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg"
                    >
                      View Details
                    </button>

                    {internship._id ? (
                      <button
                        onClick={() => handleApply(internship._id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-lg"
                      >
                        Apply Now
                      </button>
                    ) : (
                      <span className="text-gray-500 italic text-sm">Apply unavailable</span>
                    )}

                  </div>
                </div>
              ))
            ) : (
              <EmptyState message="No recommendations found yet." />
            )
          )}





          {/* Applied Tab */}
          {activeTab === 'applied' && (
            appliedInternships.length > 0 ? (
              appliedInternships.map((internship) => (
                <InternshipCard
                  key={internship._id}
                  internship={internship}
                  onViewDetails={setSelectedInternship}
                  isApplied={true}
                />
              ))
            ) : <EmptyState message="You haven't applied to any internships yet." />
          )}

          {/* All Internships Tab */}
          {activeTab === 'all' && (
            allInternships.length > 0 ? (
              allInternships
                .filter(i => i.status === 'approved')
                .map((internship) => (
                  <InternshipCard
                    key={internship._id}
                    internship={internship}
                    onViewDetails={setSelectedInternship}
                    isApplied={appliedIds.includes(internship._id)}
                  />
                ))
            ) : <EmptyState message="No internships are available." />
          )}
        </div>
      )}

      {/* --- Render The Modal --- */}
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
