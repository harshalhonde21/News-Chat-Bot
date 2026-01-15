import { useState, KeyboardEvent, ChangeEvent, useRef, useEffect } from "react";
import styles from "./ChatInput.module.scss";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

/**
 * Chat input component with multi-line support and keyboard shortcuts
 */
const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Auto-focus on mount
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSend(trimmedMessage);
      setMessage("");

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className={styles.inputContainer}>
      <div className={styles.wrapper}>
        <div className={styles.textareaWrapper}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            disabled={disabled}
            rows={1}
          />
          <span className={styles.hint}>
            Press Enter to send, Shift+Enter for new line
          </span>
        </div>

        <button
          className={styles.sendButton}
          onClick={handleSend}
          disabled={disabled || !message.trim()}
        >
          {disabled ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
