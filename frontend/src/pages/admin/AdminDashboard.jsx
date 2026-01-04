import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../utils/api";

/* =======================
   Applicants Modal
======================= */
const ApplicantsModal = ({ internship, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 p-6 rounded-lg max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-yellow-400 mb-4">
          Applicants for: {internship.program}
        </h2>

        {internship.appliedBy?.length ? (
          internship.appliedBy.map((student) => (
            <div key={student._id} className="bg-gray-700 p-3 rounded mb-2">
              <p className="font-semibold">{student.fullName}</p>
              <p className="text-sm text-gray-300">{student.email}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No applicants yet.</p>
        )}

        <button
          onClick={onClose}
          className="mt-4 bg-gray-600 px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

/* =======================
   Main Admin Dashboard
======================= */
const AdminDashboard = () => {
  const { token } = useAuth();
  const [internships, setInternships] = useState([]);
  const [viewingApplicants, setViewingApplicants] = useState(null);

  const [newInternship, setNewInternship] = useState({
    program: "",
    organization: "",
    applyLink: "",
    skills: "",
    location: "",
    stipend: "",
  });

  /* ---------- Fetch ---------- */
  const fetchInternships = async () => {
    try {
      const res = await API.get("/api/internships/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInternships(res.data || []);
    } catch {
      toast.error("Failed to fetch internships");
    }
  };

  useEffect(() => {
    if (token) fetchInternships();
  }, [token]);

  /* ---------- Actions ---------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this internship?")) return;
    try {
      await API.delete(`/api/internships/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Internship deleted");
      fetchInternships();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleAddInternship = async (e) => {
    e.preventDefault();
    try {
      await API.post(
        "/api/internships/create",
        {
          ...newInternship,
          skills: newInternship.skills.split(",").map(s => s.trim()),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Internship added");
      setNewInternship({
        program: "",
        organization: "",
        applyLink: "",
        skills: "",
        location: "",
        stipend: "",
      });
      fetchInternships();
    } catch {
      toast.error("Failed to add internship");
    }
  };

  /* ---------- Render ---------- */
  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={2000} theme="dark" transition={Bounce} />

      <h1 className="text-3xl font-bold mb-6 text-yellow-400">
        Admin Dashboard
      </h1>

      {/* Add Internship */}
      <form
        onSubmit={handleAddInternship}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
      >
        {["program", "organization", "applyLink", "location", "stipend", "skills"].map(field => (
          <input
            key={field}
            placeholder={field.toUpperCase()}
            value={newInternship[field]}
            onChange={(e) =>
              setNewInternship({ ...newInternship, [field]: e.target.value })
            }
            className="bg-gray-700 p-3 rounded"
            required={field !== "stipend"}
          />
        ))}
        <button className="col-span-full bg-yellow-500 text-black font-bold py-2 rounded">
          Add Internship
        </button>
      </form>

      {/* Internship List */}
      <div className="space-y-4">
        {internships.map((internship) => (
          <div
            key={internship._id}
            className="bg-gray-800 p-4 rounded flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{internship.program}</h2>
              <p className="text-sm text-gray-400">{internship.organization}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewingApplicants(internship)}
                className="bg-blue-600 px-3 py-1 rounded text-sm"
              >
                Applicants
              </button>
              <button
                onClick={() => handleDelete(internship._id)}
                className="bg-red-600 px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
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
