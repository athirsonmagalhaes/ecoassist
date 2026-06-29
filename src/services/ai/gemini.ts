import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    "⚠️ ATENÇÃO: EXPO_PUBLIC_GEMINI_API_KEY não foi encontrada nas variáveis de ambiente (.env)",
  );
}

export const ai = new GoogleGenAI({ apiKey });
export const MODEL_NAME = "gemini-3.5-flash";
