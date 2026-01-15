# Gemini Integration - Quick Start Guide

## 🔑 Getting Your Gemini API Key

1. **Go to Google AI Studio:** [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. **Sign in** with your Google account
3. **Click "Create API Key"**
4. **Copy the API key** (starts with `AIza...`)
5. **Open your `.env` file** and replace the placeholder:

```bash
GEMINI_API_KEY=AIzaSyC... # Your actual key here
```

---

## 🚀 Testing the Complete RAG Flow

### **Start the Server**

```bash
npm start
```

### **Test 1: Ask a Question**

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "gemini-test-1",
    "message": "What are the latest developments in AI technology?"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "sessionId": "gemini-test-1",
  "userMessage": "What are the latest developments in AI technology?",
  "answer": "According to the articles, AI technology has seen several recent developments including... [answer based on news articles]",
  "sources": [
    {
      "title": "AI Breakthroughs in 2024",
      "url": "https://theguardian.com/tech/ai-2024",
      "score": 0.87
    },
    {
      "title": "Machine Learning Advances",
      "url": "https://theguardian.com/tech/ml-advances",
      "score": 0.82
    }
  ],
  "model": "gemini-1.5-flash",
  "timestamp": "2026-01-13T13:00:00.000Z"
}
```

---

### **Test 2: Ask About Something NOT in the Articles**

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "gemini-test-2",
    "message": "What is the weather today?"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "answer": "I don't know based on the provided sources.",
  "sources": [...],
  "model": "gemini-1.5-flash"
}
```

> ✅ Gemini correctly refuses to answer questions outside the provided context!

---

### **Test 3: Check Chat History**

```bash
curl http://localhost:3000/api/history/gemini-test-1
```

**Expected Response:**

```json
{
  "success": true,
  "sessionId": "gemini-test-1",
  "messages": [
    {
      "role": "user",
      "content": "What are the latest developments in AI technology?",
      "timestamp": "2026-01-13T13:00:00.000Z"
    },
    {
      "role": "assistant",
      "content": "According to the articles, AI technology has seen...",
      "timestamp": "2026-01-13T13:00:02.000Z"
    }
  ],
  "messageCount": 2,
  "ttl": 1798
}
```

---

## 🔄 Complete RAG Flow Diagram

```
User Question
    ↓
[1] Save to Redis (user message)
    ↓
[2] Generate Embedding (HuggingFace)
    ↓
[3] Search Vector DB (Qdrant) → Top 3 chunks
    ↓
[4] Build RAG Prompt with Context
    ↓
[5] Call Gemini API → AI Answer
    ↓
[6] Save to Redis (assistant response)
    ↓
[7] Return to User (answer + sources)
```

---

## 🎯 What Changed?

### **Before (Without Gemini):**

- Returned raw article chunks
- No natural language generation
- User had to read chunks manually

### **After (With Gemini):**

- Returns AI-generated natural language answer
- Answers ONLY from provided context
- Says "I don't know" if answer not in articles
- Includes source citations

---

## 🧪 Server Console Output

When you send a chat request, you'll see:

```
[Chat] Session: gemini-test-1
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

## ⚠️ Important Notes

1. **API Key Required:** Get your free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. **Rate Limits:** Free tier has rate limits - test reasonably
3. **Context-Only Answers:** Gemini will ONLY answer from provided news articles
4. **Session TTL:** Chat sessions expire after 30 minutes (configurable)

---

## 🐛 Troubleshooting

**Error: "GEMINI_API_KEY is not configured"**

- ✅ Add your API key to `.env` file
- ✅ Restart the server after updating `.env`

**Error: "Invalid Gemini API key"**

- ✅ Check if you copied the full key (starts with `AIza`)
- ✅ Verify the key is active in Google AI Studio

**Response: "I don't know based on the provided sources"**

- ✅ This is correct! Question is outside the news articles dataset
- ✅ Try asking about news/current events instead

---

## 📊 API Response Format

The POST /chat response now includes:

```typescript
{
  success: boolean,
  sessionId: string,
  userMessage: string,
  answer: string,              // 🆕 AI-generated answer
  sources: [                   // 🆕 Source citations
    {
      title: string,
      url: string,
      score: number
    }
  ],
  model: string,               // 🆕 "gemini-1.5-flash"
  timestamp: string           // 🆕 ISO timestamp
}
```

---

## ✅ You're Ready!

Your RAG chatbot is now fully functional with:

- ✅ Vector similarity search
- ✅ Google Gemini LLM
- ✅ Context-aware responses
- ✅ Redis session storage
- ✅ Source citations

**Next Step:** Build a frontend or integrate with your application! 🚀
