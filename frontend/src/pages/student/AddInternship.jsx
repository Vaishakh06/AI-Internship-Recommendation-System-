import { useState } from "react";

const AddInternship = ({ onAdded }) => {
  const [form, setForm] = useState({
    program: "",
    organization: "",
    applyLink: "",
    perks: "",
    skills: "",
    location: "",
    stipend: "",
    duration: "",
    eligibility: "",
    mode: "",
    contact_details: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      ...form,
      skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const token = localStorage.getItem("token"); // or get from auth context
      const res = await fetch("/api/internships", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Failed" }));
        throw new Error(err.message || "Failed to create internship");
      }

      const created = await res.json();
      onAdded(created);
      setForm({
        program: "",
        organization: "",
        applyLink: "",
        perks: "",
        skills: "",
        location: "",
        stipend: "",
        duration: "",
        eligibility: "",
        mode: "",
        contact_details: "",
      });
    } catch (err) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="my-4 p-4 bg-[#0f1414] rounded-md w-full">
      {error && <div className="text-red-400 mb-2">{error}</div>}

      <div className="grid grid-cols-2 gap-2">
        <input name="program" value={form.program} onChange={handleChange} placeholder="Program" className="p-2" required />
        <input name="organization" value={form.organization} onChange={handleChange} placeholder="Organization" className="p-2" required />
        <input name="applyLink" value={form.applyLink} onChange={handleChange} placeholder="Apply link (https://...)" className="p-2 col-span-2" />
        <input name="perks" value={form.perks} onChange={handleChange} placeholder="Perks" className="p-2 col-span-2" />
        <input name="skills" value={form.skills} onChange={handleChange} placeholder="Skills (comma separated)" className="p-2 col-span-2" />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="p-2" />
        <input name="stipend" value={form.stipend} onChange={handleChange} placeholder="Stipend" className="p-2" />
        <input name="duration" value={form.duration} onChange={handleChange} placeholder="Duration" className="p-2" />
        <input name="eligibility" value={form.eligibility} onChange={handleChange} placeholder="Eligibility" className="p-2" />
        <input name="mode" value={form.mode} onChange={handleChange} placeholder="Mode (Remote/Hybrid/Onsite)" className="p-2" />
        <input name="contact_details" value={form.contact_details} onChange={handleChange} placeholder="Contact (email/URL)" className="p-2 col-span-2" />
      </div>

      <div className="mt-3 flex gap-2">
        <button type="submit" disabled={loading} className="bg-[#FFE066] text-black px-3 py-1 rounded-md">
          {loading ? "Adding..." : "Add Internship"}
        </button>
      </div>
    </form>
  );
};

export default AddInternship;