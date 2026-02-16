
import { GoogleGenAI } from "@google/genai";
import { AIActionType, AIResponse } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const processAITask = async (action: AIActionType, text: string): Promise<AIResponse> => {
  const ai = getAI();
  const modelName = 'gemini-3-flash-preview';
  
  let promptText = '';
  let useSearch = false;

  switch (action) {
    case AIActionType.RESEARCH:
      promptText = `Provide a factual research brief about the following topic based on current information. Include key dates and figures if applicable:\n\n${text}`;
      useSearch = true;
      break;
    case AIActionType.IMPROVE:
      promptText = `Refine this markdown for absolute clarity and elegance. Remove redundancy. Return ONLY the markdown content. No conversational filler:\n\n${text}`;
      break;
    case AIActionType.SUMMARIZE:
      promptText = `Summarize this text in 3 noise-free bullet points. Return ONLY the markdown:\n\n${text}`;
      break;
    case AIActionType.CONTINUE:
      promptText = `Continue this narrative naturally for two paragraphs. Maintain the current tone. Return ONLY the new content:\n\n${text}`;
      break;
    case AIActionType.EXPLAIN:
      promptText = `Explain the core essence of this text in one clear paragraph. Return ONLY the text:\n\n${text}`;
      break;
    default:
      promptText = text;
  }

  try {
    const config: any = {};
    if (useSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: promptText,
      config
    });

    return {
      content: response.text?.trim() || "No response.",
      action,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
  } catch (error) {
    console.error("AI Task Error:", error);
    throw new Error("Assistant unavailable.");
  }
};

export const generateMarkdownImage = async (prompt: string): Promise<string> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A minimal, elegant, cinematic illustration with soft lighting about: ${prompt}` }],
      },
      config: {
        imageConfig: { aspectRatio: "16:9" }
      }
    });

    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw new Error("Visual generation failed.");
  }
};
