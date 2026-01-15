import { motion } from "framer-motion";
import { EXAMPLE_QUESTIONS } from "@utils/constants";
import styles from "./EmptyState.module.scss";

interface EmptyStateProps {
  onQuestionClick: (question: string) => void;
}

/**
 * Welcome screen shown when no messages exist
 */
const EmptyState = ({ onQuestionClick }: EmptyStateProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      className={styles.empty}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className={styles.icon} variants={itemVariants}>
        💬
      </motion.div>

      <motion.h1 className={styles.title} variants={itemVariants}>
        RAG Chatbot
      </motion.h1>

      <motion.p className={styles.description} variants={itemVariants}>
        Ask me anything! I'll search through my knowledge base to provide you
        with accurate, context-aware answers.
      </motion.p>

      <motion.div className={styles.examples} variants={itemVariants}>
        {EXAMPLE_QUESTIONS.map((question, index) => (
          <button
            key={index}
            className={styles.exampleCard}
            onClick={() => onQuestionClick(question)}
          >
            <p className={styles.exampleText}>{question}</p>
          </button>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default EmptyState;
