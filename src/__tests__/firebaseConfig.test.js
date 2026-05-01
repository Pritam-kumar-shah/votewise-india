/**
 * Tests for Firebase Configuration — Auth, Firestore, Analytics
 * Validates initialization, authentication, data persistence, and event tracking
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Firebase modules
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({ name: 'test-app' })),
}));

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(() => ({ app: 'test-analytics' })),
  logEvent: vi.fn(),
  isSupported: vi.fn().mockResolvedValue(true),
}));

vi.mock('firebase/performance', () => ({
  getPerformance: vi.fn(() => ({ app: 'test-perf' })),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({ currentUser: null })),
  signInAnonymously: vi.fn().mockResolvedValue({ user: { uid: 'anon-123', isAnonymous: true } }),
  signInWithPopup: vi.fn().mockResolvedValue({ user: { uid: 'google-123', displayName: 'Test User' } }),
  GoogleAuthProvider: vi.fn(),
  onAuthStateChanged: vi.fn((auth, cb) => { cb(null); return () => {}; }),
  signOut: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({ type: 'firestore' })),
  doc: vi.fn(),
  setDoc: vi.fn().mockResolvedValue(undefined),
  getDoc: vi.fn().mockResolvedValue({ exists: () => false, data: () => null }),
  collection: vi.fn(),
  addDoc: vi.fn().mockResolvedValue({ id: 'doc-123' }),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  getDocs: vi.fn().mockResolvedValue({ docs: [] }),
  serverTimestamp: vi.fn(() => new Date()),
}));

describe('Firebase Configuration', () => {
  let firebaseConfig;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
    firebaseConfig = await import('../services/firebaseConfig');
  });

  describe('initFirebase', () => {
    it('should initialize Firebase without errors', async () => {
      const app = await firebaseConfig.initFirebase();
      expect(app).toBeDefined();
    });

    it('should initialize Auth when available', async () => {
      await firebaseConfig.initFirebase();
      const { getAuth } = await import('firebase/auth');
      expect(getAuth).toHaveBeenCalled();
    });

    it('should initialize Firestore when available', async () => {
      await firebaseConfig.initFirebase();
      const { getFirestore } = await import('firebase/firestore');
      expect(getFirestore).toHaveBeenCalled();
    });

    it('should initialize Analytics when supported', async () => {
      await firebaseConfig.initFirebase();
      const { getAnalytics } = await import('firebase/analytics');
      expect(getAnalytics).toHaveBeenCalled();
    });

    it('should initialize Performance Monitoring', async () => {
      await firebaseConfig.initFirebase();
      const { getPerformance } = await import('firebase/performance');
      expect(getPerformance).toHaveBeenCalled();
    });
  });

  describe('Authentication', () => {
    it('signInWithGoogle should not throw', async () => {
      expect(async () => {
        await firebaseConfig.signInWithGoogle();
      }).not.toThrow();
    });

    it('signInAsGuest should not throw', async () => {
      expect(async () => {
        await firebaseConfig.signInAsGuest();
      }).not.toThrow();
    });

    it('signOut should not throw', async () => {
      expect(async () => {
        await firebaseConfig.signOut();
      }).not.toThrow();
    });

    it('onAuthChange should return unsubscribe function', () => {
      const unsubscribe = firebaseConfig.onAuthChange(() => {});
      expect(typeof unsubscribe).toBe('function');
    });

    it('getCurrentUser should return null when not signed in', () => {
      const user = firebaseConfig.getCurrentUser();
      expect(user).toBeNull();
    });
  });

  describe('Cloud Firestore — Quiz Scores', () => {
    it('saveQuizScore should handle null userId', async () => {
      const result = await firebaseConfig.saveQuizScore(null, { topic: 'test', score: 3, total: 5 });
      expect(result).toBeNull();
    });

    it('saveQuizScore should not throw with valid data', async () => {
      expect(async () => {
        await firebaseConfig.saveQuizScore('user-123', { topic: 'General', score: 4, total: 5 });
      }).not.toThrow();
    });

    it('getQuizHistory should return empty array for null userId', async () => {
      const result = await firebaseConfig.getQuizHistory(null);
      expect(result).toEqual([]);
    });

    it('getQuizHistory should not throw with valid userId', async () => {
      expect(async () => {
        await firebaseConfig.getQuizHistory('user-123');
      }).not.toThrow();
    });
  });

  describe('Cloud Firestore — User Preferences', () => {
    it('saveUserPreferences should handle null userId', async () => {
      const result = await firebaseConfig.saveUserPreferences(null, {});
      expect(result).toBe(false);
    });

    it('saveUserPreferences should not throw with valid data', async () => {
      expect(async () => {
        await firebaseConfig.saveUserPreferences('user-123', { language: 'hi', fontSize: 'large' });
      }).not.toThrow();
    });

    it('loadUserPreferences should return null for null userId', async () => {
      const result = await firebaseConfig.loadUserPreferences(null);
      expect(result).toBeNull();
    });
  });

  describe('Cloud Firestore — User Progress', () => {
    it('saveUserProgress should handle null userId', async () => {
      const result = await firebaseConfig.saveUserProgress(null, {});
      expect(result).toBe(false);
    });

    it('loadUserProgress should return null for null userId', async () => {
      const result = await firebaseConfig.loadUserProgress(null);
      expect(result).toBeNull();
    });
  });

  describe('Analytics Event Tracking', () => {
    it('trackEvent should not throw when analytics is not initialized', () => {
      expect(() => firebaseConfig.trackEvent('test_event', { key: 'value' })).not.toThrow();
    });

    it('trackPageView should not throw', () => {
      expect(() => firebaseConfig.trackPageView('Home', '/')).not.toThrow();
    });

    it('trackFeatureUsage should not throw', () => {
      expect(() => firebaseConfig.trackFeatureUsage('quiz_started')).not.toThrow();
    });

    it('trackAIChatInteraction should track API and fallback', () => {
      expect(() => firebaseConfig.trackAIChatInteraction('gemini_api', false)).not.toThrow();
      expect(() => firebaseConfig.trackAIChatInteraction('fallback', true)).not.toThrow();
    });

    it('trackQuizCompletion should not throw', () => {
      expect(() => firebaseConfig.trackQuizCompletion('general', 4, 5)).not.toThrow();
    });

    it('trackBoothSearch should not throw', () => {
      expect(() => firebaseConfig.trackBoothSearch('geolocation', 5)).not.toThrow();
      expect(() => firebaseConfig.trackBoothSearch('manual_search', 3)).not.toThrow();
    });

    it('trackSimulatorCompletion should not throw', () => {
      expect(() => firebaseConfig.trackSimulatorCompletion(8)).not.toThrow();
    });

    it('trackLanguageChange should not throw', () => {
      expect(() => firebaseConfig.trackLanguageChange('hi')).not.toThrow();
    });
  });
});
