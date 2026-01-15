import { useState } from "react";
import { useSession } from "@hooks/useSession";
import { useChatHistory } from "@hooks/useChatHistory";
import { useAutoScroll } from "@hooks/useAutoScroll";
import { sendMessage } from "@api/chat";
import type { ChatMessage as ChatMessageType } from "@/types";
import Header from "@components/Header/Header";
import ChatMessage from "@components/ChatMessage/ChatMessage";
import ChatInput from "@components/ChatInput/ChatInput";
import EmptyState from "@components/EmptyState/EmptyState";
import TypingIndicator from "@components/TypingIndicator/TypingIndicator";
import styles from "./Chat.module.scss";

/**
 * Main chat page component
 */
const Chat = () => {
  const { sessionId, isReady, resetSession } = useSession();
  const {
    messages,
    setMessages,
    isLoading: isLoadingHistory,
  } = useChatHistory(sessionId, isReady);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);

  const scrollRef = useAutoScroll(messages);

  /**
   * Handle sending a message
   */
  const handleSendMessage = async (message: string) => {
    if (!sessionId || isLoading) return;

    // Add user message optimistically
    const userMessage: ChatMessageType = {
      role: "user",
      content: message,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Call API
      const response = await sendMessage(sessionId, message);

      // Add assistant response
      const assistantMessage: ChatMessageType = {
        role: "assistant",
        content: response.answer,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsConnected(true);
    } catch (err: unknown) {
      console.error("Failed to send message:", err);

      // Set error state
      const errorMessage =
        (err as { message?: string })?.message || "Failed to send message";
      setError(errorMessage);
      setIsConnected(false);

      // Remove optimistic user message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle clicking example question
   */
  const handleQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  /**
   * Handle reset
   */
  const handleReset = async () => {
    await resetSession();
    setMessages([]);
    setError(null);
    setIsConnected(true);
  };

  /**
   * Handle retry after error
   */
  const handleRetry = () => {
    setError(null);
    setIsConnected(true);
  };

  return (
    <div className={styles.chat}>
      <Header onReset={handleReset} isConnected={isConnected} />

      <div className={styles.messagesContainer} ref={scrollRef}>
        {error && (
          <div className={styles.errorBanner}>
            <div className={styles.errorText}>{error}</div>
            <button className={styles.retryButton} onClick={handleRetry}>
              Dismiss
            </button>
          </div>
        )}

        <div className={styles.messagesList}>
          {!isLoadingHistory && messages.length === 0 ? (
            <EmptyState onQuestionClick={handleQuestionClick} />
          ) : (
            messages.map((msg, index) => (
              <ChatMessage key={`${msg.timestamp}-${index}`} message={msg} />
            ))
          )}
        </div>

        {isLoading && (
          <div className={styles.typingWrapper}>
            <TypingIndicator />
          </div>
        )}
      </div>

      <ChatInput onSend={handleSendMessage} disabled={isLoading || !isReady} />
    </div>
  );
};

export default Chat;
