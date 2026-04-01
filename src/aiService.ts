import { GoogleGenerativeAI } from "@google/generative-ai";

// Ye code Vercel se automatic key uthayega. Safe aur Secure!
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// 🔥 Yahan humne aapke kehne par GEMINI 2.0 FLASH laga diya hai 🔥
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash",
  generationConfig: { temperature: 0.7, topP: 0.8 }
});

export const generatePlan = async (data: {
  goal: string,
  time: number,
  weakness: string,
  expertise: string,
  energy: string,
  notes: string
}) => {
  try {
    const prompt = `You are VANN BANN AI, an infinite intelligence architect. 
    User Goal: ${data.goal}. Time: ${data.time} mins. 
    Overcome: ${data.weakness}. Expertise: ${data.expertise}. 
    Create a deep-focus execution plan with timestamps. 
    Use a professional, motivating tone.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("VANN BANN Error:", error);
    throw error;
  }
};
