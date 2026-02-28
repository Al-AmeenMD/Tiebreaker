import { GoogleGenAI, Type } from "@google/genai";
import { DecisionAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeDecision(decision: string, options?: string[]): Promise<DecisionAnalysis> {
  const optionsText = options && options.length > 0 
    ? `Options to consider: ${options.join(", ")}` 
    : "Analyze this decision based on its context.";

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Decision: ${decision}\n${optionsText}`,
    config: {
      systemInstruction: `You are Tiebreaker, a world-class decision strategist. 
      Your goal is to help users make objective, well-reasoned decisions.
      Analyze the provided decision and options. 
      Provide a comprehensive analysis including:
      1. Pros and Cons for each option (or the decision itself if no options are specified).
      2. A comparison table if multiple options exist.
      3. A SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) for the overall situation or the leading option.
      4. A final recommendation and a brief summary.
      
      Return the response in strictly valid JSON format.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          prosCons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                option: { type: Type.STRING },
                pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                cons: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["option", "pros", "cons"],
            },
          },
          comparisonTable: {
            type: Type.OBJECT,
            properties: {
              headers: { type: Type.ARRAY, items: { type: Type.STRING } },
              rows: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.STRING } } },
            },
            required: ["headers", "rows"],
          },
          swotAnalysis: {
            type: Type.OBJECT,
            properties: {
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
              threats: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["strengths", "weaknesses", "opportunities", "threats"],
          },
          recommendation: { type: Type.STRING },
          summary: { type: Type.STRING },
        },
        required: ["prosCons", "swotAnalysis", "recommendation", "summary"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}") as DecisionAnalysis;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Failed to analyze decision. Please try again.");
  }
}
