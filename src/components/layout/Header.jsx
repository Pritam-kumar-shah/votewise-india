/**
 * VoteWise India — Header Component
 * Navigation bar with language toggle and accessibility
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { NAV_LINKS, APP_NAME } from '../../utils/constants';
import './Header.css';

export default function Header() {
  const { language, toggleLanguage, t } = useAppContext();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
