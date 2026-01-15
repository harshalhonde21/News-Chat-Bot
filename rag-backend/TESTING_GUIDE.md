# 🚀 Complete Testing Guide - RAG Chatbot

## ✅ Pre-Flight Checklist

Before starting, verify you have:

- ✅ Redis configured (REDIS_URL in .env)
- ✅ Gemini API key (GEMINI_API_KEY in .env)
- ✅ HuggingFace API key (HUGGINGFACE_API_KEY in .env)
- ✅ Qdrant cloud setup (QDRANT_URL in .env)
- ✅ News data ingested into vector DB

---

## 📋 Step 1: Check if Data is Ingested

First, verify you have news articles in your vector database:

```bash
# Check if data folder exists
ls -la data/

# If news.json exists, check number of articles
cat data/news.json | grep -c "title"
```

**If you DON'T have data yet:**

```bash
# Run news scraper first
node src/scripts/ingestNews.js

# Then ingest into vector DB
node src/scripts/ingestVectors.js
```

---

## 🚀 Step 2: Start the Server

Open terminal in your project folder and run:

```bash
npm start
```

**Expected Output:**

```
🚀 Starting RAG Chat API Server...

📡 Connecting to Redis...
Connected to Redis
✓ Redis connected

✓ Server running on http://localhost:3000
✓ Health check: http://localhost:3000/health

📋 Available endpoints:
  POST   /api/chat - Send chat message with RAG
  GET    /api/history/:sessionId - Get chat history
  DELETE /api/session/:sessionId - Clear session

✨ Server ready to accept requests!
```

✅ **If you see this, your server is running!**

---

## 🧪 Step 3: Test with Terminal (Quick Test)

### Test 1: Health Check

```bash
curl http://localhost:3000/health
```

**Expected:** `{"status":"ok","redis":"connected"}`

### Test 2: Send a Chat Message

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-123",
    "message": "What are the latest news about technology?"
  }'
```

**Expected:** JSON response with AI-generated answer

---

## 📮 Step 4: Test with Postman (Detailed)

### **4.1 Install Postman**

- Download from: https://www.postman.com/downloads/
- Or use web version: https://web.postman.com/

### **4.2 Create New Request**

#### **Test 1: Health Check (GET)**

1. **Click** "New" → "HTTP Request"
2. **Method:** GET
3. **URL:** `http://localhost:3000/health`
4. **Click** "Send"

**Expected Response:**

```json
{
  "status": "ok",
  "timestamp": "2026-01-13T15:00:00.000Z",
  "service": "RAG Chat API",
  "redis": "connected"
}
```

---

#### **Test 2: Send Chat Message (POST)**

1. **Method:** POST
2. **URL:** `http://localhost:3000/api/chat`
3. **Headers:**
   - Click "Headers" tab
   - Add: `Content-Type` = `application/json`
4. **Body:**
   - Click "Body" tab
   - Select "raw"
   - Select "JSON" from dropdown
   - Paste this:
   ```json
   {
     "sessionId": "postman-test-1",
     "message": "What are the latest developments in AI?"
   }
   ```
5. **Click** "Send"

**Expected Response:**

```json
{
  "success": true,
  "sessionId": "postman-test-1",
  "userMessage": "What are the latest developments in AI?",
  "answer": "Based on the articles provided, recent AI developments include...",
  "sources": [
    {
      "title": "AI Breakthrough Article",
      "url": "https://theguardian.com/tech/ai-news",
      "score": 0.87
    }
  ],
  "model": "gemini-1.5-flash",
  "timestamp": "2026-01-13T15:00:00.000Z"
}
```

---

#### **Test 3: Get Chat History (GET)**

1. **Method:** GET
2. **URL:** `http://localhost:3000/api/history/postman-test-1`
3. **Click** "Send"

**Expected Response:**

```json
{
  "success": true,
  "sessionId": "postman-test-1",
  "messages": [
    {
      "role": "user",
      "content": "What are the latest developments in AI?",
      "timestamp": "2026-01-13T15:00:00.000Z"
    },
    {
      "role": "assistant",
      "content": "Based on the articles...",
      "timestamp": "2026-01-13T15:00:02.000Z"
    }
  ],
  "messageCount": 2,
  "ttl": 1795,
  "ttlMinutes": 30
}
```

---

#### **Test 4: Send Another Message (Same Session)**

1. **Method:** POST
2. **URL:** `http://localhost:3000/api/chat`
3. **Body:**
   ```json
   {
     "sessionId": "postman-test-1",
     "message": "Tell me more about that"
   }
   ```
4. **Click** "Send"

---

#### **Test 5: Clear Session (DELETE)**

1. **Method:** DELETE
2. **URL:** `http://localhost:3000/api/session/postman-test-1`
3. **Click** "Send"

**Expected Response:**

```json
{
  "success": true,
  "sessionId": "postman-test-1",
  "message": "Session cleared successfully"
}
```

---

## 🎯 Sample Questions to Test

Try these questions with your news data:

### ✅ Questions that SHOULD work (if you have news data):

- "What are the latest news about technology?"
- "Tell me about climate change"
- "What's happening in politics?"
- "Any news about the economy?"
- "What are people saying about AI?"

### ❌ Questions that should return "I don't know":

- "What's the weather today?"
- "How do I bake a cake?"
- "What time is it?"
- "Tell me a joke"

---

## 📊 Save Postman Collection

**To save time, create a Postman Collection:**

1. Click "Collections" (left sidebar)
2. Click "+" to create new collection
3. Name it: "RAG Chatbot API"
4. Drag all your requests into this collection
5. Export and save for future use

---

## 🎬 Complete Test Workflow

Run these in order:

```
1. Health Check (GET /health)
   ↓
2. Send Message (POST /api/chat)
   ↓
3. Check History (GET /api/history/{sessionId})
   ↓
4. Send Another Message (POST /api/chat)
   ↓
5. Check History Again (GET /api/history/{sessionId})
   ↓
6. Clear Session (DELETE /api/session/{sessionId})
   ↓
7. Try to Get History (should return 404)
```

---

## 🐛 Troubleshooting

### **Error: "ECONNREFUSED" or server not starting**

```bash
# Check if port 3000 is already in use
lsof -i :3000

# Kill the process if needed
kill -9 <PID>

# Restart server
npm start
```

### **Error: "GEMINI_API_KEY is not configured"**

- Check your `.env` file
- Make sure the API key is on line 22
- Restart the server after updating `.env`

### **Error: "Redis Client Error"**

- Check `REDIS_URL` in `.env`
- Test Redis connection: `node test-redis.js`

### **Response: "I don't know based on the provided sources"**

✅ This is CORRECT if:

- Your question is unrelated to news
- You haven't ingested news data yet

❌ This is a PROBLEM if:

- You asked a news-related question
- You have ingested data

**Solution:** Re-run vector ingestion:

```bash
node src/scripts/ingestVectors.js
```

---

## 📝 Server Console Logs

When testing, watch your server console. You should see:

```
[Chat] Session: postman-test-1
[Chat] User message: What are the latest developments in AI?
[Chat] ✓ User message saved to Redis
[Chat] Generating embedding...
[Chat] ✓ Embedding generated
[Chat] Querying vector database...
[Chat] ✓ Retrieved 3 chunks
[Chat] Calling Gemini with context...
[Gemini] Building RAG prompt...
[Gemini] Calling Gemini API...
[Gemini] ✓ Response generated
[Chat] ✓ Assistant response saved to Redis
```

---

## ✅ Success Indicators

You're good if:

- ✅ Health check returns `"redis": "connected"`
- ✅ POST /chat returns an `answer` field
- ✅ GET /history shows your conversation
- ✅ Server console shows no errors
- ✅ Gemini provides context-aware answers

---

## 🎉 You're Done!

Your RAG chatbot is fully functional!

**What you have:**

- ✅ Working Express API
- ✅ Vector similarity search
- ✅ Google Gemini LLM
- ✅ Redis session storage
- ✅ Source attribution

**Ready for:**

- Building a frontend
- Adding more features
- Production deployment

---

## 📚 Quick Reference

| Endpoint                  | Method | Purpose             |
| ------------------------- | ------ | ------------------- |
| `/health`                 | GET    | Check server status |
| `/api/chat`               | POST   | Send chat message   |
| `/api/history/:sessionId` | GET    | Get chat history    |
| `/api/session/:sessionId` | DELETE | Clear session       |

**Server:** http://localhost:3000
