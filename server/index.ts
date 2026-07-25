import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { generateCrisisResponse, generateCaregiverGuidance, generateRecoveryPlan } from './services/geminiClient.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Basic rate limiting middleware
const rateLimiter = () => {
  const windowMs = 60 * 1000;
  const max = 20;
  const hits = new Map<string, { count: number, resetTime: number }>();

  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = req.ip || 'unknown';
    const now = Date.now();
    const record = hits.get(ip);

    if (!record || record.resetTime < now) {
      hits.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= max) {
      res.status(429).json({ error: 'Too many requests, please try again later.' });
      return;
    }

    record.count++;
    next();
  };
};

app.use('/api/gemini', rateLimiter());

// Sanitization middleware
const sanitizeInput = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.body && typeof req.body === 'object') {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();
      }
    }
  }
  next();
};

app.post('/api/gemini/crisis', sanitizeInput, async (req, res) => {
  try {
    const { message, riskLevel, tags, language, mood } = req.body;
    const response = await generateCrisisResponse(message, riskLevel, tags, language, mood);
    res.json({ response });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to generate response. Please try again.' });
  }
});

app.post('/api/gemini/caregiver', sanitizeInput, async (req, res) => {
  try {
    const { summary, language, imageBase64 } = req.body;
    const response = await generateCaregiverGuidance(summary, language, imageBase64);
    res.json(response);
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to generate caregiver guidance.' });
  }
});

app.post('/api/gemini/plan', sanitizeInput, async (req, res) => {
  try {
    const { tags, language } = req.body;
    const response = await generateRecoveryPlan(tags, language);
    res.json(response);
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to generate plan.' });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
