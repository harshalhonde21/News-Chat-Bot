import axios from "axios";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.GUARDIAN_API_KEY;
const OUTPUT_FILE = path.join(__dirname, "../../data/news.json");
const MAX_ARTICLES = 50;

if (!API_KEY) {
  console.error("Missing GUARDIAN_API_KEY in env");
  process.exit(1);
}

async function fetchArticles() {
  const url = "https://content.guardianapis.com/search";

  const { data } = await axios.get(url, {
    params: {
      "api-key": API_KEY,
      "show-fields": "bodyText,headline",
      pageSize: MAX_ARTICLES,
      orderBy: "newest",
    },
  });

  return data.response.results;
}

async function main() {
  console.log("Fetching Guardian articles...");

  const results = await fetchArticles();
  const articles = [];

  for (const item of results) {
    const title = item.fields?.headline;
    const content = item.fields?.bodyText;
    const url = item.webUrl;

    if (!title || !content || content.length < 300) continue;

    articles.push({
      title,
      content,
      url,
    });
  }

  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(articles, null, 2), "utf-8");

  console.log(`Saved ${articles.length} articles to ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error("Ingestion failed:", err.message);
  process.exit(1);
});
