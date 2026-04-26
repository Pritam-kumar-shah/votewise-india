# 🗳️ VoteWise India

> **AI-Powered Election Education Platform for Indian Voters**
> 
> Built with React, Google Gemini AI & Google Fonts | PromptWar Hackathon 2026

---

## 📋 Challenge Vertical

**Election Process Education & Instruction** — Building a smart, dynamic assistant that educates Indian citizens about the complete electoral process, their rights as voters, and how to participate in democracy effectively.

---

## 🎯 Approach & Logic

### Problem Statement
India has 97+ crore registered voters, yet many citizens — especially first-time voters — lack clear understanding of the voting process, EVM/VVPAT mechanics, their rights (like NOTA), and registration procedures. Misinformation further complicates voter awareness.

### Our Solution
**VoteWise India** is a comprehensive, AI-powered election education platform that:

1. **AI Election Assistant** — A context-aware Gemini AI chatbot that answers any election-related question with accurate, non-partisan information
2. **Polling Booth Finder** — Google Maps integration to find nearby polling booths and voting stations with real-time location search
3. **Interactive Voting Simulator** — Step-by-step walkthrough of the complete voting process (8 stages from eligibility to VVPAT verification), including an EVM simulation
4. **Knowledge Hub** — Rich, structured content about election concepts (EVM, VVPAT, NOTA, MCC, etc.) with AI-powered explanations
5. **Voter Readiness Quiz** — AI-generated quiz questions to test and strengthen election knowledge
6. **Voter Checklist** — Interactive registration readiness tracker
7. **Multi-language Support** — Full Hindi/English toggle for inclusive access

### Design Decisions
- **Non-partisan stance**: The AI is explicitly instructed to never express political opinions
- **Accessibility-first**: WCAG 2.1 AA compliance with font scaling, high contrast mode, keyboard navigation, and screen reader support
- **Smart fallback**: Rich data-driven fallback responses (state-wise Lok Sabha seats, election concepts) when API is unavailable
- **Mobile-first**: Fully responsive design optimized for mobile devices

---

## 🏗️ How It Works

```
┌─────────────────────────────────────────────┐
│              VoteWise India                  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   Home   │  │  Learn   │  │ Simulator│  │
│  │  Page    │  │  Hub     │  │ (8 Steps)│  │
│  └──────────┘  └──────────┘  └──────────┘  │
│                                             │
│  ┌──────────┐  ┌────────────────────────┐   │
│  │  Quiz    │  │   AI Assistant         │   │
│  │  Engine  │  │   ├─ Chat Session      │   │
│  └──────────┘  │   ├─ Smart Fallback    │   │
│                │   └─ Input Sanitize    │   │
│                └────────────────────────┘   │
│                                             │
│  ┌──────────┐                               │
│  │  Booth   │  Google Maps JS API           │
│  │  Finder  │  (Places + Geolocation)       │
│  └──────────┘                               │
│                                             │
│  ┌─────────────────────────────────────────┐│
│  │       Google Services Layer             ││
│  │  Gemini AI │ Google Maps │ Google Fonts ││
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

### Key Flows

1. **AI Chat Flow**: User message → Input sanitization → Gemini API (with election system prompt) → Formatted response
2. **Booth Finder Flow**: User location (GPS) or manual search → Google Maps Places API → Nearby polling stations → Clickable markers + directions
3. **Smart Fallback**: If API unavailable → Pattern match user query → Serve from local election data (state seats, concepts, registration steps)
4. **Quiz Flow**: Topic selection → AI question generation (with static fallback) → Interactive answering → Score with review
5. **Simulator Flow**: 8-step sequential walkthrough → EVM interaction → Completion celebration

---

## 🔧 Google Services Integration

| Service | Integration | Purpose |
|---------|-------------|---------|
| **Google Gemini AI** | `@google/generative-ai` SDK | Core AI chatbot, quiz generation, concept explanations |
| **Google Maps Platform** | Maps JavaScript API + Places API | Polling booth finder with nearby search, markers, and directions |
| **Google Fonts** | Outfit + Inter via CDN | Premium typography for readability & aesthetics |

### Gemini AI Deep Integration
- **Custom System Prompt**: 500+ word election education persona with strict non-partisan rules
- **Chat Sessions**: Maintains conversation context for follow-up questions
- **Quiz Generation**: Dynamically generates topic-specific MCQ questions in structured JSON
- **Concept Explainer**: Generates simple explanations in Hindi/English on demand
- **Smart Fallback**: When API is unavailable, answers from local data (543 Lok Sabha seats mapped to states, 8+ election concepts, registration steps, voter eligibility rules)

### Google Maps Deep Integration
- **Maps JavaScript API**: Interactive map with custom styling and marker clustering
- **Places API**: Nearby Search and Text Search for polling booth discovery
- **Geolocation**: Browser-based location detection for "booths near me" functionality
- **Custom Markers**: Saffron-colored booth markers with info windows showing name and address
- **Google Maps Directions**: One-click "Open in Google Maps" for navigation to any booth

---

## 🛡️ Security Measures

- **API Key Protection**: Keys stored in `.env` (never committed), `.env.example` provided
- **Input Sanitization**: HTML tag removal, character entity encoding, length limiting (1000 chars)
- **Content Security Policy**: CSP headers in HTML meta tags
- **XSS Prevention**: All user inputs sanitized before rendering
- **No Data Storage**: Purely client-side — no user data stored or transmitted

---

## ♿ Accessibility Features

- **Skip Link**: "Skip to main content" for keyboard users
- **ARIA Labels**: All interactive elements have proper labels
- **Keyboard Navigation**: Full tab navigation support
- **Font Scaling**: Normal / Large / Extra-Large text modes
- **High Contrast Mode**: Enhanced contrast for visual impairment
- **Reduced Motion**: Respects `prefers-reduced-motion` system preference
- **Screen Reader**: Semantic HTML, ARIA live regions, role attributes
- **Focus Indicators**: Visible 3px focus outline on all interactive elements
- **Language Toggle**: Hindi/English with `lang` attribute updates

---

## 🧪 Testing

```bash
npm test
```

**21 tests across 2 test suites:**

- **Election Data Tests** (18 tests): Data integrity, structure validation, Lok Sabha seats total = 543
- **Security Tests** (3 tests): Input sanitization, XSS prevention, null handling

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/votewise-india.git
cd votewise-india
npm install

# Create .env with your API key
echo "VITE_GEMINI_API_KEY=your_key_here" > .env

npm run dev
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini AI API key | Yes |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key | Yes |

> **Note**: The app works without API keys too — AI features gracefully fall back to data-driven responses, and the booth finder shows a helpful message.

---

## 📁 Project Structure

```
votewise-india/
├── src/
│   ├── __tests__/              # Vitest test files
│   ├── components/layout/      # Header, Footer
│   ├── context/AppContext.jsx   # Global state (lang, a11y)
│   ├── data/electionData.js    # Election content & quiz data
│   ├── pages/                  # Home, Learn, Simulate, Quiz, Assistant
│   ├── services/geminiService.js  # Gemini AI wrapper
│   ├── utils/constants.js      # App constants
│   ├── index.css               # Design system
│   └── main.jsx                # Entry point
├── .env.example                # Environment template
├── index.html                  # HTML with SEO
├── vite.config.js              # Build config
└── README.md
```

---

## 🎨 Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| Vite 8 | Build tool |
| React Router 7 | Client-side routing |
| Google Gemini AI | AI chatbot & quiz |
| Vitest | Unit testing |
| Google Fonts | Typography |

---

## 📝 Assumptions

1. Users have a modern web browser (Chrome 90+, Firefox 88+, Safari 14+)
2. Internet connection available for AI features (offline fallbacks exist)
3. Election data based on current Indian electoral system (2026)
4. Platform serves educational purposes — does not replace official ECI communication

---

<div align="center">
  <p>Made with ❤️ for Indian Democracy 🇮🇳</p>
  <p><strong>VoteWise India</strong> — Your Vote is Your Voice</p>
</div>
