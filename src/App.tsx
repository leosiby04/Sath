import React, { useState, Suspense, lazy } from 'react';
import { LanguageSelector } from './components/LanguageSelector';
import { LanguageProvider } from './context/LanguageContext';
import { SessionProvider } from './context/SessionContext';

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Session = lazy(() => import('./pages/Session').then(m => ({ default: m.Session })));
const Emergency = lazy(() => import('./pages/Emergency').then(m => ({ default: m.Emergency })));
const Caregiver = lazy(() => import('./pages/Caregiver').then(m => ({ default: m.Caregiver })));
const Memory = lazy(() => import('./pages/Memory').then(m => ({ default: m.Memory })));

type Route = 'home' | 'session' | 'emergency' | 'caregiver' | 'memory';

const AppContent = () => {
  const [route, setRoute] = useState<Route>('home');

  return (
    <>
      {route !== 'emergency' && route !== 'session' && <LanguageSelector />}
      
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Loading...</div>}>
        {route === 'home' && (
          <Home onNavigate={setRoute} />
        )}
        
        {route === 'session' && (
          <Session 
            onEmergency={() => setRoute('emergency')} 
            onBack={() => setRoute('home')} 
          />
        )}
        
        {route === 'emergency' && (
          <Emergency onBack={() => setRoute('session')} />
        )}
        
        {route === 'caregiver' && (
          <Caregiver onBack={() => setRoute('home')} />
        )}
        
        {route === 'memory' && (
          <Memory onBack={() => setRoute('home')} />
        )}
      </Suspense>
    </>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <SessionProvider>
        <AppContent />
      </SessionProvider>
    </LanguageProvider>
  );
}
