/**
 * Tests for AppContext — Global State Management
 * Validates context provider behavior, language toggle, and accessibility settings
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AppProvider, useAppContext } from '../context/AppContext';

// Mock Firebase analytics
vi.mock('../services/firebaseConfig', () => ({
  trackLanguageChange: vi.fn(),
}));

/** Wrapper component for testing hooks */
const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;

describe('AppContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Language Management', () => {
    it('should default to English', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });
      expect(result.current.language).toBe('en');
    });

    it('should toggle language between en and hi', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.toggleLanguage();
      });

      expect(result.current.language).toBe('hi');

      act(() => {
        result.current.toggleLanguage();
      });

      expect(result.current.language).toBe('en');
    });

    it('should persist language in localStorage', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.toggleLanguage();
      });

      expect(localStorage.getItem('votewise-lang')).toBe('hi');
    });

    it('should restore language from localStorage', () => {
      localStorage.setItem('votewise-lang', 'hi');
      const { result } = renderHook(() => useAppContext(), { wrapper });
      expect(result.current.language).toBe('hi');
    });
  });

  describe('Translation Helper (t)', () => {
    it('should return English text by default', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });
      const text = result.current.t('Hello', 'नमस्ते');
      expect(text).toBe('Hello');
    });

    it('should return Hindi text when language is hi', () => {
      localStorage.setItem('votewise-lang', 'hi');
      const { result } = renderHook(() => useAppContext(), { wrapper });
      const text = result.current.t('Hello', 'नमस्ते');
      expect(text).toBe('नमस्ते');
    });

    it('should fallback to English when Hindi text is not provided', () => {
      localStorage.setItem('votewise-lang', 'hi');
      const { result } = renderHook(() => useAppContext(), { wrapper });
      const text = result.current.t('Hello');
      expect(text).toBe('Hello');
    });
  });

  describe('Accessibility Settings', () => {
    it('should have default accessibility values', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      expect(result.current.accessibility.fontSize).toBe('normal');
      expect(result.current.accessibility.contrast).toBe('normal');
      expect(result.current.accessibility.reducedMotion).toBe(false);
    });

    it('should update individual accessibility settings', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.updateAccessibility('fontSize', 'large');
      });

      expect(result.current.accessibility.fontSize).toBe('large');
      expect(result.current.accessibility.contrast).toBe('normal');
    });

    it('should persist accessibility settings in localStorage', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.updateAccessibility('contrast', 'high');
      });

      const stored = JSON.parse(localStorage.getItem('votewise-a11y'));
      expect(stored.contrast).toBe('high');
    });

    it('should restore accessibility settings from localStorage', () => {
      const a11ySettings = { fontSize: 'x-large', contrast: 'high', reducedMotion: true };
      localStorage.setItem('votewise-a11y', JSON.stringify(a11ySettings));

      const { result } = renderHook(() => useAppContext(), { wrapper });
      expect(result.current.accessibility.fontSize).toBe('x-large');
      expect(result.current.accessibility.contrast).toBe('high');
      expect(result.current.accessibility.reducedMotion).toBe(true);
    });
  });

  describe('AI Ready State', () => {
    it('should default to not ready', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });
      expect(result.current.isAIReady).toBe(false);
    });

    it('should update AI ready state', () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      act(() => {
        result.current.setIsAIReady(true);
      });

      expect(result.current.isAIReady).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should throw error when used outside AppProvider', () => {
      // Suppress expected console error
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAppContext());
      }).toThrow('useAppContext must be used within an AppProvider');

      consoleSpy.mockRestore();
    });
  });
});
