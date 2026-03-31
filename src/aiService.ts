import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Apni corrected API Key yahan quotes mein paste kijiye
const apiKey = "AIzaSyDU853fG_B04dvkN6X3IlBfFrV1nlqiPiI"; 
const genAI = new GoogleGenerativeAI(apiKey);

// 2. Gemini 2.0 Flash use kar rahe hain hum
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash",
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
  },
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
    const prompt = `You are V LOS, an elite productivity coach. 
    Create a professional study/work plan for: ${data.goal}.
    Time: ${data.time} minutes.
    Focus on overcoming: ${data.weakness}.
    User Level: ${data.expertise}, Energy: ${data.energy}.
    Additional Info: ${data.notes}.
    Provide a step-by-step breakdown with timestamps.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Error:", error);
    throw error;
  }
};
