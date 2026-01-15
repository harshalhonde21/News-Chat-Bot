import { motion } from "framer-motion";
import styles from "./TypingIndicator.module.scss";

/**
 * Animated typing indicator shown while waiting for AI response
 */
const TypingIndicator = () => {
  const dotVariants = {
    initial: { opacity: 0.4 },
    animate: { opacity: 1 },
  };

  const dotTransition = {
    duration: 0.4,
    repeat: Infinity,
    repeatType: "reverse" as const,
  };

  return (
    <div className={styles.typing}>
      <motion.div
        className={styles.dot}
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{ ...dotTransition, delay: 0 }}
      />
      <motion.div
        className={styles.dot}
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{ ...dotTransition, delay: 0.2 }}
      />
      <motion.div
        className={styles.dot}
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{ ...dotTransition, delay: 0.4 }}
      />
    </div>
  );
};

export default TypingIndicator;
