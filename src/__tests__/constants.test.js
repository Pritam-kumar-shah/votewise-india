/**
 * Tests for App Constants
 * Validates that all constants are properly defined and consistent
 */

import { describe, it, expect } from 'vitest';
import { APP_NAME, APP_TAGLINE, APP_VERSION, NAV_LINKS, LANGUAGES, A11Y_DEFAULTS } from '../utils/constants';

describe('App Constants', () => {
  describe('APP_NAME', () => {
    it('should be defined and non-empty', () => {
      expect(APP_NAME).toBeDefined();
      expect(APP_NAME.length).toBeGreaterThan(0);
    });

    it('should contain VoteWise', () => {
      expect(APP_NAME).toContain('VoteWise');
    });
  });

  describe('APP_TAGLINE', () => {
    it('should be defined and descriptive', () => {
      expect(APP_TAGLINE).toBeDefined();
      expect(APP_TAGLINE.length).toBeGreaterThan(10);
    });
  });

  describe('APP_VERSION', () => {
    it('should follow semver format', () => {
      expect(APP_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  describe('NAV_LINKS', () => {
    it('should have at least 4 navigation links', () => {
      expect(NAV_LINKS.length).toBeGreaterThanOrEqual(4);
    });

    it('each link should have required properties', () => {
      NAV_LINKS.forEach((link) => {
        expect(link).toHaveProperty('path');
        expect(link).toHaveProperty('label');
        expect(link).toHaveProperty('labelHi');
        expect(link).toHaveProperty('icon');
        expect(typeof link.path).toBe('string');
        expect(link.path.startsWith('/')).toBe(true);
      });
    });

    it('should include home route', () => {
      const homeLink = NAV_LINKS.find((link) => link.path === '/');
      expect(homeLink).toBeDefined();
    });

    it('should include assistant route', () => {
      const assistantLink = NAV_LINKS.find((link) => link.path === '/assistant');
      expect(assistantLink).toBeDefined();
    });

    it('should include booth finder route', () => {
      const boothLink = NAV_LINKS.find((link) => link.path === '/booth-finder');
      expect(boothLink).toBeDefined();
    });

    it('should have unique paths', () => {
      const paths = NAV_LINKS.map((link) => link.path);
      const uniquePaths = new Set(paths);
      expect(uniquePaths.size).toBe(paths.length);
    });

    it('should have Hindi labels for all links', () => {
      NAV_LINKS.forEach((link) => {
        expect(link.labelHi).toBeDefined();
        expect(link.labelHi.length).toBeGreaterThan(0);
      });
    });
  });

  describe('LANGUAGES', () => {
    it('should support English and Hindi', () => {
      expect(LANGUAGES).toHaveProperty('en');
      expect(LANGUAGES).toHaveProperty('hi');
    });

    it('each language should have label and flag', () => {
      Object.values(LANGUAGES).forEach((lang) => {
        expect(lang).toHaveProperty('label');
        expect(lang).toHaveProperty('flag');
      });
    });
  });

  describe('A11Y_DEFAULTS', () => {
    it('should have fontSize default', () => {
      expect(A11Y_DEFAULTS).toHaveProperty('fontSize');
      expect(A11Y_DEFAULTS.fontSize).toBe('normal');
    });

    it('should have contrast default', () => {
      expect(A11Y_DEFAULTS).toHaveProperty('contrast');
      expect(A11Y_DEFAULTS.contrast).toBe('normal');
    });

    it('should have reducedMotion default', () => {
      expect(A11Y_DEFAULTS).toHaveProperty('reducedMotion');
      expect(A11Y_DEFAULTS.reducedMotion).toBe(false);
    });
  });
});
