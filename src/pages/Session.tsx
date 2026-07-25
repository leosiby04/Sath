import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSession } from '../context/SessionContext';
import { useSpeech } from '../hooks/useSpeech';
import { t } from '../utils/i18n';
import { detectRiskLevel, RiskLevel } from '../services/riskDetection';
import { sendCrisisMessage } from '../services/api';

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
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="bg-white shadow-sm px-4 py-3 flex items-center">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-700 p-2" aria-label="Go back">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h1 className="ml-4 text-xl font-semibold text-slate-800">Support Session</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeSession?.messages.length === 0 && (
          <div className="text-center text-slate-500 mt-10">
            {t('session.speak', language)}
          </div>
        )}
        
        {activeSession?.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center space-x-2">
               <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
               <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-slate-200 p-4">
        <div className="flex items-center space-x-2">
          {supported && (
            <button
              onClick={isListening ? stopListening : startListening}
              className={`p-3 rounded-full flex-shrink-0 transition-colors focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 focus:outline-none ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              aria-label={isListening ? t('session.listening', language) : t('session.speak', language)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
            </button>
          )}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? t('session.listening', language) : t('session.placeholder', language)}
            className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-full px-4 py-3 outline-none transition-all"
            disabled={isListening}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isListening}
            className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 focus:outline-none"
            aria-label={t('session.send', language)}
          >
            <svg className="w-6 h-6 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
};
