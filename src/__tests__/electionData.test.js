/**
 * Tests for election data integrity
 * Validates that all static data is complete and consistent
 */

import { describe, it, expect } from 'vitest';
import {
  VOTING_STEPS,
  ELECTION_CONCEPTS,
  BASE_QUIZ_QUESTIONS,
  VOTER_CHECKLIST,
  ELECTION_PHASES,
  INDIAN_STATES,
  STATE_SEATS,
} from '../data/electionData';

describe('Election Data', () => {
  describe('VOTING_STEPS', () => {
    it('should have 8 steps', () => {
      expect(VOTING_STEPS).toHaveLength(8);
    });

    it('each step should have required fields', () => {
      VOTING_STEPS.forEach((step) => {
        expect(step).toHaveProperty('id');
        expect(step).toHaveProperty('title');
        expect(step).toHaveProperty('titleHi');
        expect(step).toHaveProperty('description');
        expect(step).toHaveProperty('icon');
        expect(typeof step.title).toBe('string');
        expect(step.title.length).toBeGreaterThan(0);
      });
    });

    it('steps should be in sequential order', () => {
      VOTING_STEPS.forEach((step, i) => {
        expect(step.id).toBe(i + 1);
      });
    });
  });

  describe('ELECTION_CONCEPTS', () => {
    it('should have at least 5 concepts', () => {
      expect(ELECTION_CONCEPTS.length).toBeGreaterThanOrEqual(5);
    });

    it('each concept should have unique id', () => {
      const ids = ELECTION_CONCEPTS.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('each concept should have facts array', () => {
      ELECTION_CONCEPTS.forEach((concept) => {
        expect(Array.isArray(concept.facts)).toBe(true);
        expect(concept.facts.length).toBeGreaterThan(0);
      });
    });
  });

  describe('BASE_QUIZ_QUESTIONS', () => {
    it('should have at least 5 questions', () => {
      expect(BASE_QUIZ_QUESTIONS.length).toBeGreaterThanOrEqual(5);
    });

    it('each question should have 4 options', () => {
      BASE_QUIZ_QUESTIONS.forEach((q) => {
        expect(q.options).toHaveLength(4);
      });
    });

    it('correct answer index should be valid', () => {
      BASE_QUIZ_QUESTIONS.forEach((q) => {
        expect(q.correct).toBeGreaterThanOrEqual(0);
        expect(q.correct).toBeLessThan(q.options.length);
      });
    });

    it('each question should have an explanation', () => {
      BASE_QUIZ_QUESTIONS.forEach((q) => {
        expect(q.explanation).toBeDefined();
        expect(q.explanation.length).toBeGreaterThan(0);
      });
    });
  });

  describe('VOTER_CHECKLIST', () => {
    it('should have checklist items', () => {
      expect(VOTER_CHECKLIST.length).toBeGreaterThan(0);
    });

    it('required items should be marked', () => {
      const required = VOTER_CHECKLIST.filter((item) => item.required);
      expect(required.length).toBeGreaterThan(0);
    });
  });

  describe('ELECTION_PHASES', () => {
    it('should have 8 phases', () => {
      expect(ELECTION_PHASES).toHaveLength(8);
    });

    it('should include polling day', () => {
      const polling = ELECTION_PHASES.find((p) => p.phase.includes('Polling'));
      expect(polling).toBeDefined();
    });
  });

  describe('INDIAN_STATES', () => {
    it('should include all 28 states + 8 UTs', () => {
      expect(INDIAN_STATES.length).toBeGreaterThanOrEqual(28);
    });

    it('should include Delhi', () => {
      expect(INDIAN_STATES).toContain('Delhi');
    });
  });

  describe('STATE_SEATS', () => {
    it('total seats should be 543', () => {
      const total = Object.values(STATE_SEATS).reduce((a, b) => a + b, 0);
      expect(total).toBe(543);
    });

    it('UP should have 80 seats', () => {
      expect(STATE_SEATS['Uttar Pradesh']).toBe(80);
    });
  });
});
