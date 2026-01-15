import { HfInference } from "@huggingface/inference";

const MODEL_ID = "sentence-transformers/all-MiniLM-L6-v2";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class EmbeddingService {
  constructor() {
    // Initialize HuggingFace client
    this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
  }

  /**
   * Generate embedding for a single text
   * @param {string} text - Text to embed
   * @returns {Promise<number[]>} - Embedding vector
   */
  async generateEmbedding(text) {
    try {
      if (!text || typeof text !== "string") {
        throw new Error("Invalid input: text must be a non-empty string");
      }

      const embeddings = await this.generateEmbeddings([text]);
      return embeddings[0];
    } catch (error) {
      console.error("Error generating embedding:", error.message);
      throw error;
    }
  }

  /**
   * Generate embeddings for multiple texts (batch processing)
   * @param {string[]} texts - Array of texts to embed
   * @returns {Promise<number[][]>} - Array of embedding vectors
   */
  async generateEmbeddings(texts) {
    try {
      if (!Array.isArray(texts) || texts.length === 0) {
        throw new Error("Invalid input: texts must be a non-empty array");
      }

      console.log(`  Generating embeddings for ${texts.length} text(s)...`);

      // HuggingFace SDK returns embeddings directly
      // Use 'useClient: true' to force using the free Serverless Inference API
      const response = await this.hf.featureExtraction({
        model: MODEL_ID,
        inputs: texts,
        // Force legacy free Inference API instead of Inference Providers
        useClient: true,
      });

      console.log(`  ✓ Embeddings generated successfully`);

      // If single text, response is a single array, otherwise array of arrays
      const embeddings = Array.isArray(response[0]) ? response : [response];

      return embeddings;
    } catch (error) {
      // Handle model loading errors (HF SDK may throw custom errors)
      if (
        error.message?.includes("loading") ||
        error.message?.includes("503")
      ) {
        console.log("  Model is loading, retrying in 10 seconds...");
        await sleep(10000);
        return this.generateEmbeddings(texts);
      }

      // Enhanced error logging
      console.error("❌ Error generating embeddings:");
      console.error("  Model:", MODEL_ID);
      console.error("  Error Message:", error.message);
      console.error("  Error Details:", error);

      throw error;
    }
  }

  /**
   * Generate mock embedding (for testing without API calls)
   * @param {number} size - Size of the embedding vector (default: 384 for all-MiniLM-L6-v2)
   * @returns {number[]} - Mock embedding vector
   */
  generateMockEmbedding(size = 384) {
    return Array.from({ length: size }, () => Math.random() * 2 - 1);
  }
}

export default new EmbeddingService();
