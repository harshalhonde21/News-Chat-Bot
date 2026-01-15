import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-pro";

class GeminiService {
  constructor() {
    if (!GEMINI_API_KEY) {
      console.warn(
        "⚠️  GEMINI_API_KEY not found in environment variables. Please add it to .env"
      );
    }

    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: MODEL_NAME });
  }

  /**
   * Build RAG prompt with context and user question
   * @param {string} userMessage - User's question
   * @param {Array} retrievedChunks - Array of relevant context chunks
   * @returns {string} - Formatted prompt
   */
  buildRAGPrompt(userMessage, retrievedChunks) {
    // Build context from retrieved chunks
    const contextText = retrievedChunks
      .map((chunk, index) => {
        return `[Source ${index + 1}: ${chunk.title}]
${chunk.text}
URL: ${chunk.url}
---`;
      })
      .join("\n\n");

    // Build the RAG prompt
    const prompt = `You are a helpful news assistant. Your job is to answer questions based ONLY on the provided context from news articles.

IMPORTANT RULES:
1. Answer ONLY using information from the context below
2. If the answer is not in the context, respond with "I don't know based on the provided sources."
3. When answering, cite the source by mentioning the article title
4. Be concise and accurate
5. Do NOT make up information or use external knowledge

CONTEXT:
${contextText}

USER QUESTION:
${userMessage}

ANSWER:`;

    return prompt;
  }

  /**
   * Generate response using Gemini with RAG context
   * @param {string} userMessage - User's question
   * @param {Array} retrievedChunks - Array of context chunks from vector DB
   * @returns {Promise<Object>} - Response object with answer and metadata
   */
  async generateResponse(userMessage, retrievedChunks) {
    try {
      if (!GEMINI_API_KEY) {
        throw new Error(
          "GEMINI_API_KEY is not configured. Please add it to your .env file."
        );
      }

      if (!retrievedChunks || retrievedChunks.length === 0) {
        return {
          answer:
            "I don't have enough context to answer your question. Please try a different query.",
          sources: [],
          model: MODEL_NAME,
        };
      }

      console.log("[Gemini] Building RAG prompt...");
      const prompt = this.buildRAGPrompt(userMessage, retrievedChunks);

      console.log("[Gemini] Calling Gemini API...");
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const answer = response.text();

      console.log("[Gemini] ✓ Response generated");

      // Extract source citations
      const sources = retrievedChunks.map((chunk) => ({
        title: chunk.title,
        url: chunk.url,
        score: chunk.score,
      }));

      return {
        answer: answer.trim(),
        sources,
        model: MODEL_NAME,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("[Gemini] Error:", error.message);

      // Handle specific API errors
      if (error.message.includes("API key")) {
        throw new Error(
          "Invalid Gemini API key. Please check your GEMINI_API_KEY in .env"
        );
      }

      throw error;
    }
  }

  /**
   * Generate response with custom configuration
   * @param {string} userMessage - User's question
   * @param {Array} retrievedChunks - Context chunks
   * @param {Object} config - Generation config (temperature, maxTokens, etc.)
   * @returns {Promise<Object>} - Response object
   */
  async generateResponseWithConfig(userMessage, retrievedChunks, config = {}) {
    try {
      const prompt = this.buildRAGPrompt(userMessage, retrievedChunks);

      const generationConfig = {
        temperature: config.temperature || 0.7,
        topP: config.topP || 0.95,
        topK: config.topK || 40,
        maxOutputTokens: config.maxOutputTokens || 1024,
      };

      const result = await this.model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig,
      });

      const response = await result.response;
      const answer = response.text();

      const sources = retrievedChunks.map((chunk) => ({
        title: chunk.title,
        url: chunk.url,
        score: chunk.score,
      }));

      return {
        answer: answer.trim(),
        sources,
        model: MODEL_NAME,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("[Gemini] Error with config:", error.message);
      throw error;
    }
  }
}

export default new GeminiService();
