import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { sendCaregiverSummary } from '../services/api';
import { t } from '../utils/i18n';
import { motion, AnimatePresence } from 'framer-motion';

export const Caregiver: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { language } = useLanguage();
  const [summary, setSummary] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ guidance: string, script: string, nextAction: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim() && !image) return;
    
    setIsProcessing(true);
    try {
      const response = await sendCaregiverSummary(summary, language, image || undefined);
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
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col min-h-screen relative"
    >
      <header className="bg-white/70 backdrop-blur-md shadow-sm px-4 py-4 flex items-center sticky top-0 z-20">
        <button onClick={onBack} className="text-slate-500 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-slate-100" aria-label="Go back">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h1 className="ml-4 text-xl font-bold text-slate-800">{t('caregiver.title', language)}</h1>
      </header>

      <main className="flex-1 p-6 max-w-2xl w-full mx-auto space-y-6 z-10">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-600 font-medium"
        >
          {t('caregiver.desc', language)}
        </motion.p>

        <motion.form 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit} 
          className="space-y-4"
        >
          <div className="relative glass-card p-1">
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder={t('caregiver.placeholder', language)}
              className="w-full h-32 p-4 bg-transparent focus:ring-0 border-0 outline-none resize-none"
              required={!image}
            />
            
            <AnimatePresence>
              {image && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="px-4 pb-4 relative inline-block"
                >
                  <img src={image} alt="Uploaded" className="h-24 w-auto rounded-lg object-cover shadow-sm border border-slate-200" />
                  <button 
                    type="button"
                    onClick={() => setImage(null)}
                    className="absolute top-1 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="border-t border-slate-200/50 p-3 flex justify-between items-center bg-white/50 rounded-b-xl">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Add Photo (Pills/Environment)
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isProcessing || (!summary.trim() && !image)}
            className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all focus:ring-4 focus:ring-blue-300 focus:outline-none flex justify-center items-center"
          >
            {isProcessing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing using Gemini Vision...
              </span>
            ) : t('caregiver.submit', language)}
          </motion.button>
        </motion.form>

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 pt-6"
            >
              <div className="glass-panel p-6">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center">
                  <span className="bg-blue-100 text-blue-700 p-1.5 rounded-lg mr-2">🧭</span>
                  Suggested Guidance
                </h3>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{result.guidance}</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-sm border border-blue-100/50">
                <h3 className="font-bold text-blue-900 mb-3 flex items-center">
                  <span className="bg-blue-200 text-blue-800 p-1.5 rounded-lg mr-2">💬</span>
                  Communication Script
                </h3>
                <p className="text-blue-800 italic text-lg leading-relaxed">"{result.script}"</p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl shadow-sm border border-amber-100/50">
                <h3 className="font-bold text-amber-900 mb-3 flex items-center">
                  <span className="bg-amber-200 text-amber-800 p-1.5 rounded-lg mr-2">⚡</span>
                  Next Best Action
                </h3>
                <p className="text-amber-900 font-medium">{result.nextAction}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
};
