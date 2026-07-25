import { describe, it, expect } from 'vitest';
import { detectRiskLevel } from './riskDetection';

describe('Risk Detection Layer', () => {
  it('detects Everyday risk for normal or slightly stressed phrasing', () => {
    expect(detectRiskLevel('I feel a bit anxious today.')).toBe('Everyday');
    expect(detectRiskLevel('I am having some cravings.')).toBe('Everyday');
    expect(detectRiskLevel('Just checking in, had a tough day at work.')).toBe('Everyday');
  });

  it('detects Elevated risk for relapse or withdrawal signs', () => {
    expect(detectRiskLevel('I started drinking again.')).toBe('Elevated');
    expect(detectRiskLevel('I am shaking and sweating.')).toBe('Elevated');
    expect(detectRiskLevel('I had a relapse yesterday.')).toBe('Elevated');
  });

  it('detects Emergency risk for overdose or suicidal ideation', () => {
    expect(detectRiskLevel('I want to kill myself.')).toBe('Emergency');
    expect(detectRiskLevel('I think I might overdose.')).toBe('Emergency');
    expect(detectRiskLevel('My friend is having a seizure.')).toBe('Emergency');
  });

  it('handles near-miss phrasing correctly to avoid over-triggering', () => {
    // These contain trigger words but in a non-emergency context or negated.
    // Our basic keyword approach might over-trigger on these, so let's document current behavior.
    // In a more advanced rule engine, we'd handle negation: "I don't want to kill myself".
    // For this MVP, if it contains the exact string 'kill myself', it triggers emergency. 
    // We'll test our specific implementation.
    
    // "kill" is not a keyword alone, "kill myself" is.
    expect(detectRiskLevel('That workout is going to kill me.')).toBe('Everyday');
    
    // "die" is not alone, "want to die" is.
    expect(detectRiskLevel('My phone battery is going to die.')).toBe('Everyday');

    // "suicide" is a keyword. This might over-trigger if talking about a movie.
    // For MVP, we accept this over-triggering as a safety precaution.
    expect(detectRiskLevel('I watched a documentary about suicide.')).toBe('Emergency');
  });
});
