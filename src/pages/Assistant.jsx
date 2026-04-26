/**
 * VoteWise India — AI Assistant Page (Redesigned)
 * Gemini-powered election education chatbot
 * Better layout, smarter fallbacks, improved UX
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { sendMessage, startChatSession, initGemini } from '../services/geminiService';
import { STATE_SEATS, RAJYA_SABHA_SEATS, VIDHAN_SABHA_SEATS, ELECTION_CONCEPTS, VOTING_STEPS } from '../data/electionData';
import './Assistant.css';

const QUICK_ACTIONS = [
  { label: 'How to register to vote?', labelHi: 'वोट के लिए पंजीकरण कैसे करें?', icon: '📝' },
  { label: 'What is EVM?', labelHi: 'EVM क्या है?', icon: '🗳️' },
  { label: 'What is NOTA?', labelHi: 'NOTA क्या है?', icon: '❌' },
  { label: 'Voter eligibility rules', labelHi: 'मतदाता पात्रता नियम', icon: '👤' },
  { label: 'Rajya Sabha seats in Bihar?', labelHi: 'बिहार में राज्यसभा सीटें?', icon: '🏛️' },
  { label: 'What is VVPAT?', labelHi: 'VVPAT क्या है?', icon: '📄' },
];

/**
 * Enhanced fallback that uses local election data
 */
function getSmartFallback(message) {
  const lower = message.toLowerCase();

  // Check for state seat queries
  for (const [state, lokSabhaSeats] of Object.entries(STATE_SEATS)) {
    const stateLower = state.toLowerCase();
    const stateShort = stateLower.split(' ')[0]; // "uttar" for "uttar pradesh"
    if (lower.includes(stateLower) || lower.includes(stateShort)) {
      if (lower.includes('seat') || lower.includes('सीट') || lower.includes('kitna') || lower.includes('kitni') || lower.includes('how many')) {
        
        // Handle Rajya Sabha queries
        if (lower.includes('rajya') || lower.includes('राज्य')) {
          const rsSeats = RAJYA_SABHA_SEATS[state];
          if (rsSeats) {
            return `🏛️ **${state}** has **${rsSeats} Rajya Sabha seats** in the Indian Parliament.\n\nRajya Sabha (Council of States) has a total maximum capacity of 250 members, currently 245. Members are elected by the State Legislative Assemblies.\n\n💡 **Did you know?** Uttar Pradesh has the highest number of Rajya Sabha seats (31), followed by Maharashtra (19).`;
          }
        }
        
        // Handle Vidhan Sabha (State Assembly) queries
        if (lower.includes('vidhan') || lower.includes('assembly') || lower.includes('विधान')) {
          const vsSeats = VIDHAN_SABHA_SEATS[state];
          if (vsSeats) {
            return `🏛️ **${state}** has **${vsSeats} Vidhan Sabha (State Assembly) seats**.\n\nMembers of the Legislative Assembly (MLAs) are directly elected by the voters of the state.\n\n💡 **Did you know?** Uttar Pradesh has the largest State Assembly with 403 seats!`;
          }
        }

        // Default to Lok Sabha if not specified
        return `🏛️ **${state}** has **${lokSabhaSeats} Lok Sabha seats** in the Indian Parliament.\n\nFor reference:\n• Rajya Sabha seats: **${RAJYA_SABHA_SEATS[state] || 'N/A'}**\n• Vidhan Sabha seats: **${VIDHAN_SABHA_SEATS[state] || 'N/A'}**\n\nThe total number of Lok Sabha constituencies in India is **543**.\n\n💡 **Did you know?** Uttar Pradesh has the highest number of Lok Sabha seats (80), followed by Maharashtra (48).`;
      }
    }
  }

  // Total seats query
  if ((lower.includes('total') || lower.includes('kitni') || lower.includes('कुल')) && (lower.includes('seat') || lower.includes('सीट'))) {
    if (lower.includes('rajya') || lower.includes('राज्य')) {
       return `🏛️ The **Rajya Sabha** has a total of **245 seats** currently (Maximum capacity is 250).\n\n**Top 5 states by seats:**\n• Uttar Pradesh — 31\n• Maharashtra — 19\n• Tamil Nadu — 18\n• Bihar — 16\n• West Bengal — 16`;
    }
    const total = Object.values(STATE_SEATS).reduce((a, b) => a + b, 0);
    return `🏛️ The **Lok Sabha** has a total of **${total} seats** (constituencies).\n\n**Top 5 states by seats:**\n• Uttar Pradesh — 80\n• Maharashtra — 48\n• West Bengal — 42\n• Bihar — 40\n• Tamil Nadu — 39\n\n💡 Each constituency elects one Member of Parliament (MP) through direct election.`;
  }

  // Check for election concept queries
  for (const concept of ELECTION_CONCEPTS) {
    if (lower.includes(concept.id) || lower.includes(concept.title.toLowerCase())) {
      return `📖 **${concept.title}** (${concept.titleHi})\n\n${concept.description}\n\n**Key Facts:**\n${concept.facts.map(f => `• ${f}`).join('\n')}\n\n💡 Want to learn more? Check out our **Learn** section for detailed explanations!`;
    }
  }

  // Common queries
  if (lower.includes('register') || lower.includes('registration') || lower.includes('पंजीकरण')) {
    return "📝 **How to Register as a Voter:**\n\n**Step 1:** Visit the NVSP portal → **voters.eci.gov.in**\n**Step 2:** Fill **Form 6** for new voter registration\n**Step 3:** Upload documents — age proof, address proof, passport photo\n**Step 4:** Submit and note your reference number\n**Step 5:** A BLO (Booth Level Officer) will verify your details at home\n\n**Required Documents:**\n• Age proof (Birth certificate / School certificate)\n• Address proof (Aadhaar / Utility bill)\n• 2 passport-size photographs\n\n💡 **Tip:** You can also register through the **Voter Helpline App** on Android/iOS for a faster process!";
  }

  if (lower.includes('evm') || lower.includes('voting machine') || lower.includes('ईवीएम')) {
    return "🗳️ **Electronic Voting Machine (EVM)**\n\nEVMs have been used in Indian elections since **1982**.\n\n**How it works:**\n• Two units — **Control Unit** (with polling officer) and **Ballot Unit** (in voting compartment)\n• Press the button next to your candidate's name and symbol\n• A **beep** confirms your vote\n• The machine **locks** after each vote\n\n**Key Facts:**\n• Standalone device — **not connected to any network**\n• Battery operated — works **without electricity**\n• Can record up to **3,840 votes**\n• First used in Kerala (1982)\n\n💡 Since 2019, every EVM is paired with a **VVPAT** machine for paper verification!";
  }

  if (lower.includes('nota') || lower.includes('none of the above') || lower.includes('नोटा')) {
    return "❌ **NOTA (None of the Above)**\n\nNOTA was introduced by the **Supreme Court** in September 2013 (PUCL vs Union of India case).\n\n**Key Points:**\n• Appears as the **last option** on the EVM ballot\n• Allows voters to **officially reject all candidates**\n• NOTA votes are **counted** but currently don't affect election results\n• Even if NOTA gets the most votes, the candidate with the highest count wins\n• Over **1.5 crore NOTA votes** were cast in the 2019 elections\n\n💡 NOTA is your democratic right to express disapproval while still participating in the process!";
  }

  if (lower.includes('eligib') || lower.includes('who can vote') || lower.includes('पात्रता') || lower.includes('kaun vote') || lower.includes('age')) {
    return "👤 **Voter Eligibility in India**\n\n**You CAN vote if:**\n✅ You are an **Indian citizen**\n✅ You are **18 years or older** (as of Jan 1 of the qualifying year)\n✅ You are **registered** in the electoral roll\n✅ You are of **sound mind**\n\n**You CANNOT vote if:**\n❌ You are a non-citizen\n❌ You are below 18 years\n❌ You are disqualified under any election law\n\n**Important Article:**\n📜 **Article 326** of the Indian Constitution guarantees universal adult suffrage.\n\n💡 Check your registration status at **voters.eci.gov.in**";
  }

  if (lower.includes('vvpat') || lower.includes('paper')) {
    return "📄 **VVPAT (Voter Verifiable Paper Audit Trail)**\n\nVVPAT is an independent system attached to the EVM that lets voters **verify their vote**.\n\n**How it works:**\n1. You press a button on the EVM\n2. VVPAT displays a **printed slip** with the candidate's name & symbol\n3. The slip is visible for **7 seconds**\n4. It then drops into a **sealed box**\n\n**Key Facts:**\n• Introduced in **2013**\n• Mandatory since **2019** general elections\n• **5 random VVPAT** verifications per constituency\n• If slip doesn't match your vote — **inform the Presiding Officer immediately**\n\n💡 VVPAT adds an extra layer of transparency to the electronic voting process!";
  }

  if (lower.includes('mcc') || lower.includes('model code') || lower.includes('आचार संहिता')) {
    return "📜 **Model Code of Conduct (MCC)**\n\nThe MCC is a set of guidelines by the ECI for political parties and candidates.\n\n**When does it apply?**\n• Comes into effect **immediately** when election dates are announced\n• Remains in force until **results are declared**\n\n**Key Rules:**\n• No use of **government machinery** for campaigning\n• No **religious or communal** appeals for votes\n• Campaign must stop **48 hours before polling**\n• No **opinion polls** 48 hours before voting\n• **Equal access** to public spaces for all parties\n\n💡 Violations can be reported through the **cVIGIL app**!";
  }

  if (lower.includes('hello') || lower.includes('hi ') || lower.includes('hey') || lower.includes('namaste') || lower.includes('नमस्ते')) {
    return "🙏 **Namaste! Welcome to VoteWise AI!**\n\nI'm your election education assistant. I can help you with:\n\n📝 **Registration** — How to become a registered voter\n🗳️ **Voting Process** — Complete step-by-step guide\n💻 **EVM & VVPAT** — How voting machines work\n⚖️ **Your Rights** — NOTA, postal ballot, and more\n🏛️ **Constituency Info** — Lok Sabha seats per state\n📅 **Election Phases** — Timeline and key dates\n\nJust type your question and I'll help! 😊";
  }

  // Generic fallback
  return "🙏 **I'm VoteWise AI, your election education assistant!**\n\nI can help you with:\n\n• **\"How many seats in Bihar?\"** — Constituency info\n• **\"How to register to vote?\"** — Registration guide\n• **\"What is EVM?\"** — Voting machine explained\n• **\"What is NOTA?\"** — Your right to reject\n• **\"Voter eligibility\"** — Who can vote\n• **\"What is VVPAT?\"** — Paper audit trail\n\n💡 Try asking a specific question!\n\n⚠️ *For full AI-powered responses, please configure your Gemini API key in the `.env` file.*";
}

export default function Assistant() {
  const { t, language } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  // Initialize on mount
  useEffect(() => {
    initGemini();
    startChatSession();

    setMessages([{
      role: 'assistant',
      content: language === 'hi'
        ? '🙏 **नमस्ते! VoteWise AI में आपका स्वागत है!**\n\nमैं आपका चुनाव शिक्षा सहायक हूं। मुझसे भारतीय चुनावों के बारे में कुछ भी पूछें!\n\n• 📝 मतदाता पंजीकरण कैसे करें\n• 🗳️ EVM और VVPAT कैसे काम करते हैं\n• 🏛️ किसी भी राज्य की लोक सभा सीटें\n• ⚖️ NOTA और आपके अधिकार\n\nबस अपना सवाल टाइप करें! 😊'
        : '🙏 **Namaste! Welcome to VoteWise AI!**\n\nI\'m your election education assistant. Ask me anything about Indian elections!\n\n• 📝 How to register as a voter\n• 🗳️ How EVM & VVPAT work\n• 🏛️ Lok Sabha seats in any state\n• ⚖️ NOTA and your rights\n\nJust type your question below! 😊',
      timestamp: new Date(),
    }]);
  }, []);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Auto-resize textarea
  const handleInputChange = (e) => {
    setInput(e.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  const handleSend = useCallback(async (text = null) => {
    const messageText = text || input.trim();
    if (!messageText || isTyping) return;

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    setIsTyping(true);

    try {
      const response = await sendMessage(messageText);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }]);
    } catch (error) {
      // Use smart fallback
      const fallback = getSmartFallback(messageText);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: fallback,
        timestamp: new Date(),
      }]);
    }

    setIsTyping(false);
    inputRef.current?.focus();
  }, [input, isTyping]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (action) => {
    const text = language === 'hi' ? action.labelHi : action.label;
    handleSend(text);
  };

  const formatMessage = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^• /gm, '<span class="chat-bullet">•</span> ')
      .replace(/\n/g, '<br/>');
  };

  const showQuickActions = messages.length <= 1;

  return (
    <main className="assistant-page" id="main-content">
      <div className="chat-container">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-header__left">
            <div className="chat-header__avatar" aria-hidden="true">
              <span>🤖</span>
              <span className="chat-header__online"></span>
            </div>
            <div>
              <h1 className="chat-header__name">VoteWise AI</h1>
              <p className="chat-header__status-text">
                {isTyping
                  ? t('Typing...', 'टाइप कर रहा है...')
                  : t('Online • Powered by Gemini', 'ऑनलाइन • Gemini द्वारा संचालित')
                }
              </p>
            </div>
          </div>
          <span className="chat-header__tag">
            {t('Non-Partisan', 'निष्पक्ष')}
          </span>
        </div>

        {/* Messages Area */}
        <div className="chat-messages" role="log" aria-label="Chat messages" aria-live="polite">
          {messages.map((msg, i) => (
            <div key={i} className={`msg msg--${msg.role}`}>
              {msg.role === 'assistant' && (
                <div className="msg__avatar" aria-hidden="true">🤖</div>
              )}
              <div className="msg__content">
                <div
                  className="msg__bubble"
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                />
                <span className="msg__time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="msg msg--assistant">
              <div className="msg__avatar" aria-hidden="true">🤖</div>
              <div className="msg__content">
                <div className="msg__bubble msg__bubble--typing">
                  <div className="typing-dots" aria-label="AI is thinking">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* Quick Actions */}
        {showQuickActions && (
          <div className="quick-actions">
            {QUICK_ACTIONS.map((action, i) => (
              <button
                key={i}
                className="quick-btn"
                onClick={() => handleQuickAction(action)}
              >
                <span aria-hidden="true">{action.icon}</span>
                {t(action.label, action.labelHi)}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="chat-input-bar">
          <div className="chat-input-wrap">
            <textarea
              ref={(el) => { textareaRef.current = el; inputRef.current = el; }}
              className="chat-textarea"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={t('Ask about Indian elections...', 'भारतीय चुनावों के बारे में पूछें...')}
              rows={1}
              disabled={isTyping}
              aria-label="Type your message"
              id="chat-input"
            />
            <button
              className="chat-send-btn"
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
              id="chat-send-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 2L11 13"></path>
                <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
              </svg>
            </button>
          </div>
          <p className="chat-disclaimer">
            {t('Educational information only. Verify with ECI.', 'केवल शैक्षिक जानकारी। ECI से सत्यापित करें।')}
          </p>
        </div>
      </div>
    </main>
  );
}
