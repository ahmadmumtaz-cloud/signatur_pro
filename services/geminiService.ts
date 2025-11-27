import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateSignatureInspiration = async (name: string): Promise<string> => {
  const ai = getClient();
  
  try {
    // Using gemini-2.5-flash-image for image generation as per guide
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { 
            text: `Generate a high-contrast, black ink on white background, artistic handwritten signature for the name: "${name}". The style should be professional and elegant.` 
          }
        ]
      }
    });

    // Iterate through parts to find the image
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image generated in response.");
  } catch (error) {
    console.error("Gemini generation error:", error);
    throw error;
  }
};