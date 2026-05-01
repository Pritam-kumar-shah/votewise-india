/**
 * Test setup for Vitest + React Testing Library
 */

import '@testing-library/jest-dom';

// Mock scrollIntoView for jsdom (not implemented in jsdom)
Element.prototype.scrollIntoView = () => {};
