# Express Chat API - Testing Guide

## 🚀 Starting the Server

**Before starting**, make sure you have:

1. ✅ Set up Redis Cloud and updated `.env` with `REDIS_URL`
2. ✅ Ingested vectors into Qdrant (run `node src/scripts/ingestVectors.js`)

**Start the server:**

```bash
npm start
```

Or with auto-reload (for development):

```bash
npm run dev
```

You should see:

```
✓ Redis connected
✓ Server running on http://localhost:3000
✓ Health check: http://localhost:3000/health
```

---

## 🧪 Testing Endpoints

### 1. Health Check

```bash
curl http://localhost:3000/health
```

**Expected Response:**

```json
{
  "status": "ok",
  "timestamp": "2026-01-13T12:42:00.000Z",
  "service": "RAG Chat API",
  "redis": "connected"
}
```

---

### 2. POST /api/chat - Send a message

**Request:**

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session-123",
    "message": "What are the latest news about technology?"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "sessionId": "session-123",
  "userMessage": "What are the latest news about technology?",
  "retrievedChunks": [
    {
      "score": 0.85,
      "text": "Article chunk about technology...",
      "title": "Tech News Article",
      "url": "https://example.com/tech-news",
      "metadata": { ... }
    },
    {
      "score": 0.78,
      "text": "Another relevant chunk...",
      "title": "AI Developments",
      "url": "https://example.com/ai-news",
      "metadata": { ... }
    },
    {
      "score": 0.72,
      "text": "Third relevant chunk...",
      "title": "Innovation Report",
      "url": "https://example.com/innovation",
      "metadata": { ... }
    }
  ],
  "message": "Query processed successfully"
}
```

---

### 3. GET /api/history/:sessionId - Get chat history

**Request:**

```bash
curl http://localhost:3000/api/history/session-123
```

**Expected Response:**

```json
{
  "success": true,
  "sessionId": "session-123",
  "messages": [
    {
      "role": "user",
      "content": "What are the latest news about technology?",
      "timestamp": "2026-01-13T12:42:00.000Z"
    },
    {
      "role": "assistant",
      "content": "{\"retrievedChunks\":[...],\"timestamp\":\"...\"}",
      "timestamp": "2026-01-13T12:42:01.000Z"
    }
  ],
  "messageCount": 2,
  "ttl": 1799,
  "ttlMinutes": 30
}
```

---

### 4. DELETE /api/session/:sessionId - Clear session

**Request:**

```bash
curl -X DELETE http://localhost:3000/api/session/session-123
```

**Expected Response:**

```json
{
  "success": true,
  "sessionId": "session-123",
  "message": "Session cleared successfully"
}
```

---

## 📝 Complete Testing Flow

Run these commands in sequence:

```bash
# 1. Send first message
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "test-session", "message": "Tell me about AI"}'

# 2. Send second message in same session
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "test-session", "message": "What about machine learning?"}'

# 3. Check history
curl http://localhost:3000/api/history/test-session

# 4. Clear session
curl -X DELETE http://localhost:3000/api/session/test-session

# 5. Verify session is cleared
curl http://localhost:3000/api/history/test-session
```

---

## 🔍 What Happens Behind the Scenes

### POST /api/chat Flow:

1. ✅ Validates request (sessionId, message)
2. 💾 Saves user message to Redis (`chat:{sessionId}`)
3. 🧮 Generates embedding for user message (HuggingFace API)
4. 🔎 Queries Qdrant vector DB for top 3 similar chunks
5. 💾 Saves assistant response (retrieved chunks) to Redis
6. 📤 Returns retrieved chunks to client

### GET /api/history/:sessionId Flow:

1. ✅ Validates sessionId
2. 💾 Retrieves all messages from Redis
3. 📊 Gets TTL (time-to-live) info
4. 📤 Returns messages array

### DELETE /api/session/:sessionId Flow:

1. ✅ Validates sessionId
2. 🗑️ Deletes session from Redis
3. 📤 Returns success confirmation

---

## ❌ Error Handling

**Missing fields:**

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

Response: `400 Bad Request - Missing required fields: sessionId and message`

**Session not found:**

```bash
curl http://localhost:3000/api/history/nonexistent-session
```

Response: `404 Not Found - Session not found`

---

## 🎯 Next Steps

This API is ready for:

- ✅ Frontend integration
- ✅ LLM integration (Gemini) - add to POST /chat endpoint
- ✅ Production deployment

**Session TTL:** Currently set to 30 minutes (configurable via `REDIS_SESSION_TTL` in `.env`)
