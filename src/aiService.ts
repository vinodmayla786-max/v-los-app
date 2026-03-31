import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure your API key is correctly pulled from the environment
// DHYAN DEIN: Yahan apni asli Gemini API key daalein jo "AIzaSy..." se shuru hoti hai
const genAI = new GoogleGenerativeAI("const apiKey = import.meta.env.VITE_GEMINI_API_KEY;");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generatePlan = async (
  goal: string, 
  time: number, 
  weakness: string, 
  expertise: string, 
  energy: string, 
  notes: string
) => {
  const prompt = `You are V LOS, an elite productivity coach.
  Goal: "${goal}"
  Time Available: ${time} minutes
  Weakness/Distraction: "${weakness}"
  User's Expertise Level: "${expertise}"
  User's Current Energy: "${energy}"
  Special Notes/Context: "${notes}"

  Based on this, create a strict, actionable study/work plan.
  CRITICAL: Adjust the difficulty based on 'Expertise'. If energy is 'Low', give focused but less exhausting tasks. Prioritize anything mentioned in 'Special Notes'.
  
  Respond ONLY with a valid JSON in this exact format, no markdown formatting or extra text:
  {
    "motivation": "A short, hard-hitting elite motivational quote based on their goal and weakness.",
    "tasks": [
      {
        "title": "Specific Task Name",
        "duration": <number in minutes>,
        "priority": "High" or "Medium" or "Low",
        "completed": false
      }
    ]
  }`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let rawText = response.text();
    
    // Clean up the response just in case AI adds markdown
    let cleanText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const plan = JSON.parse(cleanText);
    
    // Add unique IDs to tasks
    plan.tasks = plan.tasks.map((task: any) => ({
      ...task,
      id: crypto.randomUUID()
    }));
    
    return plan;
  } catch (error) {
    console.error("AI Error:", error);
    alert('AI generating error. Please check your API key or console.');
    return null;
  }
};
