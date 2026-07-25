import { useState, useEffect, useRef } from 'react';
import { SupportedLanguage } from '../utils/i18n';

interface UseSpeechProps {
  language: SupportedLanguage;
  onTranscript: (text: string) => void;
}

export function useSpeech({ language, onTranscript }: UseSpeechProps) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if SpeechRecognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [onTranscript]);

  useEffect(() => {
    if (recognitionRef.current) {
      // Map supported languages to BCP-47 codes for SpeechRecognition
      const langMap: Record<SupportedLanguage, string> = {
        en: 'en-US',
        hi: 'hi-IN',
        ml: 'ml-IN'
      };
      recognitionRef.current.lang = langMap[language];
    }
  }, [language]);

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        setIsListening(true);
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
        setIsListening(false);
      }
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Basic implementation, in a real app would select specific voices
      const utterance = new SpeechSynthesisUtterance(text);
      const langMap: Record<SupportedLanguage, string> = {
        en: 'en-US',
        hi: 'hi-IN',
        ml: 'ml-IN'
      };
      utterance.lang = langMap[language];
      window.speechSynthesis.speak(utterance);
    }
  };

  return { isListening, startListening, stopListening, speak, supported: !!recognitionRef.current };
}
