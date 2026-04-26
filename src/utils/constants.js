/**
 * VoteWise India — App Constants
 * @module constants
 */

export const APP_NAME = 'VoteWise India';
export const APP_TAGLINE = 'Your AI-Powered Election Education Companion';
export const APP_VERSION = '1.0.0';

export const NAV_LINKS = [
  { path: '/', label: 'Home', labelHi: 'होम', icon: '🏠' },
  { path: '/learn', label: 'Learn', labelHi: 'सीखें', icon: '📚' },
  { path: '/simulate', label: 'Simulator', labelHi: 'सिम्युलेटर', icon: '🗳️' },
  { path: '/quiz', label: 'Quiz', labelHi: 'क्विज़', icon: '❓' },
  { path: '/booth-finder', label: 'Find Booth', labelHi: 'बूथ खोजें', icon: '📍' },
  { path: '/assistant', label: 'AI Chat', labelHi: 'AI चैट', icon: '🤖' },
];

/** Language options */
export const LANGUAGES = {
  en: { label: 'English', flag: '🇬🇧' },
  hi: { label: 'हिंदी', flag: '🇮🇳' },
};

/** Accessibility defaults */
export const A11Y_DEFAULTS = {
  fontSize: 'normal', // 'normal' | 'large' | 'x-large'
  contrast: 'normal', // 'normal' | 'high'
  reducedMotion: false,
};
