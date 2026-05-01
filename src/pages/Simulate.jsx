/**
 * VoteWise India — Voting Simulator Page
 * Interactive step-by-step voting process walkthrough
 */

import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { VOTING_STEPS } from '../data/electionData';
import { trackSimulatorCompletion } from '../services/firebaseConfig';
import './Simulate.css';

export default function Simulate() {
  const { t } = useAppContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(new Set());
  const [showCelebration, setShowCelebration] = useState(false);

  const step = VOTING_STEPS[currentStep];
  const progress = ((currentStep + 1) / VOTING_STEPS.length) * 100;

  const goNext = () => {
    setCompleted(prev => new Set([...prev, currentStep]));
    if (currentStep < VOTING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowCelebration(true);
      trackSimulatorCompletion(VOTING_STEPS.length);
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (index) => {
    setCurrentStep(index);
    setShowCelebration(false);
  };

  const resetSimulation = () => {
    setCurrentStep(0);
    setCompleted(new Set());
    setShowCelebration(false);
  };

  return (
    <main className="simulate-page" id="main-content">
      <div className="container">
        <div className="section-header">
          <h1 className="section-title">
            {t('Voting', 'मतदान')}{' '}
            <span className="gradient-text">{t('Simulator', 'सिम्युलेटर')}</span>
          </h1>
          <p className="section-subtitle">
            {t(
              'Experience the complete Indian voting process step-by-step. Learn before you go!',
              'पूरी भारतीय मतदान प्रक्रिया को चरण-दर-चरण अनुभव करें!'
            )}
          </p>
        </div>

        {showCelebration ? (
          /* Celebration Screen */
          <div className="sim-celebration animate-scale-in">
            <div className="sim-celebration__content glass-card">
              <div className="sim-celebration__icon" aria-hidden="true">🎉</div>
              <h2 className="sim-celebration__title">
                {t('Congratulations! You\'re Ready to Vote!', 'बधाई हो! आप वोट देने के लिए तैयार हैं!')}
              </h2>
              <p className="sim-celebration__desc">
                {t(
                  'You\'ve completed the entire voting process simulation. You now understand every step from registration to casting your vote!',
                  'आपने पूरी मतदान प्रक्रिया का सिमुलेशन पूरा कर लिया है!'
                )}
              </p>

              <div className="sim-celebration__stats">
                <div className="sim-celebration__stat">
                  <span className="sim-celebration__stat-value">{VOTING_STEPS.length}</span>
                  <span className="sim-celebration__stat-label">{t('Steps Completed', 'चरण पूरे')}</span>
                </div>
                <div className="sim-celebration__stat">
                  <span className="sim-celebration__stat-value">✅</span>
                  <span className="sim-celebration__stat-label">{t('Vote Ready', 'वोट के लिए तैयार')}</span>
                </div>
              </div>

              <div className="sim-celebration__actions">
                <button onClick={resetSimulation} className="btn btn--primary">
                  🔄 {t('Start Over', 'फिर से शुरू करें')}
                </button>
              </div>

              {/* Ink Mark Animation */}
              <div className="ink-mark" aria-hidden="true">
                <div className="ink-mark__finger">☝️</div>
                <div className="ink-mark__text">{t('Your vote has been cast!', 'आपका वोट डाला जा चुका है!')}</div>
              </div>
            </div>
          </div>
        ) : (
          /* Simulator Content */
          <div className="simulator">
            {/* Progress Bar */}
            <div className="sim-progress" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={VOTING_STEPS.length}>
              <div className="sim-progress__bar">
                <div className="sim-progress__fill" style={{ width: `${progress}%` }}></div>
              </div>
              <span className="sim-progress__text">
                {t('Step', 'चरण')} {currentStep + 1} / {VOTING_STEPS.length}
              </span>
            </div>

            {/* Step Navigation Dots */}
            <div className="sim-dots" role="navigation" aria-label="Simulation steps">
              {VOTING_STEPS.map((s, i) => (
                <button
                  key={s.id}
                  className={`sim-dot ${i === currentStep ? 'sim-dot--active' : ''} ${completed.has(i) ? 'sim-dot--completed' : ''}`}
                  onClick={() => goToStep(i)}
                  aria-label={`Step ${i + 1}: ${s.title}`}
                  aria-current={i === currentStep ? 'step' : undefined}
                >
                  {completed.has(i) ? '✓' : i + 1}
                </button>
              ))}
            </div>

            {/* Step Content */}
            <div className="sim-step glass-card animate-fade-in-up" key={currentStep}>
              <div className="sim-step__header">
                <span className="sim-step__icon" aria-hidden="true">{step.icon}</span>
                <div className="sim-step__number">
                  {t('Step', 'चरण')} {step.id}
                </div>
              </div>

              <h2 className="sim-step__title">
                {t(step.title, step.titleHi)}
              </h2>

              <p className="sim-step__desc">
                {t(step.description, step.descriptionHi)}
              </p>

              {/* Documents Required */}
              {step.documents.length > 0 && (
                <div className="sim-step__docs">
                  <h3>📋 {t('Documents Required', 'आवश्यक दस्तावेज')}</h3>
                  <ul>
                    {step.documents.map((doc, i) => (
                      <li key={i}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pro Tip */}
              {step.tip && (
                <div className="sim-step__tip">
                  <span aria-hidden="true">💡</span>
                  <div>
                    <strong>{t('Pro Tip', 'उपयोगी सुझाव')}:</strong>
                    <p>{step.tip}</p>
                  </div>
                </div>
              )}

              {/* EVM Simulation for Step 7 */}
              {step.id === 7 && (
                <div className="evm-simulation" role="figure" aria-label="EVM Machine Simulation">
                  <div className="evm">
                    <div className="evm__header">{t('Ballot Unit — EVM', 'बैलट यूनिट — EVM')}</div>
                    <div className="evm__candidates">
                      {['🟠 Candidate A — Party Symbol 🌸', '🔵 Candidate B — Party Symbol 🏠', '🟢 Candidate C — Party Symbol 🌿', '⚪ NOTA — ✖️'].map((candidate, i) => (
                        <button
                          key={i}
                          className="evm__candidate-btn"
                          onClick={() => alert(t(
                            `Vote registered for: ${candidate.split(' — ')[0]}. In real elections, you cannot change your vote once the button is pressed.`,
                            `वोट दर्ज: ${candidate.split(' — ')[0]}। वास्तविक चुनाव में, बटन दबाने के बाद आप अपना वोट नहीं बदल सकते।`
                          ))}
                          aria-label={`Vote for ${candidate}`}
                        >
                          <span className="evm__candidate-name">{candidate}</span>
                          <span className="evm__vote-btn">VOTE</span>
                        </button>
                      ))}
                    </div>
                    <p className="evm__note">{t('⚠️ This is a simulation. Try pressing a button!', '⚠️ यह एक सिमुलेशन है। बटन दबाकर देखें!')}</p>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="sim-step__nav">
                <button
                  className="btn btn--outline"
                  onClick={goPrev}
                  disabled={currentStep === 0}
                  aria-label="Previous step"
                >
                  ← {t('Previous', 'पिछला')}
                </button>
                <button
                  className="btn btn--primary"
                  onClick={goNext}
                  aria-label={currentStep === VOTING_STEPS.length - 1 ? 'Complete simulation' : 'Next step'}
                >
                  {currentStep === VOTING_STEPS.length - 1
                    ? `✅ ${t('Complete!', 'पूर्ण!')}`
                    : `${t('Next', 'अगला')} →`
                  }
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
