/**
 * VoteWise India — Global App Context
 * Manages language, accessibility, and shared state
 * @module AppContext
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { A11Y_DEFAULTS } from '../utils/constants';

const AppContext = createContext(null);

/**
 * AppProvider wraps the entire app and provides global state
 */
export function AppProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('votewise-lang') || 'en';
  });

  const [accessibility, setAccessibility] = useState(() => {
    const stored = localStorage.getItem('votewise-a11y');
    return stored ? JSON.parse(stored) : A11Y_DEFAULTS;
  });

  const [isAIReady, setIsAIReady] = useState(false);

  // Persist language preference
  useEffect(() => {
    localStorage.setItem('votewise-lang', language);
    document.documentElement.lang = language === 'hi' ? 'hi' : 'en';
  }, [language]);

  // Persist and apply accessibility settings
  useEffect(() => {
    localStorage.setItem('votewise-a11y', JSON.stringify(accessibility));
    document.documentElement.setAttribute('data-font-size', accessibility.fontSize);
    document.documentElement.setAttribute('data-contrast', accessibility.contrast);
    
    if (accessibility.reducedMotion) {
      document.documentElement.style.setProperty('--transition-base', '0ms');
      document.documentElement.style.setProperty('--transition-slow', '0ms');
      document.documentElement.style.setProperty('--transition-spring', '0ms');
    } else {
      document.documentElement.style.removeProperty('--transition-base');
      document.documentElement.style.removeProperty('--transition-slow');
      document.documentElement.style.removeProperty('--transition-spring');
    }
  }, [accessibility]);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  }, []);

  const updateAccessibility = useCallback((key, value) => {
    setAccessibility(prev => ({ ...prev, [key]: value }));
  }, []);

  const t = useCallback((en, hi) => {
    return language === 'hi' && hi ? hi : en;
  }, [language]);

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    accessibility,
    updateAccessibility,
    isAIReady,
    setIsAIReady,
    t, // translation helper
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

/**
 * Hook to access app context
 * @returns {object} App context value
 */
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
