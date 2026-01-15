/**
 * Core type definitions for the RAG chatbot application
 */

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatResponse {
  answer: string;
  sources?: Array<{
    id?: string;
    content?: string;
    metadata?: Record<string, unknown>;
  }>;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface Session {
  id: string;
  createdAt: number;
}

export interface ChatRequest {
  sessionId: string;
  message: string;
}

export interface HistoryResponse {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface HistoryApiResponse {
  success: boolean;
  sessionId: string;
  messages: HistoryResponse[];
  messageCount: number;
  ttl: number;
  ttlMinutes: number;
}
