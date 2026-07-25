import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSession } from '../context/SessionContext';
import { t } from '../utils/i18n';

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
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50">
      <div className="max-w-md w-full space-y-8 flex flex-col items-center">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Sahaya AI</h1>
          <p className="text-slate-600">Recovery & Prevention Platform</p>
        </div>

        <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 text-center">{t('home.mood.title', language)}</h2>
          <div className="flex justify-between gap-2">
            {[
              { id: 'great', icon: '😊', label: t('home.mood.great', language) },
              { id: 'okay', icon: '😐', label: t('home.mood.okay', language) },
              { id: 'struggling', icon: '😔', label: t('home.mood.struggling', language) },
            ].map(mood => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`flex-1 flex flex-col items-center p-3 rounded-xl border-2 transition-all ${selectedMood === mood.id ? 'border-blue-500 bg-blue-50' : 'border-transparent bg-slate-50 hover:bg-slate-100'}`}
              >
                <span className="text-3xl mb-1">{mood.icon}</span>
                <span className="text-xs font-medium text-slate-700">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full py-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-2xl transition-all flex flex-col items-center justify-center space-y-2 focus:ring-4 focus:ring-blue-300 focus:outline-none"
          aria-label={t('home.trigger', language)}
        >
          <svg className="w-8 h-8 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          <span className="text-xl font-bold">{t('home.trigger', language)}</span>
        </button>

        <div className="flex w-full space-x-4 pt-4">
          <button
            onClick={() => onNavigate('caregiver')}
            className="flex-1 py-3 px-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium shadow-sm hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {t('home.caregiver', language)}
          </button>
          <button
            onClick={() => onNavigate('memory')}
            className="flex-1 py-3 px-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium shadow-sm hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {t('home.memory', language)}
          </button>
        </div>

        <div className="w-full mt-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">{t('home.resources.title', language)}</h3>
          <div className="space-y-2">
            <a href="#" className="flex items-center p-3 bg-white rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
              <span className="text-xl mr-3">🧘</span>
              <span className="text-slate-700 font-medium">{t('home.resources.mindfulness', language)}</span>
            </a>
            <a href="#" className="flex items-center p-3 bg-white rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
              <span className="text-xl mr-3">🧠</span>
              <span className="text-slate-700 font-medium">{t('home.resources.cbt', language)}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
