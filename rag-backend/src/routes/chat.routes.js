import express from "express";
import redisService from "../services/redis.service.js";
import vectorService from "../services/vector.service.js";
import embeddingService from "../services/embedding.service.js";
import geminiService from "../services/gemini.service.js";

const router = express.Router();

/**
 * POST /chat
 * Handle user chat messages with RAG (with Gemini LLM)
 *
 * Request body:
 * {
 *   sessionId: string,
 *   message: string
 * }
 *
 * Response:
 * {
 *   success: true,
 *   sessionId: string,
 *   userMessage: string,
 *   answer: string,
 *   sources: [{ title, url, score }],
 *   model: string
 * }
 */
router.post("/chat", async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    // Validation
    if (!sessionId || !message) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: sessionId and message",
      });
    }

    if (typeof sessionId !== "string" || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        error: "Invalid field types: sessionId and message must be strings",
      });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Message cannot be empty",
      });
    }

    console.log(`\n[Chat] Session: ${sessionId}`);
    console.log(`[Chat] User message: ${message}`);

    // Step 1: Save user message to Redis
    await redisService.appendMessage(sessionId, {
      role: "user",
      content: message,
    });
    console.log("[Chat] ✓ User message saved to Redis");

    // Step 2: Generate embedding for the user's message
    console.log("[Chat] Generating embedding...");
    const queryEmbedding = await embeddingService.generateEmbedding(message);
    console.log("[Chat] ✓ Embedding generated");

    // Step 3: Query vector DB for top 3 similar chunks
    console.log("[Chat] Querying vector database...");
    const retrievedChunks = await vectorService.search(queryEmbedding, 3);
    console.log(`[Chat] ✓ Retrieved ${retrievedChunks.length} chunks`);

    // Step 4: Call Gemini with retrieved context
    console.log("[Chat] Calling Gemini with context...");
    const geminiResponse = await geminiService.generateResponse(
      message,
      retrievedChunks
    );
    console.log("[Chat] ✓ Gemini response generated");

    // Step 5: Save Gemini's answer as assistant response to Redis
    await redisService.appendMessage(sessionId, {
      role: "assistant",
      content: geminiResponse.answer,
    });
    console.log("[Chat] ✓ Assistant response saved to Redis");

    // Step 6: Return final answer with sources
    res.json({
      success: true,
      sessionId,
      userMessage: message,
      answer: geminiResponse.answer,
      sources: geminiResponse.sources,
      model: geminiResponse.model,
      timestamp: geminiResponse.timestamp,
    });
  } catch (error) {
    console.error("[Chat] Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to process chat message",
      details: error.message,
    });
  }
});

/**
 * GET /history/:sessionId
 * Get chat history for a specific session
 *
 * Response:
 * {
 *   success: true,
 *   sessionId: string,
 *   messages: [{ role, content, timestamp }],
 *   messageCount: number
 * }
 */
router.get("/history/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: "Missing sessionId parameter",
      });
    }

    console.log(`\n[History] Fetching session: ${sessionId}`);

    // Get session from Redis
    const messages = await redisService.getSession(sessionId);
    console.log(`[History] ✓ Found ${messages.length} messages`);

    // Check if session exists
    const exists = await redisService.sessionExists(sessionId);

    if (!exists && messages.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Session not found",
        sessionId,
      });
    }

    // Get TTL info
    const ttl = await redisService.getSessionTTL(sessionId);

    res.json({
      success: true,
      sessionId,
      messages,
      messageCount: messages.length,
      ttl: ttl > 0 ? ttl : null,
      ttlMinutes: ttl > 0 ? Math.round(ttl / 60) : null,
    });
  } catch (error) {
    console.error("[History] Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch chat history",
      details: error.message,
    });
  }
});

/**
 * DELETE /session/:sessionId
 * Clear/delete a chat session
 *
 * Response:
 * {
 *   success: true,
 *   sessionId: string,
 *   message: "Session cleared successfully"
 * }
 */
router.delete("/session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: "Missing sessionId parameter",
      });
    }

    console.log(`\n[Delete] Clearing session: ${sessionId}`);

    // Clear session from Redis
    const deleted = await redisService.clearSession(sessionId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Session not found or already deleted",
        sessionId,
      });
    }

    console.log("[Delete] ✓ Session cleared");

    res.json({
      success: true,
      sessionId,
      message: "Session cleared successfully",
    });
  } catch (error) {
    console.error("[Delete] Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to clear session",
      details: error.message,
    });
  }
});

export default router;
