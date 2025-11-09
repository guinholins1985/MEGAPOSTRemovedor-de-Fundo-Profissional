import { GoogleGenAI, Modality } from "@google/genai";

export async function removeBackground(base64ImageData: string, mimeType: string): Promise<string> {
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    // Esta mensagem é para o desenvolvedor que está implantando o aplicativo.
    throw new Error("A chave da API (API_KEY) não foi configurada. Adicione-a às variáveis de ambiente do seu projeto.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const imagePart = {
    inlineData: {
      data: base64ImageData,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: "Remove the background from this image. The main subject should be perfectly preserved. The output must have a transparent background and be in PNG format.",
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return part.inlineData.data;
        }
      }
    }
    
    // Este erro ocorre quando a API retorna uma resposta, mas não é o que esperamos.
    throw new Error("A API não retornou uma imagem. A resposta pode estar malformada ou vazia.");

  } catch (error) {
    console.error("Erro ao chamar a API Gemini:", error);
    // Relança o erro original para ser exibido ao usuário.
    // Os erros do SDK do Gemini geralmente são informativos o suficiente.
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("Ocorreu um erro desconhecido ao se comunicar com a API.");
  }
}
