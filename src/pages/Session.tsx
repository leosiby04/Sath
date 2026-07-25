import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSession } from '../context/SessionContext';
import { useSpeech } from '../hooks/useSpeech';
import { t } from '../utils/i18n';
import { detectRiskLevel } from '../services/riskDetection';
import { sendCrisisMessage } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

export const Session: React.FC<{
  onEmergency: () => void;
  onBack: () => void;
}> = ({ onEmergency, onBack }) => {
  const { language } = useLanguage();
  const { activeSession, addMessage, addTag } = useSession();
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleAiResponse = async (text: string) => {
    try {
      const riskLevel = detectRiskLevel(text);
      if (riskLevel === 'Elevated') addTag('elevated_risk');
      
      const response = await sendCrisisMessage(
        text, 
        riskLevel, 
        activeSession?.tags || [], 
        language,
        activeSession?.mood
      );

      addMessage(response, 'ai');
      speak(response);

      if (riskLevel === 'Emergency') {
        addTag('emergency_escalation');
        onEmergency();
      }
    } catch (e) {
      console.error(e);
      addMessage("I'm having trouble connecting right now, but I am still here for you.", 'ai');
    } finally {
      setIsProcessing(false);
    }
  };

  const { isListening, startListening, stopListening, speak, supported } = useSpeech({
    language,
    onTranscript: (text) => {
      addMessage(text, 'user');
      setIsProcessing(true);
      handleAiResponse(text);
    }
  });

  const handleSend = () => {
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    addMessage(text, 'user');
    setIsProcessing(true);
    handleAiResponse(text);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isProcessing]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col h-screen relative"
    >
      <header className="bg-white/80 backdrop-blur-md shadow-sm px-4 py-4 flex items-center z-10 sticky top-0">
        <button onClick={onBack} className="text-slate-500 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-slate-100" aria-label="Go back">
          <svg aria-hidden="true" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h1 className="ml-4 text-xl font-bold text-slate-800">Support Session</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 z-10 pb-32">
        {activeSession?.messages.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center text-slate-500 mt-10 p-6 glass-panel"
          >
            <span className="text-4xl mb-4 block">👋</span>
            <p className="font-medium">{t('session.speak', language)}</p>
          </motion.div>
        )}
        
        <AnimatePresence>
          {activeSession?.messages.map((msg) => (
            <motion.div 
              key={msg.id} 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-2xl px-5 py-4 ${msg.sender === 'user' ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-none shadow-md shadow-blue-500/20' : 'glass-card text-slate-800 rounded-bl-none shadow-sm'}`}>
                <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{msg.text}</p>
              </div>
            </motion.div>
          ))}
          {isProcessing && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-start"
            >
              <div className="glass-card text-slate-500 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm flex items-center space-x-2">
                 <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce"></div>
                 <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                 <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-0 w-full glass-panel border-t border-white/50 p-4 z-20 pb-8 pt-4">
        <div className="flex items-center space-x-3 max-w-4xl mx-auto">
          {supported && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={isListening ? stopListening : startListening}
              className={`p-4 rounded-full flex-shrink-0 transition-all focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 focus:outline-none shadow-sm ${isListening ? 'bg-red-500 text-white animate-pulse shadow-red-500/30' : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-200'}`}
              aria-label={isListening ? t('session.listening', language) : t('session.speak', language)}
            >
              <svg aria-hidden="true" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
            </motion.button>
          )}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? t('session.listening', language) : t('session.placeholder', language)}
            className="flex-1 bg-white/60 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-full px-6 py-4 outline-none transition-all shadow-inner"
            disabled={isListening}
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!inputText.trim() || isListening}
            className="p-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all focus:ring-4 focus:ring-blue-300 focus:outline-none"
            aria-label={t('session.send', language)}
          >
            <svg aria-hidden="true" className="w-6 h-6 transform rotate-90 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
