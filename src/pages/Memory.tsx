import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSession } from '../context/SessionContext';
import { sendRecoveryPlanRequest } from '../services/api';
import { t } from '../utils/i18n';
import { motion, AnimatePresence } from 'framer-motion';

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col min-h-screen relative"
    >
      <header className="bg-white/70 backdrop-blur-md shadow-sm px-4 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center">
          <button onClick={onBack} className="text-slate-500 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-slate-100" aria-label="Go back">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <h1 className="ml-4 text-xl font-bold text-slate-800">{t('home.memory', language)}</h1>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-2xl w-full mx-auto space-y-6 z-10">
        <AnimatePresence>
          {history.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 glass-panel p-6 border-blue-100"
            >
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">🗺️</span>
                {t('memory.plan.title', language)}
              </h2>
              {!plan ? (
                <button
                  onClick={handleGeneratePlan}
                  disabled={isProcessing}
                  className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all focus:ring-4 focus:ring-blue-300 focus:outline-none disabled:opacity-50"
                >
                  {isProcessing ? 'Generating Personalized Plan...' : t('memory.plan.button', language)}
                </button>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-6 text-left"
                >
                  <div className="bg-white/50 p-4 rounded-xl border border-slate-200/50">
                    <h3 className="font-bold text-blue-800 mb-3 flex items-center">
                      <span className="mr-2">🎯</span> Short-term Goals
                    </h3>
                    <ul className="list-none space-y-2 text-slate-700">
                      {plan.shortTerm.map((goal, i) => (
                        <li key={i} className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          <span>{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white/50 p-4 rounded-xl border border-slate-200/50">
                    <h3 className="font-bold text-indigo-800 mb-3 flex items-center">
                      <span className="mr-2">🌱</span> Long-term Goals
                    </h3>
                    <ul className="list-none space-y-2 text-slate-700">
                      {plan.longTerm.map((goal, i) => (
                        <li key={i} className="flex items-start">
                          <svg className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                          <span>{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <h3 className="text-lg font-bold text-slate-800 pt-2 flex items-center">
           <span className="mr-2">🕒</span> Past Sessions
        </h3>

        {history.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-slate-500 mt-10 glass-panel p-8"
          >
            <span className="text-4xl mb-4 block">📭</span>
            <p>No history available.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {history.map(session => (
                <motion.div 
                  key={session.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, height: 0, marginBottom: 0 }}
                  className="glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">
                      {new Date(session.date).toLocaleString(language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : 'ml-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      {session.mood && <span className="ml-2 text-slate-500 font-normal">Mood: {session.mood}</span>}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {session.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold rounded-full shadow-sm">
                          {tag.replace('_', ' ').toUpperCase()}
                        </span>
                      ))}
                      {session.tags.length === 0 && <span className="text-slate-400 text-sm italic">No tags</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteSession(session.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    Delete
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </motion.div>
  );
};
