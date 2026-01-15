import "dotenv/config";
import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.routes.js";
import redisService from "./services/redis.service.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for frontend access
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging middleware
app.use((req, res, next) => {
  console.log(`\n${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "RAG Chat API",
    redis: redisService.isConnected ? "connected" : "disconnected",
  });
});

// API Routes
app.use("/api", chatRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    path: req.path,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: err.message,
  });
});

// Start server
async function startServer() {
  try {
    console.log("🚀 Starting RAG Chat API Server...\n");

    // Connect to Redis
    console.log("📡 Connecting to Redis...");
    await redisService.connect();
    console.log("✓ Redis connected\n");

    // Start Express server
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Health check: http://localhost:${PORT}/health`);
      console.log(`\n📋 Available endpoints:`);
      console.log(`  POST   /api/chat - Send chat message with RAG`);
      console.log(`  GET    /api/history/:sessionId - Get chat history`);
      console.log(`  DELETE /api/session/:sessionId - Clear session`);
      console.log(`\n✨ Server ready to accept requests!\n`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n\n⚠️  Shutting down gracefully...");
  try {
    await redisService.disconnect();
    console.log("✓ Redis disconnected");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error.message);
    process.exit(1);
  }
});

process.on("SIGTERM", async () => {
  console.log("\n\n⚠️  SIGTERM received, shutting down...");
  try {
    await redisService.disconnect();
    console.log("✓ Redis disconnected");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error.message);
    process.exit(1);
  }
});

// Start the server
startServer();
