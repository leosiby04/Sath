import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSession } from '../context/SessionContext';
import { t } from '../utils/i18n';
import { motion } from 'framer-motion';

export const Home: React.FC<{
  onNavigate: (route: 'session' | 'caregiver' | 'memory') => void;
}> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const { startSession } = useSession();
  const [selectedMood, setSelectedMood] = React.useState<string | undefined>(undefined);

  const handleStart = () => {
    startSession(selectedMood);
    onNavigate('session');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center min-h-screen p-6 relative"
    >
      <div className="absolute top-0 right-0 p-32 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 left-0 p-32 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="max-w-md w-full space-y-8 flex flex-col items-center z-10">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-5xl font-extrabold text-blue-900 mb-2 tracking-tight">Sahaya AI</h1>
          <p className="text-blue-600/80 font-medium tracking-wide">Recovery & Prevention Platform</p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full glass-panel p-8 premium-shadow"
        >
          <h2 className="text-lg font-semibold text-slate-800 mb-6 text-center">{t('home.mood.title', language)}</h2>
          <div className="flex justify-between gap-3">
            {[
              { id: 'great', icon: '😊', label: t('home.mood.great', language) },
              { id: 'okay', icon: '😐', label: t('home.mood.okay', language) },
              { id: 'struggling', icon: '😔', label: t('home.mood.struggling', language) },
            ].map(mood => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`flex-1 flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 ${
                  selectedMood === mood.id 
                    ? 'border-blue-500 bg-blue-50/80 shadow-md scale-105' 
                    : 'border-white/40 bg-white/40 hover:bg-white/60 hover:border-white/60 hover:scale-105'
                }`}
              >
                <span className="text-4xl mb-2 drop-shadow-sm">{mood.icon}</span>
                <span className="text-xs font-semibold text-slate-700">{mood.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStart}
          className="w-full py-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-blue-500/30 transition-all flex flex-col items-center justify-center space-y-3 focus:ring-4 focus:ring-blue-300 focus:outline-none"
          aria-label={t('home.trigger', language)}
        >
          <svg className="w-10 h-10 opacity-90 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          <span className="text-2xl font-bold tracking-wide">{t('home.trigger', language)}</span>
        </motion.button>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex w-full space-x-4 pt-4"
        >
          <button
            onClick={() => onNavigate('caregiver')}
            className="flex-1 py-4 px-4 glass-card text-slate-700 font-semibold hover:bg-white/90 hover:shadow-md transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none flex items-center justify-center space-x-2"
          >
            <span className="text-lg">🤝</span>
            <span>{t('home.caregiver', language)}</span>
          </button>
          <button
            onClick={() => onNavigate('memory')}
            className="flex-1 py-4 px-4 glass-card text-slate-700 font-semibold hover:bg-white/90 hover:shadow-md transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none flex items-center justify-center space-x-2"
          >
            <span className="text-lg">📓</span>
            <span>{t('home.memory', language)}</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};
