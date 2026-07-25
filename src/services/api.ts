import { RiskLevel } from './riskDetection';
import { SupportedLanguage } from '../utils/i18n';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export async function sendCrisisMessage(
  message: string,
  riskLevel: RiskLevel,
  tags: string[],
  language: SupportedLanguage,
  mood?: string
): Promise<string> {
  const response = await fetch(`${API_URL}/gemini/crisis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, riskLevel, tags, language, mood })
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data.response;
}

export async function sendCaregiverSummary(
  summary: string,
  language: SupportedLanguage,
  imageBase64?: string
): Promise<{ guidance: string, script: string, nextAction: string }> {
  const response = await fetch(`${API_URL}/gemini/caregiver`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ summary, language, imageBase64 })
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}

export async function sendRecoveryPlanRequest(
  tags: string[],
  language: SupportedLanguage
): Promise<{ shortTerm: string[], longTerm: string[] }> {
  const response = await fetch(`${API_URL}/gemini/plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tags, language })
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}
