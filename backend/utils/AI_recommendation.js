import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function AI_recommendation(degree, skill, location, interests) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const inputPrompt = `
  You are an AI career assistant. Based on the following student profile,
  recommend 3–5 internships as a JSON array.
  Each object must include:
  role, company, location, skills, applyLink.

  Degree: ${degree}
  Skills: ${skill}
  Location: ${location}
  Interests: ${interests}

  Output format ONLY (no text outside JSON):

  [
    {
      "role": "",
      "company": "",
      "location": "",
      "skills": [],
      "applyLink": ""
    }
  ]
  `;

  try {
    const result = await model.generateContent(inputPrompt);
    let text = result.response.text().trim();

    // Clean markdown fences and extra text
    text = text.replace(/```json|```/gi, "").trim();

    // Try to find JSON array inside
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      text = jsonMatch[0];
    }

    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error generating AI recommendation:", error);
    return [];
  }
}

export default AI_recommendation;
