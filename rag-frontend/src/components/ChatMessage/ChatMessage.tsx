import { motion } from "framer-motion";
import type { ChatMessage as ChatMessageType } from "@/types";
import { formatTime } from "@utils/session";
import styles from "./ChatMessage.module.scss";

interface ChatMessageProps {
  message: ChatMessageType;
}

/**
 * Individual chat message bubble with animation
 */
const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      className={`${styles.message} ${isUser ? styles.user : styles.assistant}`}
      variants={messageVariants}
      initial="hidden"
      animate="visible"
    >
      <div
        className={`${styles.bubble} ${
          isUser ? styles.userBubble : styles.assistantBubble
        }`}
      >
        {message.content}
      </div>
      <div className={styles.timestamp}>{formatTime(message.timestamp)}</div>
    </motion.div>
  );
};

export default ChatMessage;
