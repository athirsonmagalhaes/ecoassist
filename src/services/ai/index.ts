import { ai } from "./gemini";
import { PROMPT_PERSONA_SISTEMA } from "./prompts";
import { MODEL_NAME } from "./gemini";

export const geminiClient = {
  // Envia uma pergunta em texto sobre manejo, consórcios ou planejamento agroflorestal
  async askConsultant(prompt: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction: PROMPT_PERSONA_SISTEMA,
          temperature: 0.6,
        },
      });
      return (
        response.text || "Desculpe, não processar uma resposta neste momento."
      );
    } catch (error) {
      console.error("Erro no serviço de Inteligência Artificial", error);
      throw error;
    }
  },

  /**
   * Analisa imagens de canteiros, folhas com sintomas de pragas ou deficiências nutricionais
   * @param imageBase64 String da imagem em formato Base64
   * @param userDescription Descrição complementar enviada pelo usuário (ex: "Folhas do Guandu amarelando")
   */

  async analyzeFieldImage(
    imageBase64: string,
    userDescription: string = "Analise esta imagem sob a ótica agroecológica.",
  ): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: [
          userDescription,
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageBase64,
            },
          },
        ],
        config: {
          systemInstruction: PROMPT_PERSONA_SISTEMA,
          temperature: 0.3,
        },
      });
      return (
        response.text ||
        "Desculpe, não foi possível analisar a imagem neste momento."
      );
    } catch (error) {
      console.error("Erro ao analisar a imagem", error);
      throw error;
    }
  },
};
