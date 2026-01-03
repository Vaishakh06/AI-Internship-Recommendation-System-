import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- APPLICANTS MODAL COMPONENT ---
const ApplicantsModal = ({ internship, onClose }) => {
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  if (selectedApplicant) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-2xl w-full border border-gray-700 m-4 max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold text-yellow-400 mb-4 border-b border-gray-700 pb-3">
            Applicant Details: {selectedApplicant.fullName || 'No Name'}
          </h2>

          <div className="text-gray-300 space-y-3 overflow-y-auto flex-grow pr-2 text-sm">
            <p><strong>Email:</strong> {selectedApplicant.email}</p>

            {selectedApplicant.skills && selectedApplicant.skills.length > 0 && (
              <p><strong>Skills:</strong> {selectedApplicant.skills.join(', ')}</p>
            )}

            {selectedApplicant.education && (
              <p>
                <strong>Education:</strong> {selectedApplicant.education.degree || ''} at {selectedApplicant.education.university || ''}
                {selectedApplicant.education.graduationYear ? ` (Grad. ${selectedApplicant.education.graduationYear})` : ''}
              </p>
            )}

            {selectedApplicant.experience && selectedApplicant.experience.length > 0 && (
              <div className="mt-2">
                <strong>Experience:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  {selectedApplicant.experience.map((exp, idx) => (
                    <li key={idx}>
                      <span className="font-semibold">{exp.title || 'Job Title'}</span> at {exp.company || 'Company'}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-gray-700 flex flex-wrap gap-x-6 gap-y-2">
              {selectedApplicant.portfolioLink && (
                <div>
                  <strong>Portfolio:</strong> <a href={selectedApplicant.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline break-all">{selectedApplicant.portfolioLink}</a>
                </div>
              )}
              {selectedApplicant.resumeLink && (
                <div>
                  <strong>Resume:</strong> <a href={selectedApplicant.resumeLink} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline break-all">{selectedApplicant.resumeLink}</a>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button onClick={() => setSelectedApplicant(null)} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-5 rounded-lg">
              &larr; Back to List
            </button>
            <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-5 rounded-lg">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-lg w-full border border-gray-700 m-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-yellow-400 mb-6 border-b border-gray-700 pb-3">
          Applicants for: {internship.program}
        </h2>

        <div className="space-y-3 overflow-y-auto flex-grow pr-2">
          {internship.appliedBy && internship.appliedBy.length > 0 ? (
            internship.appliedBy.map((student) => (
              <div
                key={student._id}
                className="p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                onClick={() => setSelectedApplicant(student)}
              >
                <p className="font-semibold text-white">{student.fullName || 'No Name Provided'}</p>
                <p className="text-sm text-gray-400">{student.email}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No one has applied to this internship yet.</p>
          )}
        </div>

        <button onClick={onClose} className="mt-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-5 rounded-lg self-end">
          Close
        </button>
      </div>
    </div>
  );
};

// --- MAIN ADMIN DASHBOARD ---
const AdminDashboard = () => {
  const { user, token } = useAuth();
  const [internships, setInternships] = useState([]);
  const [viewingApplicants, setViewingApplicants] = useState(null);

  const [newInternship, setNewInternship] = useState({
    program: "", organization: "", applyLink: "",
    skills: "", location: "", stipend: "",
  });

  const API_BASE = "http://localhost:8080/api/internships";

  // --- Fetch Internships ---
  const fetchInternships = async () => {
    try {
      // ✅ FIX: Added "/all" to match your Backend Route
      const res = await axios.get(`${API_BASE}/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const internshipsWithApplied = res.data.map(internship => ({
        ...internship,
        appliedBy: internship.appliedBy || []
      }));
      setInternships(internshipsWithApplied);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch internships");
    }
  };

  useEffect(() => {
    if (token) {
      fetchInternships();
    }
  }, [token]);

  // --- Handlers ---
  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`${API_BASE}/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(`Internship ${status}`);
      fetchInternships();
    } catch (err) { console.error(err); toast.error("Action failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Internship deleted");
      fetchInternships();
    } catch (err) { console.error(err); toast.error("Delete failed"); }
  };

  const handleAddInternship = async (e) => {
    e.preventDefault();
    try {
      // ✅ FIX: Added "/create" to match your Backend Route
      await axios.post(
        `${API_BASE}/create`,
        { ...newInternship, skills: newInternship.skills.split(",").map((s) => s.trim()) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Internship added");
      setNewInternship({ program: "", organization: "", applyLink: "", skills: "", location: "", stipend: "", });
      fetchInternships();
    } catch (err) { console.error(err); toast.error(err.response?.data?.message || "Failed to add internship"); }
  };

  const inputStyle = "w-full p-3 rounded-lg bg-gray-700 text-white border border-transparent focus:border-yellow-500 focus:bg-gray-600 focus:outline-none";

  return (
    <div>
      <ToastContainer position="top-right" autoClose={2000} theme="dark" transition={Bounce} />

      <div className="mb-10 bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-5 text-yellow-400">Add New Internship</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={handleAddInternship}>
          <input type="text" placeholder="Program / Title" value={newInternship.program} onChange={(e) => setNewInternship({ ...newInternship, program: e.target.value })} className={inputStyle} required />
          <input type="text" placeholder="Organization" value={newInternship.organization} onChange={(e) => setNewInternship({ ...newInternship, organization: e.target.value })} className={inputStyle} required />
          <input type="text" placeholder="Apply Link" value={newInternship.applyLink} onChange={(e) => setNewInternship({ ...newInternship, applyLink: e.target.value })} className={inputStyle} required />
          <input type="text" placeholder="Location" value={newInternship.location} onChange={(e) => setNewInternship({ ...newInternship, location: e.target.value })} className={inputStyle} required />
          <input type="text" placeholder="Stipend (e.g., $1000/mo or N/A)" value={newInternship.stipend} onChange={(e) => setNewInternship({ ...newInternship, stipend: e.target.value })} className={inputStyle} />
          <input type="text" placeholder="Skills (comma-separated, e.g., Python, C++)" value={newInternship.skills} onChange={(e) => setNewInternship({ ...newInternship, skills: e.target.value })} className={inputStyle} required />
          <button type="submit" className="col-span-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg text-lg transition-colors"> Add Internship </button>
        </form>
      </div>

      <h2 className="text-2xl font-semibold mb-5 text-gray-300">Manage Internships</h2>
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            {/* ✅ FIX: Removed comments and extra spaces from thead to prevent hydration error */}
            <thead className="bg-gray-900 bg-opacity-50">
              <tr>
                <th className="p-4 text-left font-semibold text-yellow-400 uppercase">Program</th>
                <th className="p-4 text-left font-semibold text-yellow-400 uppercase">Organization</th>
                <th className="p-4 text-left font-semibold text-yellow-400 uppercase">Applicants</th>
                <th className="p-4 text-left font-semibold text-yellow-400 uppercase">Status</th>
                <th className="p-4 text-left font-semibold text-yellow-400 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {internships.length > 0 ? internships.map((internship) => (
                <tr key={internship._id} className="hover:bg-gray-700/50 transition-colors">

                  <td className="p-4 whitespace-nowrap">{internship.program}</td>
                  <td className="p-4 whitespace-nowrap text-gray-300">{internship.organization}</td>

                  <td className="p-4 whitespace-nowrap">
                    <button
                      onClick={() => setViewingApplicants(internship)}
                      className="text-yellow-400 hover:text-yellow-300 hover:underline disabled:text-gray-500 disabled:no-underline"
                      disabled={!internship.appliedBy || internship.appliedBy.length === 0}
                    >
                      {Array.isArray(internship.appliedBy) ? internship.appliedBy.length : 0} Applicants
                    </button>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full font-semibold text-xs
                      ${internship.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        internship.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'}`}>
                      {internship.status}
                    </span>
                  </td>

                  <td className="p-4 flex gap-2">
                    {internship.status !== 'approved' && (<button onClick={() => handleStatusChange(internship._id, "approved")} className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-lg text-xs"> Approve </button>)}
                    {internship.status !== 'rejected' && (<button onClick={() => handleStatusChange(internship._id, "rejected")} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded-lg text-xs"> Reject </button>)}
                    <button onClick={() => handleDelete(internship._id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg text-xs"> Delete </button>
                  </td>

                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center p-10 text-gray-400">
                    No internships found. Add one using the form above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewingApplicants && (
        <ApplicantsModal
          internship={viewingApplicants}
          onClose={() => setViewingApplicants(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;