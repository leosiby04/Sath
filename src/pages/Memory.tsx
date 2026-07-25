import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSession } from '../context/SessionContext';
import { sendRecoveryPlanRequest } from '../services/api';
import { t } from '../utils/i18n';

export const Memory: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { language } = useLanguage();
  const { history, deleteSession } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [plan, setPlan] = useState<{ shortTerm: string[], longTerm: string[] } | null>(null);

  const handleGeneratePlan = async () => {
    setIsProcessing(true);
    const allTags = Array.from(new Set(history.flatMap(s => s.tags)));
    try {
      const result = await sendRecoveryPlanRequest(allTags, language);
      setPlan(result);
    } catch (e) {
      console.error(e);
      setPlan({ shortTerm: ['Failed to generate plan.'], longTerm: [] });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={onBack} className="text-slate-500 hover:text-slate-700 p-2" aria-label="Go back">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <h1 className="ml-4 text-xl font-semibold text-slate-800">{t('home.memory', language)}</h1>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-2xl w-full mx-auto space-y-4">
        {history.length > 0 && (
          <div className="mb-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4">{t('memory.plan.title', language)}</h2>
            {!plan ? (
              <button
                onClick={handleGeneratePlan}
                disabled={isProcessing}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
              >
                {isProcessing ? 'Generating...' : t('memory.plan.button', language)}
              </button>
            ) : (
              <div className="space-y-4 text-left">
                <div>
                  <h3 className="font-semibold text-slate-700 mb-2">Short-term Goals</h3>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    {plan.shortTerm.map((goal, i) => <li key={i}>{goal}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-700 mb-2">Long-term Goals</h3>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    {plan.longTerm.map((goal, i) => <li key={i}>{goal}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        <h3 className="text-lg font-bold text-slate-800 pt-4 border-t border-slate-200">Past Sessions</h3>

        {history.length === 0 ? (
          <p className="text-center text-slate-500 mt-10">No history available.</p>
        ) : (
          history.map(session => (
            <div key={session.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">
                  {new Date(session.date).toLocaleString(language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : 'ml-IN')}
                  {session.mood && ` • Mood: ${session.mood}`}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {session.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {tag.replace('_', ' ')}
                    </span>
                  ))}
                  {session.tags.length === 0 && <span className="text-slate-400 text-sm">No tags</span>}
                </div>
              </div>
              <button
                onClick={() => deleteSession(session.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                Delete
              </button>
            </div>
          ))
        )}
      </main>
    </div>
  );
};
