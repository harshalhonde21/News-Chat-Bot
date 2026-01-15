import { useState, useEffect } from 'react';
import { getChatHistory } from '@api/chat';
import type { ChatMessage, HistoryResponse } from '@/types';

/**
 * Hook to load chat history on mount
 */
export const useChatHistory = (sessionId: string, isReady: boolean) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady || !sessionId) return;

    const loadHistory = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const history = await getChatHistory(sessionId);

        // Convert HistoryResponse to ChatMessage format
        const formattedMessages: ChatMessage[] = history.map((msg: HistoryResponse) => ({
          role: msg.role,
          content: msg.content,
          // Use backend timestamp if available, otherwise use current time
          timestamp: msg.timestamp ? new Date(msg.timestamp).getTime() : Date.now()
        }));

        setMessages(formattedMessages);
        console.log('📜 Loaded chat history:', formattedMessages.length, 'messages');
      } catch (err) {
        console.error('Failed to load chat history:', err);
        // Don't set error - just start with empty messages
        setError(null);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [sessionId, isReady]);

  return {
    messages,
    setMessages,
    isLoading,
    error
  };
};
