import { QdrantClient } from "@qdrant/js-client-rest";

const COLLECTION_NAME = process.env.QDRANT_COLLECTION_NAME || "news_articles";
const VECTOR_SIZE = parseInt(process.env.VECTOR_SIZE || "1536", 10); // Default for OpenAI embeddings

class VectorService {
  constructor() {
    this.client = new QdrantClient({
      url: process.env.QDRANT_URL || "http://localhost:6333",
      apiKey: process.env.QDRANT_API_KEY,
    });
    this.collectionName = COLLECTION_NAME;
  }

  /**
   * Create collection if it doesn't exist
   * @returns {Promise<void>}
   */
  async ensureCollection() {
    try {
      console.log(`  Connecting to Qdrant at: ${process.env.QDRANT_URL}`);

      const collections = await this.client.getCollections();
      const exists = collections.collections.some(
        (col) => col.name === this.collectionName
      );

      if (!exists) {
        console.log(
          `  Collection "${this.collectionName}" not found, creating...`
        );
        await this.client.createCollection(this.collectionName, {
          vectors: {
            size: VECTOR_SIZE,
            distance: "Cosine",
          },
        });
        console.log(`  ✓ Created collection: ${this.collectionName}`);
      } else {
        console.log(`  ✓ Collection already exists: ${this.collectionName}`);
      }
    } catch (error) {
      console.error("❌ Error ensuring collection:");
      console.error("  Collection Name:", this.collectionName);
      console.error("  Qdrant URL:", process.env.QDRANT_URL);
      console.error("  Error:", error.message);
      console.error("  Full Error:", error);
      throw error;
    }
  }

  /**
   * Insert vectors with metadata into the collection
   * @param {Array<Object>} points - Array of objects with id, vector, and payload (metadata)
   * @returns {Promise<void>}
   *
   * Example:
   * [
   *   {
   *     id: 1,
   *     vector: [0.1, 0.2, ...],
   *     payload: { text: '...', title: '...', url: '...' }
   *   }
   * ]
   */
  async insertVectors(points) {
    try {
      if (!points || points.length === 0) {
        throw new Error("No points to insert");
      }

      await this.client.upsert(this.collectionName, {
        wait: true,
        points: points,
      });

      console.log(
        `Inserted ${points.length} vectors into ${this.collectionName}`
      );
    } catch (error) {
      console.error("Error inserting vectors:", error.message);
      throw error;
    }
  }

  /**
   * Search for top-k similar vectors
   * @param {number[]} queryVector - Query embedding vector
   * @param {number} topK - Number of results to return (default: 5)
   * @param {Object} filter - Optional Qdrant filter
   * @returns {Promise<Array>} - Array of search results with score and payload
   */
  async search(queryVector, topK = 5, filter = null) {
    try {
      if (!queryVector || !Array.isArray(queryVector)) {
        throw new Error("Invalid query vector");
      }

      const searchParams = {
        vector: queryVector,
        limit: topK,
        with_payload: true,
      };

      if (filter) {
        searchParams.filter = filter;
      }

      const results = await this.client.search(
        this.collectionName,
        searchParams
      );

      return results.map((result) => ({
        score: result.score,
        text: result.payload.text,
        title: result.payload.title,
        url: result.payload.url,
        metadata: result.payload,
      }));
    } catch (error) {
      console.error("Error searching vectors:", error.message);
      throw error;
    }
  }

  /**
   * Get collection info
   * @returns {Promise<Object>}
   */
  async getCollectionInfo() {
    try {
      return await this.client.getCollection(this.collectionName);
    } catch (error) {
      console.error("Error getting collection info:", error.message);
      throw error;
    }
  }

  /**
   * Delete collection
   * @returns {Promise<void>}
   */
  async deleteCollection() {
    try {
      await this.client.deleteCollection(this.collectionName);
      console.log(`Deleted collection: ${this.collectionName}`);
    } catch (error) {
      console.error("Error deleting collection:", error.message);
      throw error;
    }
  }
}

export default new VectorService();
