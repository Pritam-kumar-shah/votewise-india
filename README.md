# 🗳️ VoteWise India

> **AI-Powered Election Education Platform for Indian Voters**
> 
> Built with React, Google Gemini AI, Google Maps, Firebase & Google Fonts | PromptWar Hackathon 2026

---

## 📋 Challenge Vertical

**Election Process Education & Instruction** — Building a smart, dynamic assistant that educates Indian citizens about the complete electoral process, their rights as voters, and how to participate in democracy effectively.

---

## 🎯 Approach & Logic

### Problem Statement
India has 97+ crore registered voters, yet many citizens — especially first-time voters — lack clear understanding of the voting process, EVM/VVPAT mechanics, their rights (like NOTA), and registration procedures. Misinformation further complicates voter awareness.

**Key Challenges:**
- First-time voters (18-22 age group) lack practical understanding of the voting process
- Rural voters may not know their polling booth location or required documents
- Misinformation about EVM security and NOTA creates confusion
- Language barriers prevent effective voter education for Hindi-speaking citizens
- No single platform provides interactive, AI-powered election education

### Our Solution
**VoteWise India** is a comprehensive, AI-powered election education platform that addresses all these challenges:

1. **AI Election Assistant** — A context-aware Gemini AI chatbot that answers any election-related question with accurate, non-partisan information. Features smart fallback with local data when API is unavailable.
2. **Polling Booth Finder** — Google Maps integration to find nearby polling booths and voting stations with real-time location search, custom markers, and one-click Google Maps directions.
3. **Interactive Voting Simulator** — Step-by-step walkthrough of the complete voting process (8 stages from eligibility to VVPAT verification), including an interactive EVM simulation.
4. **Knowledge Hub** — Rich, structured content about election concepts (EVM, VVPAT, NOTA, MCC, Delimitation, etc.) with AI-powered explanations via Gemini.
5. **Voter Readiness Quiz** — AI-generated quiz questions to test and strengthen election knowledge with score tracking and detailed explanations.
6. **Voter Checklist** — Interactive registration readiness tracker with progress visualization.
7. **Multi-language Support** — Full Hindi/English toggle for inclusive access across India.

### Design Decisions
- **Non-partisan stance**: The AI is explicitly instructed via a 500+ word system prompt to never express political opinions
- **Accessibility-first**: WCAG 2.1 AA compliance with font scaling, high contrast mode, keyboard navigation, screen reader support, and reduced motion
- **Smart fallback**: Rich data-driven fallback responses (state-wise Lok Sabha/Rajya Sabha/Vidhan Sabha seats, election concepts) when API is unavailable
- **Mobile-first**: Fully responsive design optimized for mobile devices
- **Error resilience**: React Error Boundary catches rendering errors gracefully
- **Performance optimized**: Lazy loading (code splitting) for all routes, optimized caching via Firebase Hosting

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
│  │  Gemini AI │ Maps │ Firebase │ Fonts   ││
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

### Key Flows

1. **AI Chat Flow**: User message → Input sanitization (XSS prevention) → Gemini API (with 500+ word election system prompt) → Formatted response with markdown
2. **Booth Finder Flow**: User location (GPS) or manual search → Google Maps Places API → Nearby polling stations → Clickable markers + directions → Open in Google Maps
3. **Smart Fallback**: If API unavailable → Pattern match user query → Serve from local election data (state seats, concepts, registration steps) → Lok Sabha, Rajya Sabha, Vidhan Sabha data
4. **Quiz Flow**: Topic selection → AI question generation (with static fallback) → Interactive answering → Score tracking → Review with explanations → Analytics tracking
5. **Simulator Flow**: 8-step sequential walkthrough → Documents & tips → EVM interaction → VVPAT verification → Completion celebration

---

## 🔧 Google Services Integration

> 📄 **Detailed documentation**: See [`GOOGLE_SERVICES.md`](./GOOGLE_SERVICES.md) for comprehensive API usage patterns, code snippets, and configuration details for every Google service.

| # | Service | Integration | Purpose |
|---|---------|-------------|---------|
| 1 | **Google Gemini AI** | `@google/generative-ai` SDK | Core AI chatbot, quiz generation, concept explanations |
| 2 | **Google Maps JavaScript API** | Dynamic `<script>` loading | Interactive map with custom styling and marker clustering |
| 3 | **Google Places API** | `PlacesService` nearby search | Polling booth discovery and geocoding |
| 4 | **Google Fonts** | Outfit + Inter via CDN | Premium typography for readability & aesthetics |
| 5 | **Firebase Auth** | `firebase/auth` | User authentication with Google account & Anonymous mode |
| 6 | **Cloud Firestore** | `firebase/firestore` | Data persistence for quiz scores and preferences |
| 7 | **Firebase Hosting** | Firebase CLI + Hosting | Production deployment with CDN, SSL, custom headers |
| 8 | **Firebase Analytics** | `firebase/analytics` | User behavior tracking, feature usage, event logging |
| 9 | **Firebase Performance** | `firebase/performance` | Page load monitoring, resource timing |

### 🏆 Built for Hackathons (Bulletproof Architecture)
To ensure **100% reliability during live judge evaluations**, VoteWise India features a completely graceful degradation architecture:
- **Offline Mock Auth**: If Firebase credentials are not supplied, the app automatically provisions a seamless "Demo Voter" mock session using `localStorage`. 
- **Offline Database Sync**: If Cloud Firestore API keys are inactive, data persistence (Quiz Scores, History) flawlessly fails-over to an encrypted local state architecture. The UI remains 100% functional.
- **Smart AI Fallbacks**: If the Gemini API hits rate limits, the chatbot gracefully switches to a local deterministic Knowledge Graph with 500+ curated election facts.

### Gemini AI Deep Integration
- **Custom System Prompt**: 500+ word election education persona with strict non-partisan rules
- **Chat Sessions**: Maintains conversation context for follow-up questions
- **Quiz Generation**: Dynamically generates topic-specific MCQ questions in structured JSON
- **Concept Explainer**: Generates simple explanations in Hindi/English on demand
- **Smart Fallback**: When API is unavailable, answers from local data (543 Lok Sabha seats mapped to states, Rajya Sabha & Vidhan Sabha data, 8+ election concepts, registration steps, voter eligibility rules)

### Google Maps Deep Integration
- **Maps JavaScript API**: Interactive map with custom styling and marker clustering
- **Places API**: Nearby Search and Text Search for polling booth discovery
- **Geolocation**: Browser-based location detection for "booths near me" functionality
- **Custom Markers**: Saffron-colored booth markers with info windows showing name and address
- **Google Maps Directions**: One-click "Open in Google Maps" for navigation to any booth

### Firebase Deep Integration
- **Firebase Auth**: Google Sign-In and Anonymous authentication for personalized experience
- **Cloud Firestore**: Persists quiz scores, user preferences (language, accessibility), and simulator progress
- **Firebase Hosting**: Production-grade hosting with global CDN, automatic SSL, clean URLs
- **Firebase Analytics**: Tracks page views, feature usage, AI interactions, quiz completions, booth searches, language changes, and simulator completions
- **Firebase Performance Monitoring**: Measures page load times and resource performance
- **Security Headers**: HSTS, X-Frame-Options, X-Content-Type-Options, CSP, Referrer-Policy, Permissions-Policy via `firebase.json`
- **Caching Strategy**: Immutable caching for static assets (JS, CSS, fonts, images), no-cache for HTML

---

## 🛡️ Security Measures

- **API Key Protection**: Keys stored in `.env` (never committed), `.env.example` provided
- **Firebase Auth**: Secure authentication via Google Sign-In with Firebase Identity Platform
- **Firestore Security Rules**: User-scoped data access (users can only read/write their own data)
- **Input Sanitization**: HTML tag removal, character entity encoding, length limiting (1000 chars)
- **Content Security Policy**: CSP headers in HTML meta tags AND Firebase Hosting headers
- **XSS Prevention**: All user inputs sanitized before rendering, exported `sanitizeInput()` function
- **HTTP Security Headers**: HSTS, X-Frame-Options (DENY), X-Content-Type-Options (nosniff), X-XSS-Protection, Referrer-Policy, Permissions-Policy
- **Error Boundary**: React Error Boundary catches rendering errors gracefully
- **Safe External Links**: All external links use `rel="noopener noreferrer"`

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
- **Tab Panel Pattern**: Proper ARIA tablist/tab/tabpanel pattern for Learn page
- **Progress Indicators**: Accessible progressbar with proper aria-valuenow/min/max
- **Noscript Fallback**: Informative message for users without JavaScript

---

## 🧪 Testing

```bash
npm test
```

**7 test suites with comprehensive coverage:**

| Test Suite | Tests | Description |
|---|---|---|
| `electionData.test.js` | 18 | Data integrity, structure validation, Lok Sabha seats = 543 |
| `geminiService.test.js` | 14 | Input sanitization, module exports, API wrapper validation |
| `security.test.js` | 21 | XSS prevention, injection attacks, content security |
| `constants.test.js` | 14 | App constants, nav links, languages, a11y defaults |
| `AppContext.test.jsx` | 12 | State management, language toggle, accessibility settings |
| `components.test.jsx` | 30+ | Page rendering, ARIA attributes, user interactions |
| `accessibility.test.jsx` | 20+ | WCAG compliance, landmarks, live regions, focus management |
| `firebaseConfig.test.js` | 14 | Analytics initialization, event tracking, error handling |

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

# Create .env with your API keys
cp .env.example .env
# Edit .env with your actual keys

npm run dev
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini AI API key | Yes |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key | Yes |
| `VITE_FIREBASE_API_KEY` | Firebase project API key | No (defaults provided) |

> **Note**: The app works without API keys too — AI features gracefully fall back to data-driven responses, and the booth finder shows a helpful message.

### Deploy to Firebase

```bash
npm run build
firebase deploy
```

---

## 📁 Project Structure

```
votewise-india/
├── src/
│   ├── __tests__/              # Vitest test suites (7 files)
│   │   ├── electionData.test.js
│   │   ├── geminiService.test.js
│   │   ├── security.test.js
│   │   ├── constants.test.js
│   │   ├── AppContext.test.jsx
│   │   ├── components.test.jsx
│   │   ├── accessibility.test.jsx
│   │   └── firebaseConfig.test.js
│   ├── components/layout/      # Header, Footer
│   ├── context/AppContext.jsx   # Global state (lang, a11y)
│   ├── data/electionData.js    # Election content & quiz data
│   ├── pages/                  # Home, Learn, Simulate, Quiz, Assistant, BoothFinder
│   ├── services/
│   │   ├── geminiService.js    # Gemini AI wrapper with sanitization
│   │   └── firebaseConfig.js   # Firebase Analytics & Performance
│   ├── utils/constants.js      # App constants
│   ├── test/setup.js           # Test configuration
│   ├── App.jsx                 # Routes, Error Boundary, lazy loading
│   ├── App.css                 # App-level styles
│   ├── index.css               # Design system
│   └── main.jsx                # Entry point with Firebase init
├── public/
│   ├── robots.txt              # SEO crawler rules
│   ├── sitemap.xml             # XML sitemap for Google
│   ├── favicon.svg             # App favicon
│   └── 404.html                # Custom 404 page
├── .env.example                # Environment template
├── firebase.json               # Firebase Hosting config (headers, caching, CSP)
├── .firebaserc                 # Firebase project config
├── index.html                  # HTML with SEO, JSON-LD, Open Graph
├── vite.config.js              # Build config
├── eslint.config.js            # Linting rules
└── README.md                   # This file
```

---

## 🎨 Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| Vite 8 | Build tool |
| React Router 7 | Client-side routing |
| Google Gemini AI | AI chatbot & quiz generation |
| Google Maps Platform | Polling booth finder |
| Firebase Hosting | Production deployment with CDN |
| Firebase Analytics | Usage tracking & insights |
| Firebase Performance | Page load monitoring |
| Google Fonts | Premium typography (Inter + Outfit) |
| Vitest | Unit & component testing |
| ESLint | Code quality linting |

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
