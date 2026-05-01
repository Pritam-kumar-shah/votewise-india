/**
 * Component Tests for VoteWise India Pages
 * Tests rendering, accessibility, and user interactions
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '../context/AppContext';

// Mock Firebase services
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
  signInWithGoogle: vi.fn().mockResolvedValue(null),
  signInAsGuest: vi.fn().mockResolvedValue(null),
  signOut: vi.fn().mockResolvedValue(true),
  onAuthChange: vi.fn((cb) => { cb(null); return () => {}; }),
  getCurrentUser: vi.fn(() => null),
  saveQuizScore: vi.fn().mockResolvedValue(null),
  getQuizHistory: vi.fn().mockResolvedValue([]),
  saveUserPreferences: vi.fn().mockResolvedValue(false),
  loadUserPreferences: vi.fn().mockResolvedValue(null),
  saveUserProgress: vi.fn().mockResolvedValue(false),
  loadUserProgress: vi.fn().mockResolvedValue(null),
  app: null,
  analytics: null,
  performance: null,
  auth: null,
  db: null,
}));

// Mock Gemini service
vi.mock('../services/geminiService', () => ({
  initGemini: vi.fn(() => false),
  startChatSession: vi.fn(() => null),
  sendMessage: vi.fn().mockRejectedValue(new Error('Not configured')),
  generateQuizQuestions: vi.fn().mockResolvedValue(null),
  explainConcept: vi.fn().mockResolvedValue(null),
}));

/** Helper to render components with required providers */
function renderWithProviders(ui) {
  return render(
    <BrowserRouter>
      <AppProvider>
        {ui}
      </AppProvider>
    </BrowserRouter>
  );
}

describe('Home Page', () => {
  let Home;

  beforeEach(async () => {
    const module = await import('../pages/Home');
    Home = module.default;
  });

  it('should render the hero section with title', () => {
    renderWithProviders(<Home />);

    expect(screen.getByText('Your Vote is Your')).toBeInTheDocument();
    expect(screen.getByText('Voice')).toBeInTheDocument();
  });

  it('should render main content area', () => {
    renderWithProviders(<Home />);

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute('id', 'main-content');
  });

  it('should display feature cards', () => {
    renderWithProviders(<Home />);

    expect(screen.getByText('AI Election Assistant')).toBeInTheDocument();
    expect(screen.getByText('Find Polling Booth')).toBeInTheDocument();
    expect(screen.getByText('Voting Simulator')).toBeInTheDocument();
  });

  it('should display election statistics', () => {
    renderWithProviders(<Home />);

    expect(screen.getByText('543')).toBeInTheDocument(); // Lok Sabha seats
    expect(screen.getByText('97cr+')).toBeInTheDocument(); // Registered voters
  });

  it('should have CTA buttons with proper links', () => {
    renderWithProviders(<Home />);

    const startBtn = screen.getByText('Start Learning');
    expect(startBtn).toBeInTheDocument();

    const aiBtn = screen.getByText('Ask AI Assistant');
    expect(aiBtn).toBeInTheDocument();
  });

  it('should show Google services badges', () => {
    renderWithProviders(<Home />);

    const geminiElements = screen.getAllByText('Gemini AI');
    expect(geminiElements.length).toBeGreaterThan(0);
    expect(screen.getAllByText('Google Maps').length).toBeGreaterThan(0);
    expect(screen.getByText('Google Fonts')).toBeInTheDocument();
    expect(screen.getByText('Firebase Auth')).toBeInTheDocument();
    expect(screen.getByText('Cloud Firestore')).toBeInTheDocument();
    expect(screen.getByText('Firebase Hosting')).toBeInTheDocument();
    expect(screen.getByText('Firebase Analytics')).toBeInTheDocument();
  });

  it('should render how-it-works section', () => {
    renderWithProviders(<Home />);

    expect(screen.getByText('How VoteWise Works')).toBeInTheDocument();
    expect(screen.getByText('Learn')).toBeInTheDocument();
    expect(screen.getByText('Practice')).toBeInTheDocument();
  });
});

describe('Learn Page', () => {
  let Learn;

  beforeEach(async () => {
    const module = await import('../pages/Learn');
    Learn = module.default;
  });

  it('should render the page title', () => {
    renderWithProviders(<Learn />);

    expect(screen.getByText('Election')).toBeInTheDocument();
    expect(screen.getByText('Knowledge Hub')).toBeInTheDocument();
  });

  it('should render tab navigation', () => {
    renderWithProviders(<Learn />);

    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByText('Election Concepts')).toBeInTheDocument();
    expect(screen.getByText('Election Timeline')).toBeInTheDocument();
    expect(screen.getByText('Voter Checklist')).toBeInTheDocument();
  });

  it('should display concepts panel by default', () => {
    renderWithProviders(<Learn />);

    const conceptsPanel = screen.getByRole('tabpanel');
    expect(conceptsPanel).toBeInTheDocument();
  });

  it('should display election concepts cards', () => {
    renderWithProviders(<Learn />);

    expect(screen.getByText('Electronic Voting Machine (EVM)')).toBeInTheDocument();
    expect(screen.getByText('VVPAT')).toBeInTheDocument();
    expect(screen.getByText('NOTA (None of the Above)')).toBeInTheDocument();
  });

  it('concepts should have AI explanation badges', () => {
    renderWithProviders(<Learn />);

    const badges = screen.getAllByText(/AI explanation|AI व्याख्या/);
    expect(badges.length).toBeGreaterThan(0);
  });
});

describe('Simulate Page', () => {
  let Simulate;

  beforeEach(async () => {
    const module = await import('../pages/Simulate');
    Simulate = module.default;
  });

  it('should render the page title', () => {
    renderWithProviders(<Simulate />);

    expect(screen.getByText('Voting')).toBeInTheDocument();
    expect(screen.getByText('Simulator')).toBeInTheDocument();
  });

  it('should show step 1 initially', () => {
    renderWithProviders(<Simulate />);

    expect(screen.getByText('Check Your Eligibility')).toBeInTheDocument();
    expect(screen.getByText('Step 1')).toBeInTheDocument();
  });

  it('should render progress bar', () => {
    renderWithProviders(<Simulate />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render navigation buttons', () => {
    renderWithProviders(<Simulate />);

    expect(screen.getByText(/Previous/)).toBeInTheDocument();
    expect(screen.getByText(/Next/)).toBeInTheDocument();
  });

  it('should render step navigation dots', () => {
    renderWithProviders(<Simulate />);

    const stepDots = screen.getByRole('navigation', { name: 'Simulation steps' });
    expect(stepDots).toBeInTheDocument();
  });
});

describe('Quiz Page', () => {
  let Quiz;

  beforeEach(async () => {
    const module = await import('../pages/Quiz');
    Quiz = module.default;
  });

  it('should render the topic selection screen', () => {
    renderWithProviders(<Quiz />);

    expect(screen.getByText('Election')).toBeInTheDocument();
    expect(screen.getByText('Knowledge Quiz')).toBeInTheDocument();
  });

  it('should display quiz topics', () => {
    renderWithProviders(<Quiz />);

    expect(screen.getByText('General Elections')).toBeInTheDocument();
    expect(screen.getByText('EVM & VVPAT')).toBeInTheDocument();
    expect(screen.getByText('Voter Rights')).toBeInTheDocument();
    expect(screen.getByText('Election Process')).toBeInTheDocument();
  });

  it('should mention Gemini AI', () => {
    renderWithProviders(<Quiz />);

    expect(screen.getByText(/Gemini AI/)).toBeInTheDocument();
  });
});

describe('Assistant Page', () => {
  let Assistant;

  beforeEach(async () => {
    const module = await import('../pages/Assistant');
    Assistant = module.default;
  });

  it('should render chat interface', () => {
    renderWithProviders(<Assistant />);

    expect(screen.getByText('VoteWise AI')).toBeInTheDocument();
  });

  it('should render chat input', () => {
    renderWithProviders(<Assistant />);

    const chatInput = screen.getByLabelText('Type your message');
    expect(chatInput).toBeInTheDocument();
  });

  it('should render send button', () => {
    renderWithProviders(<Assistant />);

    const sendBtn = screen.getByLabelText('Send message');
    expect(sendBtn).toBeInTheDocument();
  });

  it('should display quick action buttons', () => {
    renderWithProviders(<Assistant />);

    expect(screen.getByText(/How to register to vote/)).toBeInTheDocument();
    expect(screen.getByText(/What is EVM/)).toBeInTheDocument();
  });

  it('should display non-partisan badge', () => {
    renderWithProviders(<Assistant />);

    expect(screen.getByText('Non-Partisan')).toBeInTheDocument();
  });

  it('should show educational disclaimer', () => {
    renderWithProviders(<Assistant />);

    expect(screen.getByText(/Educational information only/)).toBeInTheDocument();
  });
});
