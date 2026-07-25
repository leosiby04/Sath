export type RiskLevel = 'Everyday' | 'Elevated' | 'Emergency';

const EMERGENCY_KEYWORDS = [
  'overdose', 'kill myself', 'suicide', 'end it all', 'seizure', 'chest pain', 'can\'t breathe', 'want to die'
];

const ELEVATED_KEYWORDS = [
  'relapse', 'using again', 'withdrawal', 'shaking', 'sweating', 'vomiting', 'can\'t sleep', 'drinking again'
];

export function detectRiskLevel(message: string): RiskLevel {
  const normalizedMessage = message.toLowerCase();

  // Emergency takes precedence
  for (const keyword of EMERGENCY_KEYWORDS) {
    if (normalizedMessage.includes(keyword)) {
      return 'Emergency';
    }
  }

  // Elevated next
  for (const keyword of ELEVATED_KEYWORDS) {
    if (normalizedMessage.includes(keyword)) {
      return 'Elevated';
    }
  }

  return 'Everyday';
}
