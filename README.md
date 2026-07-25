# Sahaya AI

Sahaya AI is a multimodal, Generative AI-powered recovery and prevention platform designed to support individuals navigating Substance Use Disorders (SUD) and their caregivers. 

## Features
- **Crisis Trigger**: Immediate access to an empathetic AI support session without login walls.
- **Safety Escalation**: Deterministic, rule-based risk detection to immediately escalate emergencies to a crisis hotline.
- **Multilingual**: Supports English, Hindi, and Malayalam natively without reloading.
- **Caregiver Mode**: Specialized AI guidance for caregivers, offering calming scripts and next-best actions.
- **Memory History**: Store and review past intervention sessions and tags locally.
- **Voice/Text Multimodal**: Built-in Web Speech API integration for accessible input and output.
- **PWA Ready**: Installable with offline caching via service workers.

## Tech Stack
- Frontend: React 19, TypeScript, Vite, Tailwind CSS, Context API.
- Backend Proxy: Node.js, Express (Rate limited, sanitized).
- AI Engine: Google Gemini API (gemini-3.1-pro).
- Testing: Vitest, React Testing Library.

## Environment Setup
Create a `.env` file in the `server` directory or project root depending on your deployment model:
```
GEMINI_API_KEY=your_google_gemini_api_key
PORT=3001
```
*Note: If `GEMINI_API_KEY` is not set or is set to "mock", the application runs in Mock Mode, returning safe, pre-defined text for live demo scenarios.*

## Running Locally
1. Install dependencies: `npm install`
2. Start the backend proxy (in a separate terminal or via a process manager):
   ```bash
   npx tsx server/index.ts
   ```
3. Start the Vite frontend dev server:
   ```bash
   npm run dev
   ```
4. Access at `http://localhost:5173`.

## Deployment Guide
This MVP is designed to be deployed across two standard cloud services for maximum security and separation of concerns:

### 1. Frontend (Static Hosting - Vercel/Netlify)
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Environment Variables**: `VITE_API_URL=https://your-backend-proxy.onrender.com/api`
- Vercel or Netlify will automatically serve the PWA correctly.

### 2. Backend (Serverless or PaaS - Render/Heroku/Google Cloud Run)
- The backend serves as a secure proxy to hide the `GEMINI_API_KEY`, enforce rate limits, and sanitize inputs.
- **Build**: Ensure TypeScript is compiled or use `ts-node`/`tsx` in your start script.
- **Start command**: `npx tsx server/index.ts`
- **Environment Variables**:
  - `GEMINI_API_KEY`: Your private Google Gemini key.
  - `PORT`: (Render/Heroku injects this automatically).

## Future Improvements (Cut-Line Items)
- **Camera Input**: Allow multimodal vision integration so caregivers can upload photos of pills or environmental factors for AI contextual analysis.
- **Location Awareness**: Auto-detect user region to dynamically replace "911" with local emergency hotlines (e.g., 112 in India).
- **Full Offline Sync**: Expand the PWA service worker with IndexedDB to queue messages when offline and sync when reconnected.

## Demo Script (90 Seconds)
1. **Load the app** and show the main "Get Help Now" button. No login required.
2. **Switch Language**: Use the top-right dropdown to switch to Hindi, observe UI text change, switch back to English.
3. **Crisis Flow**: Tap "Get Help Now". Tap the mic (or type) and say, "I am feeling very anxious today." Show the empathetic response (or mock mode label).
4. **Emergency Escalation**: Type "I think I might overdose." The rule-based engine will immediately intercept and render the red Emergency handoff screen with a 911 dial link.
5. **Caregiver Mode**: Go back to the home screen. Tap "Caregiver Mode". Type "He is shaking and very agitated." Show the structured JSON-driven response outlining a script and next actions.
