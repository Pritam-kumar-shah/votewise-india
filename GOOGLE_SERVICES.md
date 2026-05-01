# 🔧 Google Services Integration — VoteWise India

This document provides comprehensive details about every Google Cloud / Google service integrated into VoteWise India.

---

## 📊 Services Overview (9 Google Services)

| # | Service | SDK / Method | Purpose | File |
|---|---------|-------------|---------|------|
| 1 | **Google Gemini AI** | `@google/generative-ai` | AI chatbot, quiz generation, concept explainer | `src/services/geminiService.js` |
| 2 | **Google Maps JavaScript API** | Dynamic `<script>` loading | Interactive map for polling booth discovery | `src/pages/BoothFinder.jsx` |
| 3 | **Google Maps Places API** | `PlacesService.nearbySearch` / `textSearch` | Polling booth search, location-based results | `src/pages/BoothFinder.jsx` |
| 4 | **Google Fonts** | CDN link in `index.html` | Premium typography (Outfit + Inter) | `index.html` |
| 5 | **Firebase Auth** | `firebase/auth` (Google Sign-In + Anonymous) | User authentication for personalized experience | `src/services/firebaseConfig.js` |
| 6 | **Cloud Firestore** | `firebase/firestore` | Data persistence (quiz scores, preferences, progress) | `src/services/firebaseConfig.js` |
| 7 | **Firebase Hosting** | Firebase CLI + GitHub Actions | Production deployment with CDN, SSL, headers | `firebase.json`, `.github/workflows/` |
| 8 | **Firebase Analytics** | `firebase/analytics` SDK | Event tracking, page views, feature usage | `src/services/firebaseConfig.js` |
| 9 | **Firebase Performance** | `firebase/performance` SDK | Page load monitoring, resource timing | `src/services/firebaseConfig.js` |

---

## 1️⃣ Google Gemini AI (`@google/generative-ai`)

### Configuration
```javascript
// src/services/geminiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  systemInstruction: SYSTEM_PROMPT, // 500+ word election education persona
});
```

### Usage Patterns
1. **AI Chat (`sendMessage`)** — Maintains a multi-turn chat session with election context. Uses `model.startChat()` with `temperature: 0.7`, `topP: 0.9`, `maxOutputTokens: 1024`.
2. **Quiz Generation (`generateQuizQuestions`)** — Generates structured JSON MCQ questions on election topics. Parses AI output with regex to extract JSON array.
3. **Concept Explainer (`explainConcept`)** — Generates Hindi/English explanations for election concepts (EVM, VVPAT, NOTA, etc.). Supports bilingual output based on user's language preference.

### Smart Fallback System
When the Gemini API is unavailable (no key, network error, rate limit), the app falls back to a comprehensive local data system:
- **543 Lok Sabha seats** mapped to 28 states + 8 UTs
- **Rajya Sabha seats** per state
- **Vidhan Sabha seats** per state
- **8+ election concepts** with detailed descriptions
- **Keyword-based matching** to provide relevant answers from local data

### Security
- All user inputs are sanitized via `sanitizeInput()` before sending to the API
- XSS prevention: HTML tag removal, character encoding, length limiting (1000 chars)
- API key stored in environment variable, never hardcoded

---

## 2️⃣ Google Maps JavaScript API + Places API

### Configuration
```javascript
// src/pages/BoothFinder.jsx
const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`;
```

### Usage Patterns
1. **Map Initialization** — Centers on India (22.5937°N, 78.9629°E) with custom styling that hides business POIs for cleaner view
2. **Nearby Search** — `PlacesService.nearbySearch()` with radius 5000m, keyword "polling booth voting station government school"
3. **Text Search** — `PlacesService.textSearch()` for manual location queries like "polling booth near Lucknow"
4. **Geolocation** — Uses `navigator.geolocation.getCurrentPosition()` for "booths near me" feature
5. **Custom Markers** — Saffron-colored SVG path markers with numbered labels and InfoWindows
6. **Google Maps Directions** — One-click "Open in Google Maps" via `https://www.google.com/maps/search/?api=1&query={lat},{lng}`

### Features
- Auto-bounds fitting to show all markers
- User location marker (blue circle)
- State dropdown filter for all 36 states/UTs
- Error handling for missing API key, network failures, geolocation denial

---

## 3️⃣ Google Fonts (CDN)

### Configuration
```html
<!-- index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
```

### Fonts Used
- **Outfit** — Headings, hero text, brand elements (weights: 400-800)
- **Inter** — Body text, UI elements, form inputs (weights: 300-700)

### Performance
- `preconnect` hints for faster DNS resolution
- `display=swap` for FOIT prevention
- Immutable caching via Firebase Hosting headers

---

## 4️⃣ Firebase Authentication (`firebase/auth`)

### Configuration
```javascript
// src/services/firebaseConfig.js
import {
  getAuth,
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';

auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
```

### Authentication Methods
1. **Google Sign-In** (`signInWithGoogle()`) — Full Google account authentication via popup. Returns user profile with `displayName`, `email`, `photoURL`.
2. **Anonymous Sign-In** (`signInAsGuest()`) — Guest mode for users who don't want to sign in. Creates a temporary anonymous account.
3. **Sign Out** (`signOut()`) — Signs out current user and clears session.
4. **Auth State Listener** (`onAuthChange(callback)`) — Real-time listener for auth state changes. Used in React components for reactive UI updates.

### Security
- Authentication is handled entirely by Firebase Identity Platform
- No password storage — uses Google's OAuth 2.0 flow
- Anonymous users can be upgraded to Google accounts later
- All auth events are tracked via Firebase Analytics (`sign_in`, `sign_out`)

---

## 5️⃣ Cloud Firestore (`firebase/firestore`)

### Configuration
```javascript
// src/services/firebaseConfig.js
import {
  getFirestore,
  doc, setDoc, getDoc,
  collection, addDoc,
  query, where, orderBy, limit, getDocs,
  serverTimestamp,
} from 'firebase/firestore';

db = getFirestore(app);
```

### Data Collections

#### `quizScores` — Quiz Results Storage
```javascript
{
  userId: "uid-123",
  topic: "General Elections",
  score: 4,
  total: 5,
  percentage: 80,
  timestamp: serverTimestamp()
}
```
- **Functions**: `saveQuizScore(userId, data)`, `getQuizHistory(userId, maxResults)`
- **Security**: Users can only create/read their own scores, scores are immutable

#### `userPreferences` — User Settings
```javascript
{
  language: "hi",
  fontSize: "large",
  contrast: "high",
  reducedMotion: false,
  updatedAt: serverTimestamp()
}
```
- **Functions**: `saveUserPreferences(userId, prefs)`, `loadUserPreferences(userId)`
- **Security**: User-scoped access (read/write only own document)

#### `userProgress` — Learning Progress
```javascript
{
  simulatorCompleted: true,
  quizzesCompleted: 5,
  conceptsViewed: ["EVM", "VVPAT", "NOTA"],
  updatedAt: serverTimestamp()
}
```
- **Functions**: `saveUserProgress(userId, data)`, `loadUserProgress(userId)`
- **Security**: User-scoped access (read/write only own document)

### Firestore Security Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /quizScores/{scoreId} {
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    match /userPreferences/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /userProgress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 6️⃣ Firebase Hosting

### Configuration
```json
// firebase.json
{
  "firestore": { "rules": "firestore.rules", "indexes": "firestore.indexes.json" },
  "hosting": {
    "public": "dist",
    "rewrites": [{ "source": "**", "destination": "/index.html" }],
    "cleanUrls": true, "trailingSlash": false
  }
}
```

### Security Headers (via Firebase Hosting)
| Header | Value |
|--------|-------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(self), payment=()` |
| `Content-Security-Policy` | Full CSP with allowlists for Google APIs |

### CI/CD Pipeline
- **On merge to main** → Lint → Test → Build → Deploy to live channel
- **On PR** → Test → Build → Deploy to preview channel
- GitHub Actions workflows: `.github/workflows/firebase-hosting-merge.yml` and `firebase-hosting-pull-request.yml`

---

## 7️⃣ Firebase Analytics (`firebase/analytics`)

### Events Tracked
| Event | Trigger | Parameters |
|-------|---------|------------|
| `page_view` | Route change | `page_title`, `page_path`, `page_location` |
| `sign_in` | User signs in | `method` (google/anonymous) |
| `sign_out` | User signs out | — |
| `ai_chat_interaction` | Chat message sent | `query_type`, `used_fallback` |
| `quiz_completed` | Quiz finished | `quiz_topic`, `quiz_score`, `quiz_total`, `quiz_percentage` |
| `booth_search` | Booth search executed | `search_method`, `results_count` |
| `simulator_completed` | Simulator finished | `steps_completed` |
| `language_changed` | Language toggled | `new_language` |
| `feature_usage` | Feature used | `feature_name` |

---

## 8️⃣ Firebase Performance Monitoring (`firebase/performance`)

### What It Monitors
- Page load times
- First Contentful Paint (FCP)
- Time to Interactive (TTI)
- Resource loading times (JS, CSS, fonts)
- Network request latency

---

## 🔑 API Keys & Environment Variables

| Variable | Service | Required |
|----------|---------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini AI | Yes (for AI features) |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps Platform | Yes (for booth finder) |
| `VITE_FIREBASE_API_KEY` | Firebase Project | No (defaults provided) |

---

## 📁 File Map

```
src/
├── services/
│   ├── geminiService.js      ← Google Gemini AI integration
│   └── firebaseConfig.js     ← Firebase Auth + Firestore + Analytics + Performance
├── pages/
│   ├── BoothFinder.jsx       ← Google Maps + Places API
│   └── Assistant.jsx         ← Gemini AI chat interface
├── main.jsx                  ← Firebase initialization
└── App.jsx                   ← Analytics route tracking

index.html                    ← Google Fonts CDN
firebase.json                 ← Firebase Hosting + Firestore config
firestore.rules               ← Cloud Firestore security rules
firestore.indexes.json        ← Firestore indexes
.github/workflows/            ← Firebase Hosting CI/CD
```
