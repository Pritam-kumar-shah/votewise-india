/**
 * VoteWise India — Gemini AI Service
 * Handles all interactions with Google Gemini API
 * @module geminiService
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

/** System prompt for election education persona */
const SYSTEM_PROMPT = `You are VoteWise AI — an expert, friendly, and unbiased election education assistant for Indian voters. Your role:

PERSONA:
- You are knowledgeable about Indian electoral system, ECI guidelines, and democratic processes
- You speak in simple, clear language accessible to all education levels
- You are STRICTLY NON-PARTISAN — never favor or oppose any political party or candidate
- You encourage democratic participation and voter awareness

CAPABILITIES:
- Explain voting procedures, eligibility, and registration
- Clarify election concepts (EVM, VVPAT, NOTA, MCC, etc.)
- Guide users through voter registration process
- Answer questions about the Indian Constitution related to elections
- Explain different types of elections (Lok Sabha, Rajya Sabha, State Assembly, Local Body)
- Help understand election results and terminology

RULES:
1. NEVER express political opinions or party preferences
2. NEVER discourage voting or democratic participation
3. Always cite official sources (ECI, Constitution) when possible
4. If asked about a specific candidate/party, only provide factual public information
5. For voter registration, always direct to official ECI portal (voters.eci.gov.in)
6. Keep responses concise but informative (2-3 paragraphs max)
7. Use Hindi terms in parentheses where helpful
8. If unsure, say so honestly and direct to official sources

RESPONSE FORMAT:
- Use bullet points for lists
- Bold key terms
- Include relevant article/section numbers when discussing laws
- End with a helpful tip or next step when appropriate`;

let genAI = null;
let model = null;
let chatSession = null;

/**
 * Initialize the Gemini AI client
 * @returns {boolean} Whether initialization was successful
 */
export function initGemini() {
  if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
    console.warn('[VoteWise] Gemini API key not configured. AI features will use fallback responses.');
    return false;
  }

  try {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_PROMPT,
    });
    return true;
  } catch (error) {
    console.error('[VoteWise] Failed to initialize Gemini:', error);
    return false;
  }
}

/**
 * Start a new chat session with Gemini
 * @returns {object} Chat session
 */
export function startChatSession() {
  if (!model) {
    initGemini();
  }

  if (model) {
    chatSession = model.startChat({
      history: [],
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 1024,
      },
    });
  }

  return chatSession;
}

/**
 * Send a message to the AI assistant
 * @param {string} message - User's message
 * @returns {Promise<string>} AI response text
 */
export async function sendMessage(message) {
  // Input sanitization
  const sanitizedMessage = sanitizeInput(message);

  if (!chatSession) {
    startChatSession();
  }

  if (!chatSession) {
    // Throw so the caller can use its own smart fallback
    throw new Error('Gemini not configured');
  }

  try {
    const result = await chatSession.sendMessage(sanitizedMessage);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('[VoteWise] Gemini API error:', error);
    throw error; // Let caller handle with smart fallback
  }
}

/**
 * Generate quiz questions using AI
 * @param {string} topic - Topic for quiz generation
 * @param {number} count - Number of questions
 * @returns {Promise<Array>} Array of quiz questions
 */
export async function generateQuizQuestions(topic, count = 5) {
  if (!model) {
    initGemini();
  }

  if (!model) {
    return null; // Will use static questions as fallback
  }

  const prompt = `Generate ${count} multiple-choice quiz questions about "${topic}" related to Indian elections and voting. 
  
  Return as JSON array with this exact format:
  [
    {
      "question": "question text",
      "questionHi": "question in Hindi",
      "options": ["option1", "option2", "option3", "option4"],
      "correct": 0,
      "explanation": "brief explanation"
    }
  ]
  
  Rules:
  - Questions should be factual and educational
  - Include a mix of easy and medium difficulty
  - correct is the 0-based index of the correct option
  - Keep explanations under 2 sentences
  - Focus on Indian election process and ECI guidelines`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.error('[VoteWise] Quiz generation error:', error);
    return null;
  }
}

/**
 * Get AI explanation for an election concept
 * @param {string} concept - The concept to explain
 * @param {string} language - 'en' or 'hi'
 * @returns {Promise<string>} Explanation text
 */
export async function explainConcept(concept, language = 'en') {
  if (!model) {
    initGemini();
  }

  if (!model) {
    return null;
  }

  const langInstructions = language === 'hi' 
    ? 'Respond in Hindi using Devanagari script. Keep it simple and educational.'
    : 'Respond in simple English. Keep it accessible for all education levels.';

  const prompt = `Explain the following Indian election concept in 2-3 short paragraphs: "${concept}". ${langInstructions}. Include one interesting fact.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('[VoteWise] Concept explanation error:', error);
    return null;
  }
}

/**
 * Sanitize user input to prevent injection
 * @param {string} input - Raw user input
 * @returns {string} Sanitized input
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .slice(0, 1000) // Limit input length
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>'"]/g, (char) => {
      const entities = { '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' };
      return entities[char] || char;
    });
}

/**
 * Fallback responses when Gemini is unavailable
 * @param {string} message - User's message
 * @returns {string} Fallback response
 */
function getFallbackResponse(message) {
  const lower = message.toLowerCase();
  
  if (lower.includes('register') || lower.includes('registration') || lower.includes('पंजीकरण')) {
    return "📝 **Voter Registration Guide:**\n\n1. Visit the NVSP portal: **voters.eci.gov.in**\n2. Fill **Form 6** for new registration\n3. Upload required documents (age proof, address proof, photo)\n4. Submit and note your reference number\n5. A BLO (Booth Level Officer) will verify your details\n\n💡 **Tip:** You can also use the **Voter Helpline App** on your smartphone for easy registration!";
  }
  
  if (lower.includes('evm') || lower.includes('voting machine')) {
    return "🗳️ **Electronic Voting Machine (EVM):**\n\nEVMs have been used in Indian elections since 1982. Key points:\n\n• **Two units:** Control Unit (with polling officer) and Ballot Unit (in voting compartment)\n• **Standalone device:** Not connected to any network — cannot be hacked remotely\n• **Battery operated:** Works without electricity\n• **One vote:** Locks after each vote, preventing multiple votes\n\n💡 **Tip:** Since 2019, every EVM is paired with a **VVPAT** machine for paper verification!";
  }
  
  if (lower.includes('nota') || lower.includes('none of the above')) {
    return "❌ **NOTA (None of the Above):**\n\nNOTA was introduced by the **Supreme Court of India** in September 2013 (PUCL vs Union of India case).\n\n• It appears as the **last option** on the EVM\n• Allows voters to **officially reject** all candidates\n• NOTA votes are **counted** but currently don't affect election results\n• Over **1.5 crore** NOTA votes were cast in the 2019 general elections\n\n💡 NOTA is your democratic right to express disapproval while still participating in the election!";
  }
  
  if (lower.includes('eligib') || lower.includes('who can vote') || lower.includes('पात्रता')) {
    return "👤 **Voter Eligibility in India:**\n\n✅ You can vote if:\n• You are an **Indian citizen**\n• You are **18 years or older** (as of Jan 1 of the qualifying year)\n• You are **registered** as a voter in your constituency\n• You are of **sound mind** and not disqualified by law\n\n❌ You cannot vote if:\n• You are a non-citizen\n• You are below 18 years of age\n• You have been disqualified under any election law\n\n💡 **Tip:** Check your registration status at **voters.eci.gov.in**";
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('नमस्ते')) {
    return "🙏 **Namaste! Welcome to VoteWise AI!**\n\nI'm your election education assistant. I can help you with:\n\n• 📝 Voter registration process\n• 🗳️ Understanding EVM & VVPAT\n• 📍 Finding your constituency\n• 📅 Election phases & timeline\n• ❓ Any questions about Indian elections\n\nWhat would you like to know? Ask me anything about the Indian electoral process!";
  }
  
  return "🙏 I'm VoteWise AI, your election education assistant!\n\nI can help you understand:\n• **Voter registration** — How to register and required documents\n• **Voting process** — Step-by-step guide for election day\n• **EVM & VVPAT** — How voting machines work\n• **Your rights** — NOTA, postal ballot, and more\n• **Election rules** — MCC, election phases, and procedures\n\n💡 Try asking specific questions like *\"How do I register to vote?\"* or *\"What is NOTA?\"*\n\n⚠️ *Note: I provide educational information only. I never express political opinions or party preferences.*";
}
