import { GoogleGenerativeAI } from "@google/generative-ai";

// Ab yahan koi asli key nahi dikhegi, ye Vercel se apne aap uthayega
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generatePlan = async (data: {
  goal: string,
  time: number,
  weakness: string,
  expertise: string,
  energy: string,
  notes: string
}) => {
  try {
    const prompt = `You are V LOS, an elite productivity coach. Goal: ${data.goal}, Time: ${data.time} mins. Create a plan.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Error:", error);
    throw error;
  }
};
