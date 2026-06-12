# IntellMeet — Project Folder Structure

> ✅ = Completed | 🔲 = Planned

## Root
```
intellmeet/
├── .github/
│   └── workflows/
│       └── ci.yml                    ✅ GitHub Actions CI/CD
├── client/                           ✅ React Frontend
├── server/                           ✅ Node.js Backend
├── k8s/
│   └── intellmeet.yaml               ✅ Kubernetes manifests
├── monitoring/
│   └── prometheus.yml                 ✅ Prometheus config
├── docker-compose.yml                 ✅ Docker orchestration
├── README.md                          ✅ Full documentation
├── ROADMAP.md                         ✅ 28-day development plan
└── FOLDER_STRUCTURE.md                ✅ This file
```

## Server (`server/`)
```
server/
├── src/
│   ├── config/
│   │   ├── db.ts                      ✅ MongoDB connection
│   │   ├── env.ts                     ✅ Environment variables
│   │   ├── redis.ts                   ✅ Redis connection + pub/sub
│   │   ├── cloudinary.ts              ✅ Cloudinary media uploads
│   │   └── socket.ts                  ✅ Socket.io server + namespaces
│   ├── controllers/
│   │   ├── auth.controller.ts         ✅ JWT signup/login/refresh/logout
│   │   ├── user.controller.ts         ✅ Profile CRUD + avatar upload
│   │   ├── meeting.controller.ts      ✅ Meeting CRUD + join/leave/end
│   │   ├── chat.controller.ts         ✅ Message history (paginated)
│   │   ├── notification.controller.ts ✅ Notification CRUD + mark read
│   │   ├── ai.controller.ts           ✅ Transcription + summarization
│   │   └── workspace.controller.ts    ✅ Workspace/Project/Task CRUD
│   ├── middleware/
│   │   ├── auth.middleware.ts         ✅ JWT protect + role-based
│   │   ├── error.middleware.ts        ✅ Global error handler
│   │   └── rateLimit.middleware.ts    ✅ API rate limiting
│   ├── models/
│   │   ├── User.ts                    ✅ User schema (auth + profile)
│   │   ├── Meeting.ts                 ✅ Meeting schema (+ AI fields)
│   │   ├── Message.ts                 ✅ Chat message schema
│   │   ├── Notification.ts            ✅ Notification schema
│   │   ├── Workspace.ts               ✅ Workspace schema
│   │   ├── Project.ts                 ✅ Project (Kanban) schema
│   │   └── Task.ts                    ✅ Task schema
│   ├── routes/
│   │   ├── auth.routes.ts             ✅ Auth endpoints
│   │   ├── user.routes.ts             ✅ User endpoints
│   │   ├── meeting.routes.ts          ✅ Meeting endpoints
│   │   ├── chat.routes.ts             ✅ Chat endpoints
│   │   ├── notification.routes.ts     ✅ Notification endpoints
│   │   ├── ai.routes.ts               ✅ AI endpoints
│   │   └── workspace.routes.ts        ✅ Workspace/Project/Task endpoints
│   ├── sockets/
│   │   ├── meeting.socket.ts          ✅ WebRTC signaling (offer/answer/ICE)
│   │   ├── chat.socket.ts             ✅ Real-time messaging
│   │   └── notification.socket.ts     ✅ Push notifications
│   ├── types/
│   │   └── express.d.ts               ✅ Request type augmentation
│   ├── utils/
│   │   ├── jwt.ts                     ✅ Token generation/verification
│   │   ├── cache.ts                   ✅ Redis cache helpers
│   │   ├── logger.ts                  ✅ Winston logger
│   │   └── upload.ts                  ✅ Multer file upload
│   └── index.ts                       ✅ Express app entry point
├── Dockerfile                         ✅ Multi-stage production build
├── package.json                       ✅ Dependencies
├── tsconfig.json                      ✅ TypeScript config
└── .env.example                       ✅ Environment template
```

## Client (`client/`)
```
client/
├── src/
│   ├── components/
│   │   └── layout/
│   │       └── AppShell.tsx           ✅ Sidebar + TopBar + Outlet
│   ├── hooks/
│   │   ├── useAuth.ts                 ✅ Auth mutations/queries
│   │   └── useMeeting.ts             ✅ Meeting mutations/queries
│   ├── lib/
│   │   ├── axios.ts                   ✅ Axios interceptors + refresh
│   │   └── socket.ts                  ✅ Socket.io client instances
│   ├── pages/
│   │   ├── Home.tsx                   ✅ Landing page (hero + features)
│   │   ├── auth/
│   │   │   ├── Login.tsx              ✅ Login form (glassmorphism)
│   │   │   └── Signup.tsx             ✅ Signup form
│   │   ├── dashboard/
│   │   │   └── Dashboard.tsx          ✅ Stats + meeting list + create
│   │   ├── meeting/
│   │   │   └── MeetingRoom.tsx        ✅ Video grid + controls + panels
│   │   ├── post-meeting/
│   │   │   └── MeetingSummary.tsx      ✅ AI summary + transcript
│   │   ├── profile/
│   │   │   └── ProfilePage.tsx        ✅ Profile edit + avatar
│   │   ├── workspace/
│   │   │   └── KanbanBoard.tsx        ✅ Kanban columns + task cards
│   │   └── analytics/
│   │       └── AnalyticsDashboard.tsx  ✅ Metrics + charts + insights
│   ├── store/
│   │   ├── auth.store.ts              ✅ Zustand auth persistence
│   │   └── ui.store.ts                ✅ UI state (sidebar, modals)
│   ├── types/
│   │   └── api.types.ts               ✅ Shared TypeScript interfaces
│   ├── App.tsx                        ✅ Full router + protected routes
│   ├── main.tsx                       ✅ React entry + QueryClient
│   └── index.css                      ✅ Premium design system (dark)
├── index.html                         ✅ SEO + Google Fonts
├── Dockerfile                         ✅ Nginx production build
├── package.json                       ✅ Dependencies
├── tsconfig.json                      ✅ TypeScript config
└── vite.config.ts                     ✅ Vite configuration
```

## Status Summary

| Phase | Days | Status |
|-------|------|--------|
| Backend Foundation | 1-5 | ✅ Complete |
| Chat & Notifications | 6-7 | ✅ Complete |
| Frontend UI | 8-14 | ✅ Complete |
| AI Features | 15-17 | ✅ Complete (Mock) |
| Workspace & Collaboration | 18-21 | ✅ Complete |
| DevOps & Production | 22-28 | ✅ Complete |
