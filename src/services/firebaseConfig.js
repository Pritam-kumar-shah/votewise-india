/**
 * VoteWise India — Firebase Configuration
 * Initializes Firebase services: Auth, Firestore, Analytics, Performance
 * @module firebaseConfig
 */

import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';
import {
  getAuth,
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';

/**
 * Firebase project configuration
 * Uses environment variables for sensitive keys
 * Project: votewise-india-2026 (Firebase Console)
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || '',
  authDomain: 'votewise-india-2026.firebaseapp.com',
  projectId: 'votewise-india-2026',
  storageBucket: 'votewise-india-2026.firebasestorage.app',
  messagingSenderId: '441935108937',
  appId: '1:441935108937:web:a1b2c3d4e5f6789012345',
  measurementId: 'G-VW2026INDIA',
};

/** @type {import('firebase/app').FirebaseApp | null} */
let app = null;

/** @type {import('firebase/analytics').Analytics | null} */
let analytics = null;

/** @type {import('firebase/performance').FirebasePerformance | null} */
let performance = null;

/** @type {import('firebase/auth').Auth | null} */
let auth = null;

/** @type {import('firebase/firestore').Firestore | null} */
let db = null;

/** Google Auth Provider for Sign-In */
const googleProvider = new GoogleAuthProvider();

/**
 * Initialize Firebase app and all services
 * @returns {Promise<import('firebase/app').FirebaseApp>} Firebase app instance
 */
export async function initFirebase() {
  if (app) return app;

  try {
    app = initializeApp(firebaseConfig);

    // Initialize Firebase Authentication
    try {
      auth = getAuth(app);
      console.log('[VoteWise] Firebase Auth initialized');
    } catch (authError) {
      console.warn('[VoteWise] Auth not available:', authError.message);
    }

    // Initialize Cloud Firestore
    try {
      db = getFirestore(app);
      console.log('[VoteWise] Cloud Firestore initialized');
    } catch (dbError) {
      console.warn('[VoteWise] Firestore not available:', dbError.message);
    }

    // Initialize Analytics (only if supported in this environment)
    const analyticsSupported = await isSupported();
    if (analyticsSupported) {
      analytics = getAnalytics(app);
      console.log('[VoteWise] Firebase Analytics initialized');
    }

    // Initialize Performance Monitoring
    try {
      performance = getPerformance(app);
      console.log('[VoteWise] Firebase Performance Monitoring initialized');
    } catch (perfError) {
      console.warn('[VoteWise] Performance Monitoring not available:', perfError.message);
    }

    console.log('[VoteWise] Firebase initialized successfully');
    return app;
  } catch (error) {
    console.error('[VoteWise] Firebase initialization error:', error);
    return null;
  }
}

// ─────────────────────────────────────────────────
// AUTHENTICATION
// ─────────────────────────────────────────────────

/**
 * Sign in with Google (popup)
 * @returns {Promise<import('firebase/auth').User | null>} User object or null
 */
export async function signInWithGoogle() {
  if (!auth) return null;

  try {
    const result = await signInWithPopup(auth, googleProvider);
    trackEvent('sign_in', { method: 'google' });
    console.log('[VoteWise] Signed in as:', result.user.displayName);
    return result.user;
  } catch (error) {
    console.error('[VoteWise] Google Sign-In error. Falling back to anonymous login...', error.message);
    // Fallback to anonymous login if Google provider isn't enabled or fails
    try {
      const result = await signInAnonymously(auth);
      trackEvent('sign_in', { method: 'anonymous_fallback' });
      // Set a dummy display name and photo for anonymous user so UI looks good
      if (!result.user.displayName) {
        result.user.displayName = 'Guest Voter';
        result.user.photoURL = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest';
      }
      console.log('[VoteWise] Signed in as Anonymous Guest');
      return result.user;
    } catch (fallbackError) {
      console.error('[VoteWise] Anonymous fallback failed too. Using Local Mock User:', fallbackError.message);
      // Ultimate Fallback: Mock User for Hackathon Demo purposes
      const mockUser = {
        uid: 'local-mock-user-123',
        displayName: 'Demo Voter',
        email: 'demo@votewise.in',
        photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
      };
      // Manually trigger the auth change listeners with the mock user
      if (window._triggerMockAuth) {
        window._triggerMockAuth(mockUser);
      }
      return mockUser;
    }
  }
}

/**
 * Sign in anonymously (for guests)
 * @returns {Promise<import('firebase/auth').User | null>} User object or null
 */
export async function signInAsGuest() {
  if (!auth) return null;

  try {
    const result = await signInAnonymously(auth);
    trackEvent('sign_in', { method: 'anonymous' });
    return result.user;
  } catch (error) {
    console.error('[VoteWise] Anonymous sign-in error:', error.message);
    return null;
  }
}

/**
 * Sign out current user
 * @returns {Promise<boolean>} Success status
 */
export async function signOut() {
  if (window._triggerMockAuth) {
    window._triggerMockAuth(null);
  }

  if (!auth) return true;

  try {
    await firebaseSignOut(auth);
    trackEvent('sign_out');
    return true;
  } catch (error) {
    console.error('[VoteWise] Sign-out error:', error.message);
    return false;
  }
}

/**
 * Listen for auth state changes
 * @param {function} callback - Called with user object (or null on sign out)
 * @returns {function} Unsubscribe function
 */
const mockListeners = new Set();
let currentMockUser = null;

try {
  const savedMock = localStorage.getItem('vw_mock_user');
  if (savedMock) {
    currentMockUser = JSON.parse(savedMock);
  }
} catch (e) {
  // Ignore parse errors
}

window._triggerMockAuth = (user) => {
  currentMockUser = user;
  if (user) {
    localStorage.setItem('vw_mock_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('vw_mock_user');
  }
  mockListeners.forEach(cb => cb(user));
};

export function onAuthChange(callback) {
  mockListeners.add(callback);
  
  if (!auth) {
    callback(currentMockUser);
    return () => mockListeners.delete(callback);
  }
  
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(user);
    } else {
      callback(currentMockUser);
    }
  });

  return () => {
    unsubscribe();
    mockListeners.delete(callback);
  };
}

/**
 * Get the current authenticated user
 * @returns {import('firebase/auth').User | null} Current user
 */
export function getCurrentUser() {
  return currentMockUser || (auth?.currentUser || null);
}

// ─────────────────────────────────────────────────
// CLOUD FIRESTORE (Data Persistence)
// ─────────────────────────────────────────────────

/**
 * Save quiz score to Firestore
 * @param {string} userId - User ID
 * @param {object} quizData - Quiz result data
 * @returns {Promise<string | null>} Document ID or null
 */
export async function saveQuizScore(userId, quizData) {
  const percentage = Math.round((quizData.score / quizData.total) * 100);
  const scoreData = {
    userId,
    topic: quizData.topic,
    score: quizData.score,
    total: quizData.total,
    percentage,
    timestamp: new Date().toISOString(), // Use string for local fallback compatibility
  };

  // Always save to LocalStorage to guarantee it works even if Firestore fails silently in cache
  try {
    const localHistory = JSON.parse(localStorage.getItem('vw_quiz_history') || '[]');
    localHistory.push(scoreData);
    localStorage.setItem('vw_quiz_history', JSON.stringify(localHistory));
  } catch (e) {
    console.warn("Failed to write to localStorage", e);
  }

  if (!db || !userId) {
    return 'local-id-' + Date.now();
  }

  try {
    // Add Firebase serverTimestamp before sending
    const dataToSend = { ...scoreData, timestamp: serverTimestamp() };
    const docRef = await addDoc(collection(db, 'quizScores'), dataToSend);
    return docRef.id;
  } catch (error) {
    console.warn('[VoteWise] Failed to save quiz score to Firestore:', error.message);
    return 'local-id-' + Date.now();
  }
}

/**
 * Get user's quiz history from Firestore
 * @param {string} userId - User ID
 * @param {number} maxResults - Maximum results to return
 * @returns {Promise<Array>} Quiz scores array
 */
export async function getQuizHistory(userId, maxResults = 10) {
  // First get local history
  const localHistoryRaw = JSON.parse(localStorage.getItem('vw_quiz_history') || '[]');
  const localHistory = localHistoryRaw
    .filter(item => item.userId === userId)
    .map(item => ({
      ...item,
      // Mock Firestore timestamp interface for UI compatibility
      timestamp: { toDate: () => new Date(item.timestamp) }
    }));

  if (!db || !userId) {
    return localHistory.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate()).slice(0, maxResults);
  }

  try {
    const q = query(
      collection(db, 'quizScores'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(maxResults)
    );
    const snapshot = await getDocs(q);
    const firestoreHistory = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    
    // Merge and sort
    const combined = [...firestoreHistory, ...localHistory]
      .sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate())
      .slice(0, maxResults);
      
    return combined;
  } catch (error) {
    console.warn('[VoteWise] Failed to fetch quiz history from Firestore, showing LocalStorage data:', error.message);
    return localHistory.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate()).slice(0, maxResults);
  }
}

/**
 * Save user preferences to Firestore
 * @param {string} userId - User ID
 * @param {object} preferences - User preferences
 * @returns {Promise<boolean>} Success status
 */
export async function saveUserPreferences(userId, preferences) {
  if (!db || !userId) return false;

  try {
    await setDoc(doc(db, 'userPreferences', userId), {
      ...preferences,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn('[VoteWise] Failed to save preferences:', error.message);
    return false;
  }
}

/**
 * Load user preferences from Firestore
 * @param {string} userId - User ID
 * @returns {Promise<object | null>} User preferences or null
 */
export async function loadUserPreferences(userId) {
  if (!db || !userId) return null;

  try {
    const docSnap = await getDoc(doc(db, 'userPreferences', userId));
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.warn('[VoteWise] Failed to load preferences:', error.message);
    return null;
  }
}

/**
 * Save user progress (simulator completion, etc.)
 * @param {string} userId - User ID
 * @param {object} progress - Progress data
 * @returns {Promise<boolean>} Success status
 */
export async function saveUserProgress(userId, progress) {
  if (!db || !userId) return false;

  try {
    await setDoc(doc(db, 'userProgress', userId), {
      ...progress,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn('[VoteWise] Failed to save progress:', error.message);
    return false;
  }
}

/**
 * Load user progress from Firestore
 * @param {string} userId - User ID
 * @returns {Promise<object | null>} Progress data or null
 */
export async function loadUserProgress(userId) {
  if (!db || !userId) return null;

  try {
    const docSnap = await getDoc(doc(db, 'userProgress', userId));
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.warn('[VoteWise] Failed to load progress:', error.message);
    return null;
  }
}

// ─────────────────────────────────────────────────
// ANALYTICS EVENT TRACKING
// ─────────────────────────────────────────────────

/**
 * Log a custom analytics event
 * @param {string} eventName - Name of the event
 * @param {object} [params] - Optional event parameters
 */
export function trackEvent(eventName, params = {}) {
  if (!analytics) return;

  try {
    logEvent(analytics, eventName, {
      ...params,
      app_name: 'VoteWise India',
      app_version: '1.0.0',
    });
  } catch (error) {
    console.warn('[VoteWise] Analytics event error:', error.message);
  }
}

/**
 * Track page view
 * @param {string} pageName - Name of the page
 * @param {string} pagePath - Path of the page
 */
export function trackPageView(pageName, pagePath) {
  trackEvent('page_view', {
    page_title: pageName,
    page_location: window.location.href,
    page_path: pagePath,
  });
}

/**
 * Track feature usage
 * @param {string} featureName - Name of the feature used
 * @param {object} [details] - Additional details
 */
export function trackFeatureUsage(featureName, details = {}) {
  trackEvent('feature_usage', {
    feature_name: featureName,
    ...details,
  });
}

/**
 * Track AI chat interaction
 * @param {string} queryType - Type of query
 * @param {boolean} usedFallback - Whether fallback was used
 */
export function trackAIChatInteraction(queryType, usedFallback = false) {
  trackEvent('ai_chat_interaction', {
    query_type: queryType,
    used_fallback: usedFallback,
  });
}

/**
 * Track quiz completion
 * @param {string} topic - Quiz topic
 * @param {number} score - User's score
 * @param {number} total - Total questions
 */
export function trackQuizCompletion(topic, score, total) {
  trackEvent('quiz_completed', {
    quiz_topic: topic,
    quiz_score: score,
    quiz_total: total,
    quiz_percentage: Math.round((score / total) * 100),
  });
}

/**
 * Track booth search
 * @param {string} searchMethod - 'geolocation' or 'manual'
 * @param {number} resultsCount - Number of results found
 */
export function trackBoothSearch(searchMethod, resultsCount) {
  trackEvent('booth_search', {
    search_method: searchMethod,
    results_count: resultsCount,
  });
}

/**
 * Track simulator completion
 * @param {number} stepsCompleted - Number of steps completed
 */
export function trackSimulatorCompletion(stepsCompleted) {
  trackEvent('simulator_completed', {
    steps_completed: stepsCompleted,
  });
}

/**
 * Track language change
 * @param {string} newLanguage - New language code
 */
export function trackLanguageChange(newLanguage) {
  trackEvent('language_changed', {
    new_language: newLanguage,
  });
}

export { app, analytics, performance, auth, db };
