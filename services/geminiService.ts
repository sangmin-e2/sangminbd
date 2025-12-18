
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartImprovement = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Improve and polish the following note text for a digital pinboard. Keep it concise but make it sound more professional or engaging: "${text}"`,
    });
    return response.text || text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return text;
  }
};
