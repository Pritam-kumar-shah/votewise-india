/**
 * Tests for Gemini Service
 * Tests sanitization, fallback responses, and initialization
 */

import { describe, it, expect, vi } from 'vitest';
import { sanitizeInput } from '../services/geminiService';

describe('Gemini Service', () => {
  describe('Input Sanitization — sanitizeInput()', () => {
    it('should trim and limit input length', () => {
      const longInput = 'a'.repeat(2000);
      const sanitized = sanitizeInput(longInput);
      expect(sanitized.length).toBeLessThanOrEqual(1000);
    });

    it('should remove HTML tags', () => {
      const input = '<script>alert("xss")</script>Hello';
      const sanitized = sanitizeInput(input);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('Hello');
    });

    it('should handle empty input', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
    });

    it('should handle numeric input gracefully', () => {
      expect(sanitizeInput(42)).toBe('');
    });

    it('should preserve normal election queries', () => {
      const query = 'How many Lok Sabha seats are in Uttar Pradesh?';
      expect(sanitizeInput(query)).toBe(query);
    });

    it('should preserve Hindi text', () => {
      const query = 'ईवीएम क्या है?';
      expect(sanitizeInput(query)).toBe(query);
    });

    it('should strip SVG tags', () => {
      const input = '<svg onload=alert(1)>test</svg>';
      const sanitized = sanitizeInput(input);
      expect(sanitized).not.toContain('<svg');
    });

    it('should handle whitespace-only input', () => {
      expect(sanitizeInput('   ')).toBe('');
    });
  });

  describe('Module Exports', () => {
    it('should export initGemini', async () => {
      const module = await import('../services/geminiService');
      expect(typeof module.initGemini).toBe('function');
    });

    it('should export sendMessage', async () => {
      const module = await import('../services/geminiService');
      expect(typeof module.sendMessage).toBe('function');
    });

    it('should export generateQuizQuestions', async () => {
      const module = await import('../services/geminiService');
      expect(typeof module.generateQuizQuestions).toBe('function');
    });

    it('should export explainConcept', async () => {
      const module = await import('../services/geminiService');
      expect(typeof module.explainConcept).toBe('function');
    });

    it('should export startChatSession', async () => {
      const module = await import('../services/geminiService');
      expect(typeof module.startChatSession).toBe('function');
    });

    it('should export sanitizeInput', async () => {
      const module = await import('../services/geminiService');
      expect(typeof module.sanitizeInput).toBe('function');
    });
  });
});
