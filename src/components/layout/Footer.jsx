/**
 * VoteWise India — Footer Component
 */

import { useAppContext } from '../../context/AppContext';
import { IMPORTANT_LINKS } from '../../data/electionData';
import './Footer.css';

export default function Footer() {
  const { t } = useAppContext();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner container">
        {/* Brand Section */}
        <div className="footer__brand">
          <div className="footer__logo">
            <span aria-hidden="true">🗳️</span>
            <span className="footer__logo-text">
              <span style={{ color: 'var(--saffron)' }}>Vote</span>
              <span>Wise</span>
              <span style={{ color: 'var(--green)' }}>India</span>
            </span>
          </div>
          <p className="footer__desc">
            {t(
              'AI-powered election education platform helping Indian citizens become informed voters.',
              'AI-संचालित चुनाव शिक्षा मंच जो भारतीय नागरिकों को सूचित मतदाता बनने में मदद करता है।'
            )}
          </p>
        </div>

        {/* Official Links */}
        <div className="footer__links-section">
          <h3 className="footer__heading">{t('Official Resources', 'आधिकारिक संसाधन')}</h3>
          <ul className="footer__links" role="list">
            {IMPORTANT_LINKS.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__link"
                >
                  <span aria-hidden="true">{link.icon}</span>
                  {link.title}
                  <span className="visually-hidden">(opens in new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="footer__disclaimer">
          <h3 className="footer__heading">{t('Disclaimer', 'अस्वीकरण')}</h3>
          <p>
            {t(
              'This platform is for educational purposes only. We are non-partisan and do not endorse any political party or candidate. Always refer to the official ECI website for verified information.',
              'यह मंच केवल शैक्षिक उद्देश्यों के लिए है। हम गैर-पक्षपाती हैं। सत्यापित जानकारी के लिए हमेशा आधिकारिक ECI वेबसाइट देखें।'
            )}
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© {new Date().getFullYear()} VoteWise India. {t('Built for PromptWar Hackathon', 'PromptWar हैकाथॉन के लिए निर्मित')}.</p>
          <p className="footer__made-in">
            {t('Made with', 'बनाया गया')} ❤️ {t('for Indian Democracy', 'भारतीय लोकतंत्र के लिए')} 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
