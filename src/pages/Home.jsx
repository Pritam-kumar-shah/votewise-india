/**
 * VoteWise India — Home Page (Redesigned)
 * Premium landing page with bold visuals
 */

import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { STATE_SEATS } from '../data/electionData';
import './Home.css';

export default function Home() {
  const { t } = useAppContext();
  const totalSeats = Object.values(STATE_SEATS).reduce((a, b) => a + b, 0);

  const features = [
    {
      icon: '🤖',
      title: t('AI Election Assistant', 'AI चुनाव सहायक'),
      desc: t(
        'Ask any question about Indian elections. Gemini AI gives accurate, unbiased answers instantly.',
        'चुनाव के बारे में कोई भी सवाल पूछें। Gemini AI तुरंत सटीक उत्तर देता है।'
      ),
      link: '/assistant',
      color: 'saffron',
      tag: t('Gemini AI', 'Gemini AI'),
    },
    {
      icon: '📍',
      title: t('Find Polling Booth', 'मतदान केंद्र खोजें'),
      desc: t(
        'Locate nearby polling booths and voting stations on Google Maps. Get directions instantly.',
        'Google Maps पर अपने पास के मतदान केंद्र खोजें। तुरंत दिशा-निर्देश पाएं।'
      ),
      link: '/booth-finder',
      color: 'blue',
      tag: t('Google Maps', 'Google Maps'),
    },
    {
      icon: '🗳️',
      title: t('Voting Simulator', 'मतदान सिम्युलेटर'),
      desc: t(
        'Walk through all 8 stages of the voting process with an interactive EVM simulation.',
        '8 चरणों की मतदान प्रक्रिया को EVM सिमुलेशन के साथ समझें।'
      ),
      link: '/simulate',
      color: 'green',
      tag: t('Interactive', 'इंटरैक्टिव'),
    },
    {
      icon: '📖',
      title: t('Election Knowledge', 'चुनाव ज्ञान'),
      desc: t(
        'Deep dive into EVM, VVPAT, NOTA, MCC and everything about Indian democracy.',
        'EVM, VVPAT, NOTA, MCC और भारतीय लोकतंत्र के बारे में सब कुछ जानें।'
      ),
      link: '/learn',
      color: 'saffron',
      tag: t('8+ Topics', '8+ विषय'),
    },
    {
      icon: '🧠',
      title: t('Voter Quiz', 'मतदाता क्विज़'),
      desc: t(
        'AI-generated questions to test your knowledge. Get scored and learn as you play!',
        'AI-जनित प्रश्नों से ज्ञान परखें। खेलते-खेलते सीखें!'
      ),
      link: '/quiz',
      color: 'green',
      tag: t('AI Powered', 'AI संचालित'),
    },
  ];

  const stats = [
    { value: '97cr+', label: t('Registered Voters', 'पंजीकृत मतदाता'), icon: '👥' },
    { value: totalSeats.toString(), label: t('Lok Sabha Seats', 'लोक सभा सीटें'), icon: '🏛️' },
    { value: '28+8', label: t('States & UTs', 'राज्य और केंद्र शासित'), icon: '🗺️' },
    { value: '10.5L+', label: t('Polling Stations', 'मतदान केंद्र'), icon: '📍' },
  ];

  return (
    <main className="home" id="main-content">
      {/* Hero Section */}
      <section className="hero" aria-labelledby="hero-heading">
        {/* Animated background elements */}
        <div className="hero__bg" aria-hidden="true">
          <div className="hero__orb hero__orb--1"></div>
          <div className="hero__orb hero__orb--2"></div>
          <div className="hero__orb hero__orb--3"></div>
          <div className="hero__grid-pattern"></div>
        </div>

        <div className="hero__content container">
          <div className="hero__badge animate-fade-in-down">
            <span className="hero__badge-dot"></span>
            {t('AI-Powered Election Education', 'AI-संचालित चुनाव शिक्षा')}
          </div>

          <h1 id="hero-heading" className="hero__title animate-fade-in-up stagger-1">
            {t('Your Vote is Your', 'आपका वोट आपकी')}
            <br />
            <span className="hero__title-accent">{t('Voice', 'आवाज़')}</span>
          </h1>

          <p className="hero__subtitle animate-fade-in-up stagger-2">
            {t(
              'India\'s smartest election education platform. Master the voting process, understand your rights, and become a confident voter — powered by Google Gemini AI.',
              'भारत का सबसे स्मार्ट चुनाव शिक्षा मंच। मतदान प्रक्रिया में महारत हासिल करें, अपने अधिकार समझें, और एक आत्मविश्वासी मतदाता बनें।'
            )}
          </p>

          <div className="hero__cta animate-fade-in-up stagger-3">
            <Link to="/simulate" className="btn btn--primary btn--lg" id="cta-start-learning">
              {t('Start Learning', 'सीखना शुरू करें')}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <Link to="/assistant" className="btn btn--ghost btn--lg" id="cta-ask-ai">
              {t('Ask AI Assistant', 'AI सहायक से पूछें')}
            </Link>
          </div>

          {/* Google Services */}
          <div className="hero__services animate-fade-in-up stagger-4">
            <span className="hero__services-label">{t('Powered by', 'द्वारा संचालित')}</span>
            <div className="hero__services-list">
              <span className="hero__service-chip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5z" fill="var(--saffron)"/><path d="M2 17l10 5 10-5" stroke="var(--green)" strokeWidth="2"/><path d="M2 12l10 5 10-5" stroke="var(--chakra-blue)" strokeWidth="2"/></svg>
                Gemini AI
              </span>
              <span className="hero__service-chip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="var(--error)" strokeWidth="2"/><circle cx="12" cy="10" r="3" stroke="var(--error)" strokeWidth="2"/></svg>
                Google Maps
              </span>
              <span className="hero__service-chip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7V4h16v3" stroke="var(--chakra-blue)" strokeWidth="2"/><path d="M9 20h6" stroke="var(--chakra-blue)" strokeWidth="2"/><path d="M12 4v16" stroke="var(--chakra-blue)" strokeWidth="2"/></svg>
                Google Fonts
              </span>
              <span className="hero__service-chip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="var(--saffron)" strokeWidth="2"/><circle cx="12" cy="7" r="4" stroke="var(--saffron)" strokeWidth="2"/></svg>
                Firebase Auth
              </span>
              <span className="hero__service-chip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6h16M4 10h16M4 14h10M4 18h7" stroke="var(--green)" strokeWidth="2" strokeLinecap="round"/></svg>
                Cloud Firestore
              </span>
              <span className="hero__service-chip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="var(--saffron)" stroke="var(--saffron)" strokeWidth="1"/></svg>
                Firebase Hosting
              </span>
              <span className="hero__service-chip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 3v18h18" stroke="var(--green)" strokeWidth="2"/><path d="M7 16l4-4 4 4 6-6" stroke="var(--green)" strokeWidth="2"/></svg>
                Firebase Analytics
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats" aria-label="Indian Election Statistics">
        <div className="container">
          <div className="stats__grid">
            {stats.map((stat, i) => (
              <div key={i} className={`stats__card animate-fade-in-up stagger-${i + 1}`}>
                <div className="stats__icon-wrap" aria-hidden="true">{stat.icon}</div>
                <span className="stats__value">{stat.value}</span>
                <span className="stats__label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" aria-labelledby="features-heading">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">{t('Features', 'विशेषताएं')}</span>
            <h2 id="features-heading" className="section-title">
              {t('Everything You Need to', 'वो सब कुछ जो आपको')}{' '}
              <span className="gradient-text">{t('Vote Confidently', 'आत्मविश्वास से वोट करने के लिए चाहिए')}</span>
            </h2>
          </div>

          <div className="features__grid">
            {features.map((feature, i) => (
              <Link
                to={feature.link}
                key={i}
                className={`feature-card feature-card--${feature.color} animate-fade-in-up stagger-${i + 1}`}
                id={`feature-${feature.link.replace('/', '')}`}
              >
                <div className="feature-card__top">
                  <div className={`icon-box icon-box--${feature.color}`} aria-hidden="true">
                    {feature.icon}
                  </div>
                  <span className="feature-card__tag">{feature.tag}</span>
                </div>
                <h3 className="feature-card__title">{feature.title}</h3>
                <p className="feature-card__desc">{feature.desc}</p>
                <div className="feature-card__footer">
                  <span className="feature-card__link-text">
                    {t('Explore', 'जानें')}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" aria-labelledby="how-heading">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">{t('Process', 'प्रक्रिया')}</span>
            <h2 id="how-heading" className="section-title">
              {t('How VoteWise Works', 'VoteWise कैसे काम करता है')}
            </h2>
          </div>

          <div className="how__grid">
            {[
              { step: '01', icon: '📚', title: t('Learn', 'सीखें'), desc: t('Explore guides about Indian elections, EVM, VVPAT, and your rights as a voter', 'भारतीय चुनावों, EVM, VVPAT और अपने अधिकारों के बारे में जानें'), color: 'saffron' },
              { step: '02', icon: '🗳️', title: t('Practice', 'अभ्यास'), desc: t('Use the interactive voting simulator to experience the full 8-step process', 'इंटरैक्टिव वोटिंग सिम्युलेटर से पूरी प्रक्रिया का अभ्यास करें'), color: 'blue' },
              { step: '03', icon: '🧠', title: t('Test', 'परीक्षण'), desc: t('Take AI-generated quizzes to validate your knowledge and learn from mistakes', 'AI क्विज़ लें, ज्ञान परखें और गलतियों से सीखें'), color: 'green' },
              { step: '04', icon: '✅', title: t('Vote!', 'वोट करें!'), desc: t('Walk into your polling booth with full confidence on election day', 'चुनाव के दिन पूर्ण आत्मविश्वास से मतदान करें'), color: 'saffron' },
            ].map((item, i) => (
              <div key={i} className={`how__step animate-fade-in-up stagger-${i + 1}`}>
                <div className="how__step-number" aria-hidden="true">{item.step}</div>
                <div className={`icon-box icon-box--${item.color} icon-box--lg`} aria-hidden="true">{item.icon}</div>
                <h3 className="how__step-title">{item.title}</h3>
                <p className="how__step-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta" aria-labelledby="cta-heading">
        <div className="container">
          <div className="final-cta__card">
            <div className="final-cta__glow" aria-hidden="true"></div>
            <h2 id="cta-heading" className="final-cta__title">
              {t('Ready to Become an', 'एक')}{' '}
              <span className="final-cta__accent">{t('Informed Voter', 'सूचित मतदाता')}</span>
              {t('?', ' बनने के लिए तैयार हैं?')}
            </h2>
            <p className="final-cta__desc">
              {t(
                'Every vote matters. Every informed vote matters more. Start your election education journey today.',
                'हर वोट मायने रखता है। हर सूचित वोट और भी ज़्यादा। आज ही शुरू करें।'
              )}
            </p>
            <Link to="/simulate" className="btn btn--white btn--lg">
              {t('Get Started Free', 'मुफ्त में शुरू करें')}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
