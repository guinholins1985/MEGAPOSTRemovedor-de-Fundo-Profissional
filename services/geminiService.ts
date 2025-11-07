
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function removeBackground(base64ImageData: string, mimeType: string): Promise<string> {
  const imagePart = {
    inlineData: {
      data: base64ImageData,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: "Remove the background from this image. The main subject should be perfectly preserved. The output must have a transparent background.",
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

    if (response.candidates && response.candidates[0].content.parts[0].inlineData) {
      return response.candidates[0].content.parts[0].inlineData.data;
    } else {
      throw new Error("No image data returned from API.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to process image with Gemini API.");
  }
}
