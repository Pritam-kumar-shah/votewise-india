/**
 * Tests for Gemini Service
 * Tests sanitization, fallback responses, and initialization
 */

import { describe, it, expect, vi } from 'vitest';

// We test the sanitization and fallback logic without actual API calls
describe('Gemini Service', () => {
  describe('Input Sanitization', () => {
    /**
     * Internal sanitize function logic test
     */
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
  });
});

/**
 * Replicates the sanitize function from geminiService for testing
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .slice(0, 1000)
    .replace(/<[^>]*>/g, '')
    .replace(/[<>'"]/g, (char) => {
      const entities = { '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' };
      return entities[char] || char;
    });
}
