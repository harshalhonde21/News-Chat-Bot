import { useState } from "react";
import styles from "./Header.module.scss";

interface HeaderProps {
  onReset: () => void;
  isConnected: boolean;
}

/**
 * App header with title, status, and reset button
 */
const Header = ({ onReset, isConnected }: HeaderProps) => {
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    if (isResetting) return;

    const confirmed = window.confirm(
      "Are you sure you want to reset? This will clear all messages and start a new session."
    );

    if (confirmed) {
      setIsResetting(true);
      await onReset();
      setIsResetting(false);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.logo}>💬</div>
          <h1 className={styles.title}>RAG Chatbot</h1>
        </div>

        <div className={styles.right}>
          <div className={styles.status}>
            <div
              className={`${styles.indicator} ${
                isConnected ? styles.connected : styles.disconnected
              }`}
            />
            <span className={styles.statusText}>
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>

          <button
            className={styles.resetButton}
            onClick={handleReset}
            disabled={isResetting}
          >
            {isResetting ? "Resetting..." : "Reset Chat"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
