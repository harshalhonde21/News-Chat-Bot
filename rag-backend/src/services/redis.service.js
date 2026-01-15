import { createClient } from "redis";

const SESSION_TTL = parseInt(process.env.REDIS_SESSION_TTL || "1800", 10); // 30 minutes default
const KEY_PREFIX = "chat:";

class RedisService {
  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
      password: process.env.REDIS_PASSWORD,
    });

    this.client.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });

    this.client.on("connect", () => {
      console.log("Connected to Redis");
    });

    this.isConnected = false;
  }

  /**
   * Connect to Redis
   * @returns {Promise<void>}
   */
  async connect() {
    if (!this.isConnected) {
      await this.client.connect();
      this.isConnected = true;
      console.log("Redis connection established");
    }
  }

  /**
   * Disconnect from Redis
   * @returns {Promise<void>}
   */
  async disconnect() {
    if (this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
      console.log("Redis connection closed");
    }
  }

  /**
   * Get chat session messages
   * @param {string} sessionId - Session ID
   * @returns {Promise<Array>} - Array of messages or empty array if session doesn't exist
   */
  async getSession(sessionId) {
    try {
      const key = `${KEY_PREFIX}${sessionId}`;
      const data = await this.client.get(key);

      if (!data) {
        return [];
      }

      return JSON.parse(data);
    } catch (error) {
      console.error(`Error getting session ${sessionId}:`, error.message);
      throw error;
    }
  }

  /**
   * Append a message to a chat session
   * @param {string} sessionId - Session ID
   * @param {Object} message - Message object with role and content
   * @param {string} message.role - Message role ("user" or "assistant")
   * @param {string} message.content - Message content
   * @returns {Promise<void>}
   */
  async appendMessage(sessionId, message) {
    try {
      if (!message || !message.role || !message.content) {
        throw new Error("Invalid message format. Required: { role, content }");
      }

      if (!["user", "assistant"].includes(message.role)) {
        throw new Error('Invalid role. Must be "user" or "assistant"');
      }

      const key = `${KEY_PREFIX}${sessionId}`;

      // Get existing session or create new array
      const existingMessages = await this.getSession(sessionId);

      // Add timestamp to message
      const timestampedMessage = {
        ...message,
        timestamp: new Date().toISOString(),
      };

      existingMessages.push(timestampedMessage);

      // Save updated session
      await this.client.set(key, JSON.stringify(existingMessages), {
        EX: SESSION_TTL,
      });

      console.log(`Message appended to session ${sessionId}`);
    } catch (error) {
      console.error(
        `Error appending message to session ${sessionId}:`,
        error.message
      );
      throw error;
    }
  }

  /**
   * Clear a chat session
   * @param {string} sessionId - Session ID
   * @returns {Promise<boolean>} - True if session was deleted, false if it didn't exist
   */
  async clearSession(sessionId) {
    try {
      const key = `${KEY_PREFIX}${sessionId}`;
      const result = await this.client.del(key);

      const deleted = result > 0;
      if (deleted) {
        console.log(`Session ${sessionId} cleared`);
      } else {
        console.log(`Session ${sessionId} does not exist`);
      }

      return deleted;
    } catch (error) {
      console.error(`Error clearing session ${sessionId}:`, error.message);
      throw error;
    }
  }

  /**
   * Check if a session exists
   * @param {string} sessionId - Session ID
   * @returns {Promise<boolean>}
   */
  async sessionExists(sessionId) {
    try {
      const key = `${KEY_PREFIX}${sessionId}`;
      const exists = await this.client.exists(key);
      return exists === 1;
    } catch (error) {
      console.error(`Error checking session ${sessionId}:`, error.message);
      throw error;
    }
  }

  /**
   * Get TTL for a session
   * @param {string} sessionId - Session ID
   * @returns {Promise<number>} - TTL in seconds, -1 if no expiry, -2 if key doesn't exist
   */
  async getSessionTTL(sessionId) {
    try {
      const key = `${KEY_PREFIX}${sessionId}`;
      return await this.client.ttl(key);
    } catch (error) {
      console.error(
        `Error getting TTL for session ${sessionId}:`,
        error.message
      );
      throw error;
    }
  }

  /**
   * Refresh session TTL (extend expiration)
   * @param {string} sessionId - Session ID
   * @returns {Promise<boolean>}
   */
  async refreshSession(sessionId) {
    try {
      const key = `${KEY_PREFIX}${sessionId}`;
      const result = await this.client.expire(key, SESSION_TTL);
      return result === 1;
    } catch (error) {
      console.error(`Error refreshing session ${sessionId}:`, error.message);
      throw error;
    }
  }
}

export default new RedisService();
