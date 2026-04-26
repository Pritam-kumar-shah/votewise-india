/**
 * VoteWise India — Learn Page
 * Election knowledge base with interactive cards
 */

import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ELECTION_CONCEPTS, ELECTION_PHASES, VOTER_CHECKLIST } from '../data/electionData';
import { explainConcept } from '../services/geminiService';
import './Learn.css';

export default function Learn() {
  const { t, language } = useAppContext();
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [aiExplanation, setAiExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [activeTab, setActiveTab] = useState('concepts');

  const handleConceptClick = async (concept) => {
    setSelectedConcept(concept);
    setAiExplanation('');
    setLoading(true);

    const explanation = await explainConcept(concept.title, language);
    if (explanation) {
      setAiExplanation(explanation);
    }
    setLoading(false);
  };

  const toggleChecklist = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const requiredItems = VOTER_CHECKLIST.filter(item => item.required);
  const allRequiredChecked = requiredItems.every(item => checkedItems[item.id]);

  const tabs = [
    { id: 'concepts', label: t('Election Concepts', 'चुनाव अवधारणाएं'), icon: '📖' },
    { id: 'timeline', label: t('Election Timeline', 'चुनाव समयरेखा'), icon: '📅' },
    { id: 'checklist', label: t('Voter Checklist', 'मतदाता चेकलिस्ट'), icon: '✅' },
  ];

  return (
    <main className="learn-page" id="main-content">
      <div className="container">
        {/* Page Header */}
        <div className="section-header">
          <h1 className="section-title">
            {t('Election', 'चुनाव')}{' '}
            <span className="gradient-text">{t('Knowledge Hub', 'ज्ञान केंद्र')}</span>
          </h1>
          <p className="section-subtitle">
            {t(
              'Master the Indian electoral system with comprehensive guides and AI-powered explanations.',
              'व्यापक गाइड और AI-संचालित व्याख्याओं के साथ भारतीय चुनावी प्रणाली में महारत हासिल करें।'
            )}
          </p>
        </div>

        {/* Tabs */}
        <div className="learn-tabs" role="tablist" aria-label="Learning sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              className={`learn-tab ${activeTab === tab.id ? 'learn-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
            >
              <span aria-hidden="true">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Concepts Panel */}
        {activeTab === 'concepts' && (
          <div role="tabpanel" id="panel-concepts" aria-labelledby="tab-concepts" className="animate-fade-in">
            <div className="concepts-grid">
              {ELECTION_CONCEPTS.map((concept) => (
                <button
                  key={concept.id}
                  className={`concept-card glass-card ${selectedConcept?.id === concept.id ? 'concept-card--selected' : ''}`}
                  onClick={() => handleConceptClick(concept)}
                  aria-expanded={selectedConcept?.id === concept.id}
                  id={`concept-${concept.id}`}
                >
                  <span className="concept-card__category">{concept.category}</span>
                  <h3 className="concept-card__title">
                    {t(concept.title, concept.titleHi)}
                  </h3>
                  <p className="concept-card__desc">{concept.description}</p>
                  <div className="concept-card__facts">
                    {concept.facts.slice(0, 2).map((fact, i) => (
                      <span key={i} className="concept-card__fact">• {fact}</span>
                    ))}
                  </div>
                  <span className="concept-card__ai-badge">
                    🤖 {t('Click for AI explanation', 'AI व्याख्या के लिए क्लिक करें')}
                  </span>
                </button>
              ))}
            </div>

            {/* AI Explanation Modal */}
            {selectedConcept && (
              <div className="ai-explanation glass-card animate-scale-in" role="region" aria-label="AI Explanation">
                <div className="ai-explanation__header">
                  <h3>
                    <span aria-hidden="true">🤖</span>{' '}
                    {t('AI Explanation:', 'AI व्याख्या:')}{' '}
                    {t(selectedConcept.title, selectedConcept.titleHi)}
                  </h3>
                  <button
                    className="ai-explanation__close"
                    onClick={() => setSelectedConcept(null)}
                    aria-label="Close explanation"
                  >
                    ✕
                  </button>
                </div>
                <div className="ai-explanation__body">
                  {loading ? (
                    <div className="ai-explanation__loading">
                      <div className="loader" aria-label="Loading explanation"></div>
                      <p>{t('AI is preparing your explanation...', 'AI आपकी व्याख्या तैयार कर रहा है...')}</p>
                    </div>
                  ) : aiExplanation ? (
                    <div className="ai-explanation__text">{aiExplanation}</div>
                  ) : (
                    <div className="ai-explanation__text">{selectedConcept.description}</div>
                  )}

                  {/* Facts */}
                  <div className="ai-explanation__facts">
                    <h4>{t('Quick Facts', 'त्वरित तथ्य')}</h4>
                    <ul>
                      {selectedConcept.facts.map((fact, i) => (
                        <li key={i}>{fact}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Timeline Panel */}
        {activeTab === 'timeline' && (
          <div role="tabpanel" id="panel-timeline" aria-labelledby="tab-timeline" className="animate-fade-in">
            <div className="timeline">
              {ELECTION_PHASES.map((phase, i) => (
                <div key={phase.id} className={`timeline__item animate-fade-in-up stagger-${Math.min(i + 1, 5)}`}>
                  <div className="timeline__marker" aria-hidden="true">
                    <span className="timeline__icon">{phase.icon}</span>
                    {i < ELECTION_PHASES.length - 1 && <div className="timeline__line"></div>}
                  </div>
                  <div className="timeline__content glass-card">
                    <h3 className="timeline__title">
                      {t(phase.phase, phase.phaseHi)}
                    </h3>
                    <p className="timeline__desc">{phase.description}</p>
                    <p className="timeline__details">{phase.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Checklist Panel */}
        {activeTab === 'checklist' && (
          <div role="tabpanel" id="panel-checklist" aria-labelledby="tab-checklist" className="animate-fade-in">
            <div className="checklist-wrapper">
              {/* Progress */}
              <div className="checklist-progress glass-card">
                <h3>{t('Your Voter Readiness', 'आपकी मतदाता तैयारी')}</h3>
                <div className="progress-bar">
                  <div
                    className="progress-bar__fill"
                    style={{ width: `${(checkedCount / VOTER_CHECKLIST.length) * 100}%` }}
                    role="progressbar"
                    aria-valuenow={checkedCount}
                    aria-valuemin={0}
                    aria-valuemax={VOTER_CHECKLIST.length}
                  ></div>
                </div>
                <p className="checklist-progress__text">
                  {checkedCount}/{VOTER_CHECKLIST.length} {t('completed', 'पूर्ण')}
                </p>
                {allRequiredChecked && (
                  <div className="checklist-progress__ready animate-scale-in">
                    ✅ {t("You're ready to vote!", 'आप वोट देने के लिए तैयार हैं!')}
                  </div>
                )}
              </div>

              {/* Checklist Items */}
              <div className="checklist-items">
                {VOTER_CHECKLIST.map((item) => (
                  <label
                    key={item.id}
                    className={`checklist-item glass-card ${checkedItems[item.id] ? 'checklist-item--checked' : ''}`}
                    htmlFor={`check-${item.id}`}
                  >
                    <input
                      type="checkbox"
                      id={`check-${item.id}`}
                      checked={!!checkedItems[item.id]}
                      onChange={() => toggleChecklist(item.id)}
                      className="checklist-item__input"
                    />
                    <span className="checklist-item__checkbox" aria-hidden="true">
                      {checkedItems[item.id] ? '✅' : '⬜'}
                    </span>
                    <span className="checklist-item__text">
                      {t(item.text, item.textHi)}
                      {item.required && <span className="checklist-item__required">*</span>}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
