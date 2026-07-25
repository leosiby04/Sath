import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}

export interface Session {
  id: string;
  date: number;
  messages: Message[];
  tags: string[];
  mood?: string;
}

interface SessionContextType {
  history: Session[];
  activeSession: Session | null;
  startSession: (mood?: string) => void;
  addMessage: (text: string, sender: 'user' | 'ai') => void;
  addTag: (tag: string) => void;
  deleteSession: (id: string) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<Session[]>(() => {
    const saved = localStorage.getItem('sahaya_history');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeSession, setActiveSession] = useState<Session | null>(null);

  useEffect(() => {
    localStorage.setItem('sahaya_history', JSON.stringify(history));
  }, [history]);

  const startSession = (mood?: string) => {
    const newSession: Session = {
      id: Date.now().toString(),
      date: Date.now(),
      messages: [],
      tags: [],
      mood
    };
    setActiveSession(newSession);
    setHistory(prev => [newSession, ...prev]);
  };

  const addMessage = (text: string, sender: 'user' | 'ai') => {
    if (!activeSession) return;
    const newMessage: Message = { id: Date.now().toString(), sender, text, timestamp: Date.now() };
    const updatedSession = { ...activeSession, messages: [...activeSession.messages, newMessage] };
    setActiveSession(updatedSession);
    setHistory(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
  };

  const addTag = (tag: string) => {
    if (!activeSession) return;
    if (activeSession.tags.includes(tag)) return;
    const updatedSession = { ...activeSession, tags: [...activeSession.tags, tag] };
    setActiveSession(updatedSession);
    setHistory(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
  };

  const deleteSession = (id: string) => {
    setHistory(prev => prev.filter(s => s.id !== id));
    if (activeSession?.id === id) {
      setActiveSession(null);
    }
  };

  return (
    <SessionContext.Provider value={{ history, activeSession, startSession, addMessage, addTag, deleteSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
