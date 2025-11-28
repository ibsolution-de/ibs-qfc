
import { GoogleGenAI } from "@google/genai";
import { QuarterData } from "../types";

export const generateForecastAnalysis = async (quarterData: QuarterData, apiKey: string, language: string): Promise<string> => {
  if (!apiKey && !process.env.API_KEY) {
    throw new Error("Missing API Key");
  }

  // Use user-provided key or fallback to env key
  const ai = new GoogleGenAI({ apiKey: apiKey || process.env.API_KEY });

  const targetLanguage = language === 'de' ? 'German' : 'English';

  // Prepare a prompt based on the forecast data
  const prompt = `
    You are an expert Project Manager Assistant and Resource Planner.
    Analyze the following quarterly forecast data for ${quarterData.name}.
    
    Data:
    - Total Monthly Capacities: ${quarterData.totalCapacity.join(', ')} (Days)
    - Running Projects: ${quarterData.runningProjects.map(p => `${p.name} (${p.volume}d)`).join(', ')}
    - Must-Win Opportunities: ${quarterData.mustWinOpportunities.map(p => `${p.name} (${p.volume}d)`).join(', ')}
    - Alternative Opportunities: ${quarterData.alternativeOpportunities.map(p => `${p.name} (${p.volume}d)`).join(', ')}
    - Current Notes: ${quarterData.notes}

    Please provide a strategic executive summary (max 200 words) in ${targetLanguage} language that includes:
    1. Overall capacity status (Under/Over/Optimal).
    2. Key risks regarding specific projects or resource gaps.
    3. Three specific recommendations for the Project Manager.
    
    Format the output in Markdown with bold headers.
    IMPORTANT: The response MUST be in ${targetLanguage}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 } // Using max thinking budget for complex analysis
      }
    });

    return response.text;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error("Failed to generate analysis.");
  }
};
