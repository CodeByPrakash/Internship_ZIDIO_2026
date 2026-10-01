# IntellMeet — AI-Powered Enterprise Meeting & Collaboration Platform

> Transforming every meeting into actionable results with real-time video, AI transcription, smart summaries, and seamless team collaboration.

![IntellMeet](https://img.shields.io/badge/IntellMeet-Enterprise-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPjxwb2x5bGluZSBwb2ludHM9IjEzIDIgMyAxNCAzIDIyIiAvPjxwb2x5bGluZSBwb2ludHM9IjExIDIyIDIxIDEwIDIxIDIiIC8+PC9zdmc+)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb)](https://mongodb.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://docker.com)

---

## 🚀 Features

### Core Meeting Platform
- **HD Video Conferencing** — WebRTC-powered peer-to-peer video calls with screen sharing
- **Real-time Chat** — In-meeting messaging with typing indicators and read receipts
- **Meeting Management** — Schedule, create, join meetings with room codes

### AI Intelligence
- **Auto Transcription** — Meeting speech-to-text powered by OpenAI Whisper (mock-ready)
- **Smart Summaries** — GPT-4o generated meeting summaries with key decisions
- **Action Items** — Automatic extraction of tasks, assignees, and due dates

### Collaboration
- **Team Workspaces** — Organize teams with role-based access control
- **Kanban Boards** — Project management with drag-and-drop task boards
- **Analytics Dashboard** — Meeting frequency, productivity metrics, engagement reports
- **Notifications** — Real-time push notifications via Socket.io

### Enterprise-Grade
- **JWT Auth** — Access/refresh token rotation with secure httpOnly cookies
- **Redis Caching** — High-performance caching with pub/sub for horizontal scaling
- **Rate Limiting** — API protection with configurable rate limits
- **Docker + K8s** — Production-ready containerization and orchestration
- **CI/CD** — GitHub Actions pipeline for automated testing and deployment

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Zustand, TanStack Query |
| **Backend** | Node.js, Express, TypeScript, Socket.io |
| **Database** | MongoDB (Mongoose ODM) |
| **Cache** | Redis (ioredis) |
| **Real-Time** | Socket.io with Redis Adapter |
| **Video** | WebRTC (native browser API) |
| **AI** | OpenAI Whisper + GPT-4o (mock-ready) |
| **Media** | Cloudinary (avatar uploads) |
| **DevOps** | Docker, Kubernetes, GitHub Actions, Prometheus |

---

## 📦 Quick Start

### Prerequisites
- Node.js v20+
- MongoDB (local or Atlas)
- Redis (optional, app degrades gracefully)

### 1. Clone & Install

```bash
git clone https://github.com/your-org/intellmeet.git
cd intellmeet

# Server
cd server && npm install && cp .env.example .env
# Edit .env with your MongoDB URI, JWT secrets, etc.

# Client
cd ../client && npm install
```

### 2. Start Development

```bash
# Terminal 1 — Server
cd server && npm run dev

# Terminal 2 — Client
cd client && npm run dev
```

### 3. Docker (Production)

```bash
docker-compose up --build
```

---

## 🔑 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | Access token secret | Required |
| `JWT_REFRESH_SECRET` | Refresh token secret | Required |
| `REDIS_URL` | Redis connection URL | Optional |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Optional |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Optional |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Optional |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `OPENAI_API_KEY` | For real AI features | Optional (uses mocks) |

---

## 📡 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh token |
| GET | `/api/users/profile` | Get profile |
| PATCH | `/api/users/profile` | Update profile |
| POST | `/api/meetings` | Create meeting |
| GET | `/api/meetings` | List meetings |
| POST | `/api/meetings/:id/join` | Join meeting |
| GET | `/api/chat/meetings/:id/messages` | Get chat history |
| GET | `/api/notifications` | Get notifications |
| POST | `/api/ai/meetings/:id/transcribe` | AI transcription |
| POST | `/api/ai/meetings/:id/summarize` | AI summary |
| POST | `/api/workspaces` | Create workspace |
| GET | `/api/workspaces` | List workspaces |
| POST | `/api/workspaces/:id/projects` | Create project |
| POST | `/api/workspaces/projects/:id/tasks` | Create task |

---

## 🏛 Architecture

```
┌─────────────┐     ┌─────────────┐     ┌──────────┐
│   React 19  │────▶│  Express    │────▶│ MongoDB  │
│  + Vite     │     │  + Socket.io│     │          │
│  + Zustand  │◀────│  + Redis    │────▶│  Redis   │
└─────────────┘     └─────────────┘     └──────────┘
     WebRTC              ▲
     P2P Video           │
                    ┌────┴────┐
                    │ OpenAI  │
                    │ Whisper │
                    │ GPT-4o  │
                    └─────────┘
```

---

## 👥 Team

**Zidio Development** — March 2026 Internship Cohort

---

## 📄 License

MIT © 2026 IntellMeet
