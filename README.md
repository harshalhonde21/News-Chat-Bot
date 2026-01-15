# 🤖 RAG Project Chat Bot

A full-stack **Retrieval-Augmented Generation (RAG)** chatbot application built with modern web technologies. This project combines a powerful Express backend with vector search capabilities and a beautiful Progressive Web App (PWA) frontend for an intelligent chat experience.

![Project Banner](https://img.shields.io/badge/Full%20Stack-RAG%20Chatbot-blue?style=for-the-badge)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-blue?style=for-the-badge)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Backend Technologies](#-backend-technologies)
- [Frontend Technologies](#-frontend-technologies)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Setup](#-environment-setup)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🎯 Overview

This RAG chatbot uses **vector embeddings** and **semantic search** to retrieve relevant information from a knowledge base (news articles) and provide intelligent responses. The system combines:

- **Vector Search**: Qdrant vector database for semantic similarity search
- **Embeddings**: HuggingFace models for text-to-vector conversion
- **LLM Integration**: Google Gemini AI for response generation
- **Session Management**: Redis for persistent chat sessions
- **Modern UI**: React PWA with smooth animations and offline support

---

## 🏗️ Architecture

```
┌─────────────────┐
│  React Frontend │
│   (PWA + TS)    │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│  Express Server │
│   (Node.js)     │
└────────┬────────┘
         │
    ┌────┴────┬────────────┬──────────────┐
    ▼         ▼            ▼              ▼
┌───────┐ ┌───────┐  ┌──────────┐  ┌──────────┐
│ Redis │ │Qdrant │  │HuggingFace│  │  Gemini  │
│Session│ │Vector │  │Embeddings │  │   LLM    │
│  DB   │ │  DB   │  │  Service  │  │   API    │
└───────┘ └───────┘  └──────────┘  └──────────┘
```

**Flow:**

1. User sends message → Frontend
2. Frontend → Backend API
3. Backend generates embedding (HuggingFace)
4. Backend queries Qdrant for relevant chunks
5. Backend uses Gemini to generate response with context
6. Backend stores conversation in Redis
7. Response → Frontend → User

---

## 🔧 Backend Technologies

### **Core Framework**

- **Node.js** - JavaScript runtime
- **Express.js 5.2.1** - Web application framework
- **JavaScript (ES Modules)** - Modern JavaScript syntax

### **AI & ML Services**

- **@google/generative-ai (0.24.1)** - Google Gemini LLM integration
- **@huggingface/inference (4.13.7)** - Text embedding generation
- **@qdrant/js-client-rest (1.16.2)** - Vector database client

### **Data & Storage**

- **Redis (5.10.0)** - Session management and caching
- **Qdrant Cloud** - Vector database (cloud-hosted)

### **Utilities**

- **Axios (1.13.2)** - HTTP client for API requests
- **Cheerio (1.1.2)** - Web scraping (for news ingestion)
- **dotenv (17.2.3)** - Environment variable management
- **CORS (2.8.5)** - Cross-Origin Resource Sharing
- **body-parser (2.2.2)** - Request body parsing

### **Backend Structure**

```
rag-backend/
├── src/
│   ├── routes/          # API route handlers
│   ├── services/        # Business logic (Redis, Qdrant, HuggingFace, Gemini)
│   ├── scripts/         # One-time scripts (data ingestion)
│   ├── utils/           # Helper functions
│   └── server.js        # Main server entry point
├── data/                # Ingested data (news articles)
└── package.json
```

---

## 🎨 Frontend Technologies

### **Core Framework**

- **React 19.2.0** - UI library with latest features
- **TypeScript 5.9.3** - Type-safe JavaScript
- **Vite 7.2.4** - Lightning-fast build tool and dev server

### **UI & Styling**

- **SCSS/Sass (1.97.2)** - Enhanced CSS with variables and nesting
- **Framer Motion (12.26.2)** - Smooth animations and transitions
- **CSS Modules** - Scoped component styling

### **State & Data Management**

- **Axios (1.13.2)** - HTTP client with interceptors
- **UUID (13.0.0)** - Session ID generation
- **Custom Hooks** - React hooks for chat history, auto-scroll, sessions

### **PWA Features**

- **vite-plugin-pwa (1.2.0)** - Progressive Web App capabilities
- **Service Workers** - Offline support and caching
- **Web Manifest** - Installable app configuration

### **Development Tools**

- **ESLint (9.39.1)** - Code linting
- **TypeScript ESLint (8.46.4)** - TypeScript-specific linting
- **@vitejs/plugin-react-swc (4.2.2)** - Fast React refresh

### **Frontend Structure**

```
rag-frontend/
├── src/
│   ├── api/             # API client and endpoints
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page-level components
│   ├── styles/          # Global styles and variables
│   ├── types/           # TypeScript definitions
│   ├── utils/           # Helper functions
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── public/              # Static assets (PWA icons)
└── package.json
```

---

## ✨ Features

### **Backend Features**

- ✅ **Vector Search** - Semantic similarity search using embeddings
- ✅ **Session Management** - Persistent chat sessions with Redis
- ✅ **Context Retrieval** - Top 3 relevant chunks for each query
- ✅ **AI Response Generation** - LLM-powered answers with context
- ✅ **RESTful API** - Clean, documented endpoints
- ✅ **Error Handling** - Comprehensive error responses
- ✅ **Data Ingestion** - Scripts for loading knowledge base
- ✅ **Health Checks** - Server and service status monitoring

### **Frontend Features**

- 💬 **Real-time Chat** - Smooth, responsive messaging interface
- 🔄 **Session Persistence** - Chat history across page refreshes
- 📱 **Progressive Web App** - Installable on mobile and desktop
- 🎨 **Modern UI/UX** - Dark theme with glassmorphism effects
- ⚡ **Smooth Animations** - Framer Motion powered transitions
- 🔌 **Offline Support** - Service worker with offline fallback
- 📱 **Fully Responsive** - Mobile, tablet, and desktop optimized
- 🎯 **Type Safety** - End-to-end TypeScript coverage
- 🔐 **Session Reset** - Clear chat with confirmation dialog

---

## 📁 Project Structure

```
rag-project-chat-bot/
├── rag-backend/              # Backend server
│   ├── src/
│   │   ├── routes/           # API endpoints
│   │   │   └── chat.js       # Chat routes
│   │   ├── services/
│   │   │   ├── redis.js      # Session management
│   │   │   ├── qdrant.js     # Vector DB operations
│   │   │   ├── embedding.js  # HuggingFace integration
│   │   │   └── gemini.js     # Google Gemini LLM
│   │   ├── scripts/
│   │   │   ├── fetchNews.js  # News scraping
│   │   │   └── ingestVectors.js # Vector ingestion
│   │   ├── utils/
│   │   │   └── chunking.js   # Text chunking utility
│   │   └── server.js         # Express server
│   ├── data/                 # Knowledge base
│   ├── .env                  # Environment variables
│   └── package.json
│
├── rag-frontend/             # React frontend
│   ├── src/
│   │   ├── api/              # API integration
│   │   │   ├── client.ts     # Axios instance
│   │   │   └── chat.ts       # Chat API methods
│   │   ├── components/       # UI components
│   │   │   ├── ChatInput/
│   │   │   ├── ChatMessage/
│   │   │   ├── EmptyState/
│   │   │   ├── ErrorBoundary/
│   │   │   ├── Header/
│   │   │   └── TypingIndicator/
│   │   ├── hooks/            # Custom hooks
│   │   │   ├── useAutoScroll.ts
│   │   │   ├── useChatHistory.ts
│   │   │   └── useSession.ts
│   │   ├── pages/
│   │   │   └── Chat/         # Main chat page
│   │   ├── styles/           # Global styles
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # Utilities
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/               # PWA assets
│   ├── .env                  # Frontend config
│   └── package.json
│
└── README.md                 # This file
```

---

## 🚀 Getting Started

### **Prerequisites**

- **Node.js** 18+ and npm
- **Redis** instance (local or cloud)
- **Qdrant Cloud** account (or local Qdrant)
- **API Keys**:
  - HuggingFace API token
  - Google Gemini API key

### **Installation**

#### **1. Clone the Repository**

```bash
git clone <repository-url>
cd rag-project-chat-bot
```

#### **2. Backend Setup**

```bash
cd rag-backend
npm install
```

Create `.env` file:

```env
# Server
PORT=3000

# Redis
REDIS_URL=redis://default:password@redis-cloud-url:port

# Qdrant Vector DB
QDRANT_URL=https://your-cluster.qdrant.io
QDRANT_API_KEY=your_qdrant_api_key

# HuggingFace
HUGGINGFACE_API_TOKEN=your_huggingface_token

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key

# Session
REDIS_SESSION_TTL=1800  # 30 minutes
```

**Ingest Data:**

```bash
# Optional: Fetch news articles (one-time)
node src/scripts/fetchNews.js

# Ingest vectors into Qdrant
node src/scripts/ingestVectors.js
```

**Start Backend:**

```bash
npm start           # Production
npm run dev         # Development (auto-reload)
```

Server runs at `http://localhost:3000`

#### **3. Frontend Setup**

```bash
cd rag-frontend
npm install
```

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000
```

**Start Frontend:**

```bash
npm run dev         # Development server
```

App runs at `http://localhost:5173`

---

## 🔐 Environment Setup

### **Backend Environment Variables**

| Variable                | Required | Description                           |
| ----------------------- | -------- | ------------------------------------- |
| `PORT`                  | No       | Server port (default: 3000)           |
| `REDIS_URL`             | Yes      | Redis connection string               |
| `QDRANT_URL`            | Yes      | Qdrant cloud/local URL                |
| `QDRANT_API_KEY`        | Yes      | Qdrant authentication key             |
| `HUGGINGFACE_API_TOKEN` | Yes      | HuggingFace API token                 |
| `GEMINI_API_KEY`        | Yes      | Google Gemini API key                 |
| `REDIS_SESSION_TTL`     | No       | Session expiry in seconds (def: 1800) |

### **Frontend Environment Variables**

| Variable            | Required | Description                       |
| ------------------- | -------- | --------------------------------- |
| `VITE_API_BASE_URL` | No       | Backend URL (def: localhost:3000) |

---

## 📡 API Documentation

### **Base URL:** `http://localhost:3000`

### **1. Health Check**

```http
GET /health
```

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2026-01-15T12:00:00.000Z",
  "service": "RAG Chat API",
  "redis": "connected"
}
```

---

### **2. Send Chat Message**

```http
POST /api/chat
Content-Type: application/json
```

**Request Body:**

```json
{
  "sessionId": "uuid-string",
  "message": "What are the latest news about AI?"
}
```

**Response:**

```json
{
  "success": true,
  "sessionId": "uuid-string",
  "userMessage": "What are the latest news about AI?",
  "retrievedChunks": [
    {
      "score": 0.85,
      "text": "Article content...",
      "title": "Article Title",
      "url": "https://...",
      "metadata": { ... }
    }
  ],
  "message": "Query processed successfully"
}
```

---

### **3. Get Chat History**

```http
GET /api/history/:sessionId
```

**Response:**

```json
{
  "success": true,
  "sessionId": "uuid-string",
  "messages": [
    {
      "role": "user",
      "content": "Your question",
      "timestamp": "2026-01-15T12:00:00.000Z"
    },
    {
      "role": "assistant",
      "content": "{\"retrievedChunks\": [...]}",
      "timestamp": "2026-01-15T12:00:01.000Z"
    }
  ],
  "messageCount": 2,
  "ttl": 1799,
  "ttlMinutes": 30
}
```

---

### **4. Clear Session**

```http
DELETE /api/session/:sessionId
```

**Response:**

```json
{
  "success": true,
  "sessionId": "uuid-string",
  "message": "Session cleared successfully"
}
```

---

## 🧪 Testing

### **Backend Testing**

```bash
cd rag-backend

# Health check
curl http://localhost:3000/health

# Send message
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "test-123", "message": "Tell me about AI"}'

# Get history
curl http://localhost:3000/api/history/test-123

# Clear session
curl -X DELETE http://localhost:3000/api/session/test-123
```

See [API_TESTING.md](rag-backend/API_TESTING.md) for detailed testing guide.

### **Frontend Testing**

```bash
cd rag-frontend

# Development
npm run dev

# Production build test
npm run build
npm run preview
```

---

## 📱 Progressive Web App (PWA)

### **Installation**

**Desktop (Chrome/Edge):**

- Click install icon in address bar
- Or browser menu → "Install RAG Chatbot"

**Mobile (iOS/Android):**

- Open share menu
- Select "Add to Home Screen"

### **Features**

- 📦 Offline asset caching
- 🔄 Background sync
- 📲 Installable app
- 🎨 Themed splash screen
- ⚡ Fast loading

---

## 🐛 Troubleshooting

### **Backend Issues**

**Redis connection failed:**

- Verify `REDIS_URL` in `.env`
- Check Redis Cloud dashboard
- Test connection: `redis-cli ping`

**Qdrant query failed:**

- Confirm vectors are ingested: `node src/scripts/ingestVectors.js`
- Verify `QDRANT_URL` and `QDRANT_API_KEY`

**HuggingFace 429 errors:**

- Rate limit exceeded
- Wait or upgrade HuggingFace plan

### **Frontend Issues**

**Cannot connect to server:**

- Ensure backend is running
- Check `VITE_API_BASE_URL` in `.env`
- Verify CORS is enabled

**Session not persisting:**

- Check browser localStorage
- Disable blocking extensions
- Clear browser cache

---

## 🚢 Deployment

### **Backend**

**Recommended Platforms:**

- Railway
- Render
- Heroku
- DigitalOcean App Platform

**Environment:**

- Set all `.env` variables
- Use Redis cloud (not local)
- Qdrant Cloud recommended

### **Frontend**

**Recommended Platforms:**

- Vercel
- Netlify
- Cloudflare Pages

**Build Command:** `npm run build`  
**Output Directory:** `dist`

**Update `.env` for production:**

```env
VITE_API_BASE_URL=https://your-backend-url.com
```

---

## 📄 Documentation

- [Backend Testing Guide](rag-backend/API_TESTING.md)
- [Frontend README](rag-frontend/README.md)
- [Gemini Setup](rag-backend/GEMINI_SETUP.md)
- [Testing Guide](rag-backend/TESTING_GUIDE.md)

---

## 🔮 Future Enhancements

- [ ] User authentication & authorization
- [ ] Multi-user chat rooms
- [ ] File upload for knowledge base
- [ ] Voice input/output
- [ ] Conversation export (PDF/JSON)
- [ ] Admin dashboard for analytics
- [ ] Multi-language support
- [ ] Dark/light theme toggle

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is part of a Full Stack RAG Chatbot assignment.

---

## 🙏 Acknowledgments

- **Google Gemini** - LLM API
- **HuggingFace** - Embedding models
- **Qdrant** - Vector database
- **Redis Labs** - Session storage
- **Vite** - Fast build tooling
- **Framer Motion** - Animation library

---

## 📧 Contact

For questions or support, please open an issue in the repository.

---

**Built with ❤️ using Node.js, Express, React, TypeScript, and bleeding-edge AI technologies**
