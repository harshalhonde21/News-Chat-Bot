import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { HfInference } from "@huggingface/inference";
import { chunkText } from "../utils/chunkText.js";
import vectorService from "../services/vector.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NEWS_JSON_PATH = path.join(__dirname, "../../data/news.json");
const MODEL_ID = "sentence-transformers/all-MiniLM-L6-v2";
const BATCH_SIZE = 10; // Process embeddings in batches
const DELAY_MS = 1000; // Delay between batches to avoid rate limiting

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Initialize HuggingFace client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

/**
 * Generate embeddings using HuggingFace Inference API
 * @param {string[]} texts - Array of text chunks to embed
 * @returns {Promise<number[][]>} - Array of embedding vectors
 */
async function generateEmbeddings(texts) {
  try {
    const response = await hf.featureExtraction({
      model: MODEL_ID,
      inputs: texts,
      useClient: true, // Use free serverless API
    });

    // If single text, response is a single array, otherwise array of arrays
    const embeddings = Array.isArray(response[0]) ? response : [response];
    return embeddings;
  } catch (error) {
    if (error.message?.includes("loading") || error.message?.includes("503")) {
      console.log("Model is loading, retrying in 10 seconds...");
      await sleep(10000);
      return generateEmbeddings(texts);
    }

    console.error("Error generating embeddings:", error.message);
    throw error;
  }
}

/**
 * Process a single article: chunk it and prepare for vectorization
 * @param {Object} article - Article object with title, content, url
 * @param {number} articleIndex - Index of the article
 * @returns {Array} - Array of chunks with metadata
 */
function prepareArticleChunks(article, articleIndex) {
  const { title, content, url } = article;

  if (!content) {
    console.warn(`Skipping article "${title}" - no content`);
    return [];
  }

  const chunks = chunkText(content, 400); // Target 400 words per chunk

  return chunks.map((chunk, chunkIndex) => ({
    text: chunk,
    title,
    url,
    articleIndex,
    chunkIndex,
  }));
}

/**
 * Main ingestion function
 */
async function main() {
  try {
    console.log("Starting vector ingestion process...\n");

    // Read news.json
    console.log(`Reading news data from: ${NEWS_JSON_PATH}`);
    const newsData = JSON.parse(await fs.readFile(NEWS_JSON_PATH, "utf-8"));
    console.log(`Loaded ${newsData.length} articles\n`);

    // Ensure Qdrant collection exists
    console.log("Ensuring Qdrant collection exists...");
    await vectorService.ensureCollection();
    console.log("Collection ready\n");

    // Prepare all chunks
    console.log("Chunking articles...");
    const allChunks = [];
    newsData.forEach((article, index) => {
      const chunks = prepareArticleChunks(article, index);
      allChunks.push(...chunks);
    });
    console.log(
      `Created ${allChunks.length} chunks from ${newsData.length} articles\n`
    );

    // Process chunks in batches
    let pointId = 1;
    const totalBatches = Math.ceil(allChunks.length / BATCH_SIZE);

    for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
      const batch = allChunks.slice(i, i + BATCH_SIZE);

      console.log(
        `\n[Batch ${batchNumber}/${totalBatches}] Processing ${batch.length} chunks...`
      );

      // Extract texts for embedding
      const texts = batch.map((chunk) => chunk.text);

      // Generate embeddings
      console.log("  Generating embeddings...");
      const embeddings = await generateEmbeddings(texts);
      console.log(`  ✓ Generated ${embeddings.length} embeddings`);

      // Prepare points for Qdrant
      const points = batch.map((chunk, idx) => ({
        id: pointId++,
        vector: embeddings[idx],
        payload: {
          text: chunk.text,
          title: chunk.title,
          url: chunk.url,
          articleIndex: chunk.articleIndex,
          chunkIndex: chunk.chunkIndex,
        },
      }));

      // Insert into Qdrant
      console.log("  Inserting into vector database...");
      await vectorService.insertVectors(points);
      console.log(`  ✓ Inserted ${points.length} vectors`);

      // Delay to avoid rate limiting (except for last batch)
      if (i + BATCH_SIZE < allChunks.length) {
        console.log(`  Waiting ${DELAY_MS}ms before next batch...`);
        await sleep(DELAY_MS);
      }
    }

    // Get final collection info
    console.log("\n✓ Ingestion complete!\n");
    const collectionInfo = await vectorService.getCollectionInfo();
    console.log("Collection stats:");
    console.log(`  - Name: ${collectionInfo.collection_name}`);
    console.log(`  - Vectors: ${collectionInfo.points_count}`);
    console.log(
      `  - Vector size: ${collectionInfo.config.params.vectors.size}`
    );
  } catch (error) {
    console.error("\n✗ Ingestion failed:", error.message);
    process.exit(1);
  }
}

main();
