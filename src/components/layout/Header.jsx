/**
 * VoteWise India — Header Component
 * Navigation bar with language toggle and accessibility
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { NAV_LINKS, APP_NAME } from '../../utils/constants';
import { signInWithGoogle, signOut, onAuthChange } from '../../services/firebaseConfig';
import './Header.css';

export default function Header() {
  const { language, toggleLanguage, t } = useAppContext();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleAuth = async () => {
    if (user) {
      await signOut();
    } else {
      await signInWithGoogle();
    }
  };

  return (
    <header className="header" role="banner">
      <div className="header__inner container">
        {/* Logo */}
        <Link to="/" className="header__logo" aria-label={`${APP_NAME} - Home`}>
          <span className="header__logo-icon" aria-hidden="true">🗳️</span>
          <span className="header__logo-text">
            <span className="header__logo-vote">Vote</span>
            <span className="header__logo-wise">Wise</span>
            <span className="header__logo-india">India</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header__nav" role="navigation" aria-label="Main Navigation">
          <ul className="header__nav-list">
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`header__nav-link ${location.pathname === link.path ? 'header__nav-link--active' : ''}`}
                  aria-current={location.pathname === link.path ? 'page' : undefined}
                >
                  <span className="header__nav-icon" aria-hidden="true">{link.icon}</span>
                  <span>{t(link.label, link.labelHi)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="header__actions">
          {/* Auth Button */}
          {user ? (
            <div className="header__user-profile" title={user.displayName}>
              <img src={user.photoURL} alt="Profile" className="header__user-avatar" />
              <button className="header__auth-btn" onClick={handleAuth}>
                {t('Sign Out', 'लॉग आउट')}
              </button>
            </div>
          ) : (
            <button className="header__auth-btn header__auth-btn--login" onClick={handleAuth}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{marginRight: '6px'}}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor"/></svg>
              {t('Sign In', 'साइन इन')}
            </button>
          )}

          {/* Language Toggle */}
          <button
            className="header__lang-btn"
            onClick={toggleLanguage}
            aria-label={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
            title={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
          >
            <span className="header__lang-flag" aria-hidden="true">{language === 'en' ? '🇮🇳' : '🇬🇧'}</span>
            <span className="header__lang-label">{language === 'en' ? 'हिंदी' : 'EN'}</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="header__menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className={`header__hamburger ${mobileMenuOpen ? 'header__hamburger--open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`header__mobile-menu ${mobileMenuOpen ? 'header__mobile-menu--open' : ''}`}
        role="navigation"
        aria-label="Mobile Navigation"
      >
        <ul className="header__mobile-list">
          {NAV_LINKS.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`header__mobile-link ${location.pathname === link.path ? 'header__mobile-link--active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={location.pathname === link.path ? 'page' : undefined}
              >
                <span aria-hidden="true">{link.icon}</span>
                <span>{t(link.label, link.labelHi)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          className="header__overlay"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
