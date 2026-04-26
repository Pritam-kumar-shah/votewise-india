/**
 * VoteWise India — Main App Component
 * Routes and layout structure
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Simulate from './pages/Simulate';
import Quiz from './pages/Quiz';
import Assistant from './pages/Assistant';
import BoothFinder from './pages/BoothFinder';
import './App.css';

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

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/simulate" element={<Simulate />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/booth-finder" element={<BoothFinder />} />
      </Routes>

      {!hideFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppLayout />
      </Router>
    </AppProvider>
  );
}
