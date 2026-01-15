# RAG Chatbot Frontend

A production-quality **Progressive Web App (PWA)** built with React + TypeScript + Vite for a RAG-powered (Retrieval-Augmented Generation) chatbot. Features modern UI, smooth animations, and robust session management.

![PWA Icon](/public/pwa-512x512.png)

## ✨ Features

- 💬 **Real-time Chat Interface** - Smooth, responsive chat experience
- 🔄 **Session Management** - Persistent sessions across page refreshes
- 📱 **Progressive Web App** - Installable on mobile and desktop
- 🎨 **Modern UI/UX** - Dark theme with glassmorphism effects
- ⚡ **Smooth Animations** - Powered by Framer Motion
- 🔌 **Offline Support** - Service worker with offline fallback
- 📱 **Fully Responsive** - Mobile, tablet, and desktop optimized
- 🎯 **TypeScript** - Full type safety throughout

## 🚀 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **SCSS Modules** - Scoped styling
- **Vite PWA Plugin** - PWA functionality

## 📁 Project Structure

```
src/
├── api/              # API layer
│   ├── client.ts     # Axios instance with interceptors
│   └── chat.ts       # Chat API methods
├── components/       # Reusable UI components
│   ├── ChatInput/
│   ├── ChatMessage/
│   ├── EmptyState/
│   ├── ErrorBoundary/
│   ├── Header/
│   └── TypingIndicator/
├── hooks/            # Custom React hooks
│   ├── useAutoScroll.ts
│   ├── useChatHistory.ts
│   └── useSession.ts
├── pages/            # Page components
│   └── Chat/
├── styles/           # Global styles and variables
│   ├── globals.scss
│   └── variables.scss
├── types/            # TypeScript type definitions
│   └── index.ts
├── utils/            # Utility functions
│   ├── constants.ts
│   └── session.ts
├── App.tsx           # Main app component
└── main.tsx          # Entry point
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend server running (default: `http://localhost:3000`)

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure backend URL** (optional):

   Edit `.env` file:

   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

3. **Run development server:**

   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## 🔐 Session Management

### How It Works

1. **Session Creation:**

   - On first app load, a unique `sessionId` (UUID v4) is generated
   - Session is saved to `localStorage` under key `chatSessionId`

2. **Session Persistence:**

   - Sessions persist across page refreshes
   - Same `sessionId` is reused for all API requests
   - Chat history is loaded on app initialization

3. **Session Reset:**
   - Click "Reset Chat" button in header
   - Confirmation dialog prevents accidental resets
   - Backend session is cleared via `DELETE /api/session/:sessionId`
   - New `sessionId` is generated
   - UI is cleared

### Session Flow Diagram

```
App Load → Check localStorage → Session exists?
                                    ├─ Yes → Load sessionId + fetch history
                                    └─ No  → Generate new sessionId → Save to localStorage

User clicks Reset → Confirm → DELETE API call → Clear localStorage → Generate new sessionId
```

## 📱 PWA Features

### Installation

**Desktop (Chrome/Edge):**

- Click install icon in address bar
- Or use browser menu → "Install RAG Chatbot"

**Mobile (iOS/Android):**

- Open share menu
- Select "Add to Home Screen"

### Offline Support

- Service worker caches app assets
- Offline fallback UI when network unavailable
- Auto-updates when new version available

### Manifest Configuration

Located in `vite.config.ts`:

- App name: "RAG Chatbot"
- Theme color: #6366f1 (Indigo)
- Background: #0f172a (Dark Navy)
- Display: Standalone
- Icons: 192x192, 512x512 (with maskable support)

## 🔌 Backend API Integration

The frontend integrates with these backend endpoints:

### POST /api/chat

Send a chat message and receive AI response.

**Request:**

```json
{
  "sessionId": "uuid-string",
  "message": "Your question here"
}
```

**Response:**

```json
{
  "answer": "AI response",
  "sources": [...]
}
```

### GET /api/history/:sessionId

Retrieve chat history for a session.

**Response:**

```json
[
  { "role": "user", "content": "Question" },
  { "role": "assistant", "content": "Answer" }
]
```

### DELETE /api/session/:sessionId

Clear a chat session.

**Response:** 204 No Content

## 🎨 Theming & Customization

### Color Scheme

Colors are defined in `src/styles/variables.scss`:

```scss
$primary: #6366f1; // Indigo
$secondary: #8b5cf6; // Purple
$bg-dark: #0f172a; // Dark navy
$text-primary: #f1f5f9; // Light gray
```

### Changing Theme

1. Edit `src/styles/variables.scss`
2. Update colors in `vite.config.ts` manifest
3. Regenerate PWA icons to match new colors

## 🧪 Development Tips

### Testing Session Reset

1. Send a few messages
2. Open DevTools → Application → Local Storage
3. Note the `chatSessionId` value
4. Click "Reset Chat" and confirm
5. Verify new `sessionId` is different
6. Confirm messages are cleared

### Testing PWA

```bash
# Build and preview (required for PWA testing)
npm run build
npm run preview
```

Then test installability in Chrome DevTools → Application → Manifest

### API Error Simulation

Set incorrect `VITE_API_BASE_URL` in `.env` to test error states:

```env
VITE_API_BASE_URL=http://localhost:9999
```

## 📦 Environment Variables

| Variable            | Default                 | Description          |
| ------------------- | ----------------------- | -------------------- |
| `VITE_API_BASE_URL` | `http://localhost:3000` | Backend API base URL |

## 🚨 Troubleshooting

**"Cannot connect to server" error:**

- Ensure backend is running on correct port
- Check `VITE_API_BASE_URL` in `.env`
- Verify CORS is enabled on backend

**PWA not installing:**

- Must be served over HTTPS (or localhost)
- Run `npm run build && npm run preview`
- Check manifest in DevTools → Application

**Session not persisting:**

- Check browser localStorage isn't disabled
- Verify no browser extensions blocking localStorage
- Check console for errors

## 📄 License

This project is part of a Full Stack RAG Chatbot assignment.

## 🙏 Acknowledgments

- Backend API integration
- Framer Motion for animations
- Vite for blazing-fast development
- React team for an amazing library

---

**Built with ❤️ using React + TypeScript + Vite**
