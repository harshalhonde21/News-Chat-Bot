import { v4 as uuidv4 } from 'uuid';
import { STORAGE_KEYS } from './constants';
import type { Session } from '@/types';

/**
 * Generate a new unique session ID
 */
export const generateSessionId = (): string => {
  return uuidv4();
};

/**
 * Save session to localStorage
 */
export const saveSession = (sessionId: string): void => {
  try {
    const session: Session = {
      id: sessionId,
      createdAt: Date.now()
    };
    localStorage.setItem(STORAGE_KEYS.SESSION_ID, JSON.stringify(session));
  } catch (error) {
    console.error('Failed to save session to localStorage:', error);
  }
};

/**
 * Load session from localStorage
 */
export const loadSession = (): Session | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
    if (!stored) return null;

    const session: Session = JSON.parse(stored);

    // Validate session structure
    if (!session.id || typeof session.id !== 'string') {
      console.warn('Invalid session found in localStorage');
      clearSessionStorage();
      return null;
    }

    return session;
  } catch (error) {
    console.error('Failed to load session from localStorage:', error);
    clearSessionStorage();
    return null;
  }
};

/**
 * Clear session from localStorage
 */
export const clearSessionStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.SESSION_ID);
  } catch (error) {
    console.error('Failed to clear session from localStorage:', error);
  }
};

/**
 * Format timestamp to readable time
 */
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};
