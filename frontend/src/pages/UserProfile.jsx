import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const UserProfile = () => {
    const { user, token, loading } = useAuth();
    const API_BASE = import.meta.env.VITE_API_URL;

    const [formData, setFormData] = useState({
        fullName: "",
        skills: "",
        education: {
            university: "",
            degree: "",
            graduationYear: "",
        },
        experience: [],
        portfolioLink: "",
        resumeLink: "",
    });

    const { fullName, skills, education, experience, portfolioLink, resumeLink } =
        formData;

    /* ===============================
       FETCH PROFILE
    =============================== */
    useEffect(() => {
        if (!user || !token) return;

        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/users/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = res.data;

                setFormData({
                    fullName: data.fullName || "",
                    skills: Array.isArray(data.skills) ? data.skills.join(", ") : "",
                    education: {
                        university: data.education?.university || "",
                        degree: data.education?.degree || "",
                        graduationYear: data.education?.graduationYear || "",
                    },
                    experience: Array.isArray(data.experience) ? data.experience : [],
                    portfolioLink: data.portfolioLink || "",
                    resumeLink: data.resumeLink || "",
                });
            } catch (err) {
                console.error(err);
                toast.error("Failed to load profile");
            }
        };

        fetchProfile();
    }, [user, token, API_BASE]);

    /* ===============================
       HANDLERS
    =============================== */
    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onEducationChange = (e) => {
        setFormData({
            ...formData,
            education: {
                ...formData.education,
                [e.target.name]: e.target.value,
            },
        });
    };

    const addExperience = () => {
        setFormData({
            ...formData,
            experience: [
                ...formData.experience,
                { title: "", company: "", description: "" },
            ],
        });
    };

    const handleExperienceChange = (index, e) => {
        const updated = [...formData.experience];
        updated[index][e.target.name] = e.target.value;
        setFormData({ ...formData, experience: updated });
    };

    const removeExperience = (index) => {
        setFormData({
            ...formData,
            experience: formData.experience.filter((_, i) => i !== index),
        });
    };

    /* ===============================
       SUBMIT
    =============================== */
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            skills: skills
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
        };

        try {
            await axios.put(`${API_BASE}/api/users/profile`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            toast.success("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile");
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    const inputStyle =
        "w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500";
    const labelStyle = "block text-sm text-gray-400 mb-2";

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Your Profile</h1>

            <form onSubmit={handleSubmit} className="space-y-8 bg-gray-800 p-8 rounded-lg">

                {/* BASIC INFO */}
                <section>
                    <h2 className="text-yellow-400 text-xl mb-4">Basic Information</h2>
                    <input
                        name="fullName"
                        value={fullName}
                        onChange={onChange}
                        className={inputStyle}
                        placeholder="Full Name"
                    />
                </section>

                {/* SKILLS */}
                <section>
                    <h2 className="text-yellow-400 text-xl mb-4">Skills</h2>
                    <input
                        name="skills"
                        value={skills}
                        onChange={onChange}
                        className={inputStyle}
                        placeholder="React, Node, MongoDB"
                    />
                </section>

                {/* EDUCATION */}
                <section>
                    <h2 className="text-yellow-400 text-xl mb-4">Education</h2>
                    <input
                        name="university"
                        value={education.university}
                        onChange={onEducationChange}
                        className={inputStyle}
                        placeholder="University"
                    />
                </section>

                {/* EXPERIENCE */}
                <section>
                    <h2 className="text-yellow-400 text-xl mb-4">Experience</h2>
                    {experience.map((exp, i) => (
                        <div key={i} className="border p-4 mb-4 rounded">
                            <input
                                name="title"
                                value={exp.title}
                                onChange={(e) => handleExperienceChange(i, e)}
                                className={inputStyle}
                                placeholder="Title"
                            />
                            <button
                                type="button"
                                onClick={() => removeExperience(i)}
                                className="text-red-400 mt-2"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addExperience} className="text-yellow-400">
                        + Add Experience
                    </button>
                </section>

                {/* LINKS */}
                <section>
                    <input
                        name="portfolioLink"
                        value={portfolioLink}
                        onChange={onChange}
                        className={inputStyle}
                        placeholder="Portfolio URL"
                    />
                    <input
                        name="resumeLink"
                        value={resumeLink}
                        onChange={onChange}
                        className={inputStyle}
                        placeholder="Resume URL"
                    />
                </section>

                <button className="w-full bg-yellow-500 py-3 rounded text-black font-bold">
                    Save Profile
                </button>
            </form>
        </div>
    );
};

export default UserProfile;
