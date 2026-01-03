import { internshipData } from "../prompt/internshipData.js"; 

function normalizeInternship(raw) {
  return {
    organization: raw["Organization or Company"] || "",
    program: raw["Program Details"] || "",
    location: raw["Location"] || "",        // not in your sample, so leave ""
    duration: raw["Duration"] || "",
    stipend: raw["Stipend"] || "",
    eligibility: raw["Eligibility Criteria"] || "",
    skills: raw["Skill Requirements"] ? raw["Skill Requirements"].split(",").map(s => s.trim()) : [],
    perks: "",                              // not in your dataset
    mode: "",                               // not in your dataset
    contact_details: "",                    // not in your dataset
    applyLink: raw["Application Link"] || "",
    notes: "",
    matchScore: 0
  };
}

export const normalizedInternships = internshipData.map(normalizeInternship);
