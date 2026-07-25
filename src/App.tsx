import React, { useState } from 'react';
import { Home } from './pages/Home';
import { Session } from './pages/Session';
import { Emergency } from './pages/Emergency';
import { Caregiver } from './pages/Caregiver';
import { Memory } from './pages/Memory';
import { LanguageSelector } from './components/LanguageSelector';
import { LanguageProvider } from './context/LanguageContext';
import { SessionProvider } from './context/SessionContext';

type Route = 'home' | 'session' | 'emergency' | 'caregiver' | 'memory';

const AppContent = () => {
  const [route, setRoute] = useState<Route>('home');

  return (
    <>
      {route !== 'emergency' && route !== 'session' && <LanguageSelector />}
      
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
