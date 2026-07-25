import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

// Mock Mode
const MOCK_MODE = !API_KEY || API_KEY === 'mock';

let genAI: GoogleGenerativeAI | null = null;
if (!MOCK_MODE) {
  genAI = new GoogleGenerativeAI(API_KEY!);
}

export async function generateCrisisResponse(
  message: string,
  riskLevel: string,
  tags: string[],
  language: string,
  mood?: string
): Promise<string> {
  if (MOCK_MODE) {
    return `[Demo Mode] This is a mocked supportive response in ${language}. It seems like you're dealing with ${riskLevel} risk. I hear what you are saying.`;
  }

  const model = genAI!.getGenerativeModel({ model: "gemini-3.1-pro" });

  const systemPrompt = `You are an empathetic, professional support AI for individuals navigating Substance Use Disorders (SUD).
Your language is ${language}.
Current Risk Level: ${riskLevel}.
Past Intervention Tags: ${tags.join(', ')}.
${mood ? `User's reported mood today: ${mood}.` : ''}

Rules:
1. Do not diagnose or replace a medical professional.
2. Produce a grounding, non-interrogative opening. 
3. DO NOT ask multiple questions at once to a distressed user.
4. If risk level is elevated, suggest they contact a caregiver.
5. If risk level is emergency, you MUST explicitly state you are connecting them to a human and stop counseling.
`;

  const prompt = `${systemPrompt}\n\nUser Message: ${message}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function generateCaregiverGuidance(
  summary: string,
  language: string,
  imageBase64?: string
): Promise<{ guidance: string, script: string, nextAction: string }> {
  if (MOCK_MODE) {
    return {
      guidance: `[Demo Mode] Stay calm and listen actively. This is guidance in ${language}. ${imageBase64 ? '(Image Received)' : ''}`,
      script: `[Demo Mode] "I am here for you and I want to help."`,
      nextAction: `[Demo Mode] Monitor the situation and contact professional help if it worsens.`
    };
  }

  const model = genAI!.getGenerativeModel({ model: "gemini-3.1-pro" });

  const systemPrompt = `You are a supportive AI advising a caregiver of someone navigating Substance Use Disorders.
Your language is ${language}.
You must take the structured summary and return a JSON object with:
- "guidance": Calming conversation suggestions (take into account any image provided, e.g. pill bottles or environments).
- "script": A short emergency communication script.
- "nextAction": A next-best-action recommendation (explicitly state when to seek professional help).

Summary: ${summary}`;

  let result;
  if (imageBase64) {
    // Extract base64 data and mime type if it's a data URL
    const mimeTypeMatch = imageBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    };
    result = await model.generateContent([systemPrompt, imagePart]);
  } else {
    result = await model.generateContent(systemPrompt);
  }

  const text = result.response.text();
  
  try {
    // Attempt to extract JSON from the text response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse JSON from response');
  } catch (e) {
    console.error("JSON Parsing failed for Caregiver Guidance:", e);
    return {
      guidance: text,
      script: "Please see guidance above.",
      nextAction: "Consider professional help if necessary."
    };
  }
}

export async function generateRecoveryPlan(
  tags: string[],
  language: string
): Promise<{ shortTerm: string[], longTerm: string[] }> {
  if (MOCK_MODE) {
    return {
      shortTerm: ["[Demo Mode] Practice mindfulness for 5 minutes daily", "[Demo Mode] Call support group"],
      longTerm: ["[Demo Mode] Build a stable daily routine", "[Demo Mode] Identify and avoid triggers"]
    };
  }

  const model = genAI!.getGenerativeModel({ model: "gemini-3.1-pro" });

  const systemPrompt = `You are an AI assisting in Substance Use Disorder recovery.
Your language is ${language}.
The user has the following intervention history tags: ${tags.join(', ') || 'None'}.

Generate a personalized recovery plan based on their history.
You must return ONLY a JSON object with this exact structure, containing arrays of strings for actionable goals:
{
  "shortTerm": ["Goal 1", "Goal 2"],
  "longTerm": ["Goal 1", "Goal 2"]
}`;

  const result = await model.generateContent(systemPrompt);
  const text = result.response.text();

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse JSON');
  } catch (e) {
    console.error("JSON Parsing failed for Plan:", e);
    return {
      shortTerm: ["Unable to generate short-term goals. Please try again."],
      longTerm: ["Unable to generate long-term goals."]
    };
  }
}
