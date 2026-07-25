import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../utils/i18n';
import { motion } from 'framer-motion';

export const Emergency: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { language } = useLanguage();
  const [emergencyNumber, setEmergencyNumber] = useState('911');
  const [locationName, setLocationName] = useState('Local');

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          // Simple mock regional bounding boxes for hackathon demo
          if (lat > 6 && lat < 36 && lon > 68 && lon < 98) {
            // India rough bounding box
            setEmergencyNumber('112');
            setLocationName('India');
          } else if (lat > 49 && lat < 61 && lon > -11 && lon < 2) {
            // UK rough bounding box
            setEmergencyNumber('999');
            setLocationName('United Kingdom');
          } else if (lat > -44 && lat < -10 && lon > 112 && lon < 154) {
            // Australia
            setEmergencyNumber('000');
            setLocationName('Australia');
          } else if (lat > 35 && lat < 72 && lon > -25 && lon < 40) {
             // Europe rough
             setEmergencyNumber('112');
             setLocationName('Europe');
          }
          // Default remains 911 (US/Canada)
        },
        (error) => {
          console.warn('Geolocation error:', error);
          // Fallback to default
        },
        { timeout: 5000 }
      );
    }
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 bg-red-600 text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500 via-red-600 to-red-800 opacity-80"></div>
      
      {/* Pulsing background effect */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute w-96 h-96 bg-red-400 rounded-full mix-blend-screen filter blur-3xl"
      />

      <div className="max-w-md w-full space-y-8 text-center bg-white p-8 rounded-3xl shadow-2xl z-10 relative">
        <motion.div 
          animate={{ y: [0, -10, 0] }} 
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-inner border-4 border-red-50"
        >
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </motion.div>
        
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">{t('emergency.title', language)}</h1>
          <p className="text-slate-600 text-lg mb-2">{t('emergency.desc', language)}</p>
          <p className="text-sm font-semibold text-red-500 bg-red-50 inline-block px-3 py-1 rounded-full mb-6">
            📍 Detected Region: {locationName}
          </p>
        </div>

        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href={`tel:${emergencyNumber}`}
          className="flex items-center justify-center w-full py-5 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-2xl font-black text-3xl shadow-xl shadow-red-500/30 transition-all focus:ring-4 focus:ring-red-300 focus:outline-none"
        >
          <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
          CALL {emergencyNumber}
        </motion.a>

        <button
          onClick={onBack}
          className="w-full py-4 px-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl font-bold transition-colors focus:ring-2 focus:ring-slate-300 focus:outline-none mt-4 border border-slate-200"
        >
          {t('emergency.back', language)}
        </button>
      </div>
    </motion.div>
  );
};
