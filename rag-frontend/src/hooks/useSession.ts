import { useState, useEffect, useCallback } from 'react';
import { generateSessionId, saveSession, loadSession, clearSessionStorage } from '@utils/session';
import { clearSession as clearSessionAPI } from '@api/chat';

/**
 * Hook for managing chat session lifecycle
 * Handles session creation, persistence, and reset
 */
export const useSession = () => {
  const [sessionId, setSessionId] = useState<string>('');
  const [isReady, setIsReady] = useState<boolean>(false);

  // Initialize session on mount
  useEffect(() => {
    const initializeSession = () => {
      // Try to load existing session
      const existingSession = loadSession();

      if (existingSession) {
        console.log('📦 Loaded existing session:', existingSession.id);
        setSessionId(existingSession.id);
      } else {
        // Create new session
        const newSessionId = generateSessionId();
        console.log('✨ Created new session:', newSessionId);
        saveSession(newSessionId);
        setSessionId(newSessionId);
      }

      setIsReady(true);
    };

    initializeSession();
  }, []);

  /**
   * Reset session - clear backend and create new session
   */
  const resetSession = useCallback(async (): Promise<void> => {
    try {
      // Clear backend session if exists
      if (sessionId) {
        await clearSessionAPI(sessionId);
        console.log('🗑️ Cleared backend session:', sessionId);
      }
    } catch (error) {
      console.error('Failed to clear backend session:', error);
      // Continue with reset even if API call fails
    } finally {
      // Always create new session
      clearSessionStorage();
      const newSessionId = generateSessionId();
      saveSession(newSessionId);
      setSessionId(newSessionId);
      console.log('🔄 Reset to new session:', newSessionId);
    }
  }, [sessionId]);

  return {
    sessionId,
    isReady,
    resetSession
  };
};
