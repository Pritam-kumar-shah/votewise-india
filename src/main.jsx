/**
 * VoteWise India — Entry Point
 * AI-Powered Election Education Platform
 * Initializes Firebase services and renders the app
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initFirebase } from './services/firebaseConfig';
import './index.css';

// Initialize Firebase Analytics & Performance Monitoring
initFirebase().catch((error) => {
  console.warn('[VoteWise] Firebase init skipped:', error?.message);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
