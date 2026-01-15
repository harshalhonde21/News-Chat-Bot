/**
 * Splits long text into chunks suitable for embeddings.
 * Preserves sentence boundaries and aims for 400-500 words per chunk.
 *
 * @param {string} text - The input text to chunk
 * @param {number} targetWords - Target words per chunk (default: 450)
 * @returns {string[]} - Array of text chunks
 */
export function chunkText(text, targetWords = 450) {
  if (!text || typeof text !== "string") {
    return [];
  }

  // Split text into sentences (preserve sentence boundaries)
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

  const chunks = [];
  let currentChunk = "";
  let currentWordCount = 0;

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (!trimmedSentence) continue;

    const sentenceWordCount = trimmedSentence.split(/\s+/).length;

    // If adding this sentence would exceed target, start new chunk
    if (
      currentWordCount > 0 &&
      currentWordCount + sentenceWordCount > targetWords
    ) {
      chunks.push(currentChunk.trim());
      currentChunk = trimmedSentence;
      currentWordCount = sentenceWordCount;
    } else {
      // Add sentence to current chunk
      currentChunk += (currentChunk ? " " : "") + trimmedSentence;
      currentWordCount += sentenceWordCount;
    }
  }

  // Add the last chunk if it exists
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Get word count for a text string
 *
 * @param {string} text - The input text
 * @returns {number} - Word count
 */
export function getWordCount(text) {
  if (!text || typeof text !== "string") {
    return 0;
  }
  return text.trim().split(/\s+/).length;
}
