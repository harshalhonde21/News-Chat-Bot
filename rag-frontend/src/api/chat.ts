import apiClient from './client';
import type { ChatResponse, HistoryResponse, ChatRequest, HistoryApiResponse } from '@/types';
import { API_ENDPOINTS } from '@utils/constants';

/**
 * Send a chat message and get AI response
 */
export const sendMessage = async (
  sessionId: string,
  message: string
): Promise<ChatResponse> => {
  const payload: ChatRequest = {
    sessionId,
    message
  };

  const response = await apiClient.post<ChatResponse>(
    API_ENDPOINTS.CHAT,
    payload
  );

  return response.data;
};

/**
 * Get chat history for a specific session
 */
export const getChatHistory = async (
  sessionId: string
): Promise<HistoryResponse[]> => {
  const response = await apiClient.get<HistoryApiResponse>(
    `${API_ENDPOINTS.HISTORY}/${sessionId}`
  );

  // Extract messages array from wrapped response
  return response.data.messages;
};

/**
 * Clear/delete a chat session
 */
export const clearSession = async (sessionId: string): Promise<void> => {
  await apiClient.delete(`${API_ENDPOINTS.SESSION}/${sessionId}`);
};

/**
 * Check backend health status
 */
export const checkHealth = async (): Promise<{ status: string }> => {
  const response = await apiClient.get<{ status: string }>(
    API_ENDPOINTS.HEALTH
  );

  return response.data;
};
