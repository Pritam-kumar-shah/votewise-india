/**
 * VoteWise India — Main App Component
 * Routes, layout structure, error boundary, and analytics
 */

import { Component, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { trackPageView } from './services/firebaseConfig';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { useEffect } from 'react';
import './App.css';

// Lazy-loaded pages for code splitting and performance
const Home = lazy(() => import('./pages/Home'));
const Learn = lazy(() => import('./pages/Learn'));
const Simulate = lazy(() => import('./pages/Simulate'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Assistant = lazy(() => import('./pages/Assistant'));
const BoothFinder = lazy(() => import('./pages/BoothFinder'));

/**
 * Loading fallback component shown while lazy-loaded pages are loading
 * @returns {JSX.Element} Loading spinner
 */
function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-label="Loading page">
      <div className="loader"></div>
      <p>Loading...</p>
    </div>
  );
}

/**
 * Error Boundary component to catch rendering errors gracefully
 * Prevents the entire app from crashing on component errors
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[VoteWise] Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <div className="error-boundary__content">
            <h2>⚠️ Something went wrong</h2>
            <p>An unexpected error occurred. Please try refreshing the page.</p>
            <button
              className="btn btn--primary"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
            >
              🔄 Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Route change tracker — logs page views to Firebase Analytics
 */
function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    const pageNames = {
      '/': 'Home',
      '/learn': 'Learn',
      '/simulate': 'Simulator',
      '/quiz': 'Quiz',
      '/assistant': 'AI Assistant',
      '/booth-finder': 'Booth Finder',
    };

    const pageName = pageNames[location.pathname] || 'Unknown';
    trackPageView(pageName, location.pathname);
  }, [location.pathname]);

  return null;
}

/** Layout wrapper that conditionally shows footer */
function AppLayout() {
  const location = useLocation();
  const hideFooter = location.pathname === '/assistant';

  return (
    <div className="app">
      {/* Accessibility Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Header />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/simulate" element={<Simulate />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/booth-finder" element={<BoothFinder />} />
        </Routes>
      </Suspense>

      {!hideFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <RouteTracker />
          <AppLayout />
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}
