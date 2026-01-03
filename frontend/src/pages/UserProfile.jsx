// frontend/src/pages/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserProfile = () => {
    const { user, token, loading } = useAuth();

    const [formData, setFormData] = useState({
        fullName: '',
        skills: '',
        education: { university: '', degree: '', graduationYear: '' },
        experience: [],
        portfolioLink: '',
        resumeLink: '',
    });

    const { fullName, skills, education, experience, portfolioLink, resumeLink } = formData;
    const API_BASE = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (user && token) {
            const fetchProfile = async () => {
                try {
                    const res = await axios.get(`${API_BASE}/api/users/profile`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (!res.data) return;

                    const profileData = res.data;
                    const fetchedEducation = profileData.education || {};
                    const fetchedExperience = Array.isArray(profileData.experience) ? profileData.experience : [];
                    const fetchedSkills = Array.isArray(profileData.skills) ? profileData.skills.join(', ') : '';

                    setFormData({
                        fullName: profileData.fullName || '',
                        skills: fetchedSkills,
                        education: {
                            university: fetchedEducation.university || '',
                            degree: fetchedEducation.degree || '',
                            graduationYear: fetchedEducation.graduationYear ? String(fetchedEducation.graduationYear) : '',
                        },
                        experience: fetchedExperience,
                        portfolioLink: profileData.portfolioLink || '',
                        resumeLink: profileData.resumeLink || '',
                    });

                } catch (err) {
                    console.error('Failed to fetch profile', err);
                    toast.error('Could not load your profile data.');
                }
            };
            fetchProfile();
        }
    }, [user, token]);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onEducationChange = (e) => {
        setFormData({
            ...formData,
            education: { ...formData.education, [e.target.name]: e.target.value }
        });
    };

    const addExperience = () => {
        setFormData({
            ...formData,
            experience: [...formData.experience, { title: '', company: '', description: '' }]
        });
    };

    const handleExperienceChange = (index, e) => {
        const updatedExperience = formData.experience.map((exp, i) =>
            i === index ? { ...exp, [e.target.name]: e.target.value } : exp
        );
        setFormData({ ...formData, experience: updatedExperience });
    };

    const removeExperience = (index) => {
        setFormData({
            ...formData,
            experience: formData.experience.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `${API_BASE}/api/users/profile`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Profile Updated!');
        } catch (err) {
            console.error('Failed to save profile', err);
            toast.error('Failed to save profile');
        }
    };

    if (loading) return <div className="text-center p-10">Loading...</div>;

    const inputStyle = "w-full p-3 rounded-lg bg-gray-700 text-white border border-transparent focus:border-yellow-500 focus:bg-gray-600 focus:outline-none";
    const labelStyle = "block text-sm font-medium text-gray-400 mb-2";

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">Your Profile</h1>
            <div className="bg-gray-800 border border-gray-700 p-8 rounded-lg shadow-lg max-w-3xl mx-auto">

                <form className="space-y-8" onSubmit={handleSubmit}>

                    {/* --- Basic Info --- */}
                    <section>
                        <h2 className="text-xl font-semibold text-yellow-400 mb-4 border-b border-gray-700 pb-2">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelStyle}>Full Name</label>
                                <input type="text" name="fullName" value={fullName || ''} onChange={onChange} className={inputStyle} placeholder="Your full name" />
                            </div>
                            <div>
                                <label className={labelStyle}>Email</label>
                                <input type="email" name="email" value={user?.email || ''} className={inputStyle} disabled title="Email cannot be changed" />
                            </div>
                        </div>
                    </section>

                    {/* --- Skills --- */}
                    <section>
                        <h2 className="text-xl font-semibold text-yellow-400 mb-4 border-b border-gray-700 pb-2">Skills</h2>
                        <div>
                            <label className={labelStyle}>Your Skills (comma-separated)</label>
                            <input type="text" name="skills" value={skills} onChange={onChange} className={inputStyle} placeholder="e.g., Python, C++, React" />
                        </div>
                    </section>

                    {/* --- Education --- */}
                    <section>
                        <h2 className="text-xl font-semibold text-yellow-400 mb-4 border-b border-gray-700 pb-2">Education</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className={labelStyle}>University</label>
                                <input type="text" name="university" value={education.university} onChange={onEducationChange} className={inputStyle} />
                            </div>
                            <div>
                                <label className={labelStyle}>Degree</label>
                                <input type="text" name="degree" value={education.degree} onChange={onEducationChange} className={inputStyle} />
                            </div>
                            <div>
                                <label className={labelStyle}>Graduation Year</label>
                                <input type="number" name="graduationYear" value={education.graduationYear} onChange={onEducationChange} className={inputStyle} placeholder="YYYY" />
                            </div>
                        </div>
                    </section>

                    {/* --- Experience --- */}
                    <section>
                        <h2 className="text-xl font-semibold text-yellow-400 mb-4 border-b border-gray-700 pb-2">Experience</h2>
                        {experience.map((exp, index) => (
                            <div key={index} className="mb-6 p-4 border border-gray-700 rounded-lg relative">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className={labelStyle}>Job Title</label>
                                        <input type="text" name="title" value={exp.title} onChange={(e) => handleExperienceChange(index, e)} className={inputStyle} />
                                    </div>
                                    <div>
                                        <label className={labelStyle}>Company</label>
                                        <input type="text" name="company" value={exp.company} onChange={(e) => handleExperienceChange(index, e)} className={inputStyle} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelStyle}>Description</label>
                                    <textarea name="description" value={exp.description} onChange={(e) => handleExperienceChange(index, e)} className={inputStyle} rows="3" />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeExperience(index)}
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-400"
                                    title="Remove Experience"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addExperience}
                            className="mt-2 text-yellow-400 hover:text-yellow-300 font-semibold"
                        >
                            + Add Experience
                        </button>
                    </section>

                    {/* --- Links --- */}
                    <section>
                        <h2 className="text-xl font-semibold text-yellow-400 mb-4 border-b border-gray-700 pb-2">Links</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelStyle}>Portfolio Link</label>
                                <input type="url" name="portfolioLink" value={portfolioLink} onChange={onChange} className={inputStyle} placeholder="https://..." />
                            </div>
                            <div>
                                <label className={labelStyle}>Resume Link</label>
                                <input type="url" name="resumeLink" value={resumeLink} onChange={onChange} className={inputStyle} placeholder="https://..." />
                            </div>
                        </div>
                    </section>

                    <button
                        type="submit"
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg text-lg transition-colors mt-8"
                    >
                        Save Profile
                    </button>
                </form>

            </div>
        </div>
    );
};

export default UserProfile;