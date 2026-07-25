import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { sendCaregiverSummary } from '../services/api';
import { t } from '../utils/i18n';

export const Caregiver: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { language } = useLanguage();
  const [summary, setSummary] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ guidance: string, script: string, nextAction: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) return;
    
    setIsProcessing(true);
    try {
      const response = await sendCaregiverSummary(summary, language);
      setResult(response);
    } catch (error) {
      console.error(error);
      setResult({
        guidance: "Unable to connect. Please try again.",
        script: "N/A",
        nextAction: "N/A"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm px-4 py-3 flex items-center">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-700 p-2" aria-label="Go back">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h1 className="ml-4 text-xl font-semibold text-slate-800">{t('caregiver.title', language)}</h1>
      </header>

      <main className="flex-1 p-6 max-w-2xl w-full mx-auto space-y-6">
        <p className="text-slate-600">{t('caregiver.desc', language)}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder={t('caregiver.placeholder', language)}
            className="w-full h-32 p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm resize-none"
            required
          />
          <button
            type="submit"
            disabled={isProcessing || !summary.trim()}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm disabled:opacity-50 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none"
          >
            {isProcessing ? 'Processing...' : t('caregiver.submit', language)}
          </button>
        </form>

        {result && (
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-2">Suggested Guidance</h3>
              <p className="text-slate-600 whitespace-pre-wrap">{result.guidance}</p>
            </div>
            
            <div className="bg-blue-50 p-5 rounded-xl shadow-sm border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2">Communication Script</h3>
              <p className="text-blue-800 italic">"{result.script}"</p>
            </div>

            <div className="bg-amber-50 p-5 rounded-xl shadow-sm border border-amber-100">
              <h3 className="font-semibold text-amber-900 mb-2">Next Best Action</h3>
              <p className="text-amber-800">{result.nextAction}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
