import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function AI_recommendation_fromPDF(pdfBuffer) {
    console.log(pdfBuffer.length)
  // 1️⃣ Convert PDF buffer to base64
  const base64Pdf = pdfBuffer.toString("base64");

  // 2️⃣ Prepare the model
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // 3️⃣ Correct input format
  const request = {
  input: {
    modalities: ["document", "text"],
    content: [
      {
        type: "document",
        mimeType: "application/pdf",
        data: base64Pdf,
      },
      {
        type: "text",
        text: `You are an AI that extracts key details from a resume PDF.
Extract: name, email, location, education, skills, experience.
Return output as JSON:
{ "name": "...", "email": "...", "location": "...", "education": "...", "skills": "...", "experience": "..." }`,
      },
    ],
  },
};



  // 4️⃣ Generate content
  const response = await model.generateContent(request);

  // 5️⃣ Get the text output from Gemini
  const aiText = response.response.text();
  return JSON.parse(aiText);
}
