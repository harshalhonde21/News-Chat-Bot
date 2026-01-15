/**
 * Application-wide constants
 */

// API Endpoints
export const API_ENDPOINTS = {
  CHAT: '/api/chat',
  HISTORY: '/api/history',
  SESSION: '/api/session',
  HEALTH: '/health'
} as const;

// LocalStorage Keys
export const STORAGE_KEYS = {
  SESSION_ID: 'chatSessionId'
} as const;

// Timeouts (in milliseconds)
export const TIMEOUTS = {
  API_REQUEST: 30000, // 30 seconds
  TYPING_INDICATOR_MIN: 500 // minimum time to show typing indicator
} as const;

// Animation Durations (in seconds)
export const ANIMATION_DURATION = {
  MESSAGE_ENTER: 0.3,
  FADE_IN: 0.2,
  TYPING_DOT: 0.4
} as const;

// UI Constants
export const UI_CONSTANTS = {
  MAX_MESSAGE_LENGTH: 5000,
  SCROLL_BEHAVIOR: 'smooth' as ScrollBehavior
} as const;

// Example Questions
export const EXAMPLE_QUESTIONS = [
  "What are the latest news about technology?",
  "Tell me about recent developments in AI",
  "What's happening in the financial markets?",
  "Give me updates on global events"
] as const;
