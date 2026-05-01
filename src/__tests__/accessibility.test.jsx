/**
 * Accessibility Tests for VoteWise India
 * Validates WCAG 2.1 AA compliance patterns
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '../context/AppContext';

// Mock Firebase
vi.mock('../services/firebaseConfig', () => ({
  trackPageView: vi.fn(),
  trackFeatureUsage: vi.fn(),
  trackAIChatInteraction: vi.fn(),
  trackQuizCompletion: vi.fn(),
  trackBoothSearch: vi.fn(),
  trackSimulatorCompletion: vi.fn(),
  trackLanguageChange: vi.fn(),
  trackEvent: vi.fn(),
  initFirebase: vi.fn().mockResolvedValue(null),
}));

// Mock Gemini service
vi.mock('../services/geminiService', () => ({
  initGemini: vi.fn(() => false),
  startChatSession: vi.fn(() => null),
  sendMessage: vi.fn().mockRejectedValue(new Error('Not configured')),
  generateQuizQuestions: vi.fn().mockResolvedValue(null),
  explainConcept: vi.fn().mockResolvedValue(null),
}));

function renderWithProviders(ui) {
  return render(
    <BrowserRouter>
      <AppProvider>
        {ui}
      </AppProvider>
    </BrowserRouter>
  );
}

describe('Accessibility', () => {
  describe('Home Page Accessibility', () => {
    let Home;

    beforeEach(async () => {
      const module = await import('../pages/Home');
      Home = module.default;
    });

    it('should have a main landmark with id', () => {
      renderWithProviders(<Home />);
      const main = screen.getByRole('main');
      expect(main).toHaveAttribute('id', 'main-content');
    });

    it('should have exactly one h1', () => {
      renderWithProviders(<Home />);
      const h1Elements = screen.getAllByRole('heading', { level: 1 });
      expect(h1Elements).toHaveLength(1);
    });

    it('should have aria-labelledby on sections', () => {
      renderWithProviders(<Home />);
      const heroSection = document.querySelector('[aria-labelledby="hero-heading"]');
      expect(heroSection).not.toBeNull();
    });

    it('should have aria-hidden on decorative elements', () => {
      renderWithProviders(<Home />);
      const decoratives = document.querySelectorAll('[aria-hidden="true"]');
      expect(decoratives.length).toBeGreaterThan(0);
    });

    it('should have descriptive aria-labels on icon-only elements', () => {
      renderWithProviders(<Home />);
      const statSection = screen.getByLabelText('Indian Election Statistics');
      expect(statSection).toBeInTheDocument();
    });
  });

  describe('Learn Page Accessibility', () => {
    let Learn;

    beforeEach(async () => {
      const module = await import('../pages/Learn');
      Learn = module.default;
    });

    it('should have proper tablist role', () => {
      renderWithProviders(<Learn />);
      const tablist = screen.getByRole('tablist');
      expect(tablist).toBeInTheDocument();
    });

    it('tabs should have aria-selected attribute', () => {
      renderWithProviders(<Learn />);
      const tabs = screen.getAllByRole('tab');
      const activeTab = tabs.find(tab => tab.getAttribute('aria-selected') === 'true');
      expect(activeTab).toBeDefined();
    });

    it('tabs should have aria-controls pointing to panels', () => {
      renderWithProviders(<Learn />);
      const tabs = screen.getAllByRole('tab');
      tabs.forEach(tab => {
        expect(tab).toHaveAttribute('aria-controls');
      });
    });

    it('tabpanel should have proper role', () => {
      renderWithProviders(<Learn />);
      const tabpanel = screen.getByRole('tabpanel');
      expect(tabpanel).toBeInTheDocument();
    });
  });

  describe('Simulate Page Accessibility', () => {
    let Simulate;

    beforeEach(async () => {
      const module = await import('../pages/Simulate');
      Simulate = module.default;
    });

    it('should have progressbar with proper aria attributes', () => {
      renderWithProviders(<Simulate />);
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuenow');
      expect(progressbar).toHaveAttribute('aria-valuemin');
      expect(progressbar).toHaveAttribute('aria-valuemax');
    });

    it('navigation buttons should have aria-labels', () => {
      renderWithProviders(<Simulate />);
      const prevBtn = screen.getByLabelText('Previous step');
      const nextBtn = screen.getByLabelText('Next step');
      expect(prevBtn).toBeInTheDocument();
      expect(nextBtn).toBeInTheDocument();
    });

    it('step dots should have aria-label for each step', () => {
      renderWithProviders(<Simulate />);
      const stepButtons = screen.getAllByRole('button').filter(
        btn => btn.getAttribute('aria-label')?.startsWith('Step')
      );
      expect(stepButtons.length).toBe(8);
    });
  });

  describe('Quiz Page Accessibility', () => {
    let Quiz;

    beforeEach(async () => {
      const module = await import('../pages/Quiz');
      Quiz = module.default;
    });

    it('should have main content area', () => {
      renderWithProviders(<Quiz />);
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('topic buttons should have unique IDs', () => {
      renderWithProviders(<Quiz />);
      const topicButtons = document.querySelectorAll('[id^="quiz-topic-"]');
      expect(topicButtons.length).toBeGreaterThanOrEqual(4);

      const ids = Array.from(topicButtons).map(b => b.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('Assistant Page Accessibility', () => {
    let Assistant;

    beforeEach(async () => {
      const module = await import('../pages/Assistant');
      Assistant = module.default;
    });

    it('should have chat messages with aria-live', () => {
      renderWithProviders(<Assistant />);
      const chatLog = screen.getByRole('log');
      expect(chatLog).toHaveAttribute('aria-live', 'polite');
    });

    it('should have labeled input', () => {
      renderWithProviders(<Assistant />);
      const input = screen.getByLabelText('Type your message');
      expect(input).toBeInTheDocument();
    });

    it('should have labeled send button', () => {
      renderWithProviders(<Assistant />);
      const sendBtn = screen.getByLabelText('Send message');
      expect(sendBtn).toBeInTheDocument();
    });
  });

  describe('Global Accessibility Patterns', () => {
    it('A11Y_DEFAULTS should provide sensible defaults', () => {
      const { A11Y_DEFAULTS } = require('../utils/constants');
      expect(A11Y_DEFAULTS.fontSize).toBe('normal');
      expect(A11Y_DEFAULTS.contrast).toBe('normal');
      expect(A11Y_DEFAULTS.reducedMotion).toBe(false);
    });
  });
});
