import { GoogleGenAI } from "@google/genai";

export const geminiClient = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY || "",
});