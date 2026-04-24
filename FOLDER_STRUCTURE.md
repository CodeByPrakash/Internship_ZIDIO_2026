# IntellMeet – Complete Folder Structure (Days 1–28)

> ✅ = Already built | 🔲 = Planned | Week shown in brackets

---

## Root
```
IntellMeet/
├── .gitignore              ✅ Day 1
├── README.md               ✅ Day 1
├── ROADMAP.md              ✅ Reference
├── FOLDER_STRUCTURE.md     ✅ This file
├── docker-compose.yml      🔲 Day 22
├── server/
└── client/
```

---

## server/

```
server/
├── package.json            ✅ Day 1 (updated Days 3–5)
├── tsconfig.json           ✅ Day 1
├── .env.example            ✅ Day 1 (updated Days 3–5)
├── Dockerfile              🔲 Day 22
│
└── src/
    │
    ├── index.ts            ✅ Day 1 → refactored Day 5
    │
    ├── config/
    │   ├── db.ts           ✅ Day 1 — MongoDB + retry logic
    │   ├── env.ts          ✅ Day 1 → updated Days 3, 5
    │   ├── cloudinary.ts   ✅ Day 3 — upload/destroy helpers
    │   ├── redis.ts        ✅ Day 5 — ioredis + pub/sub clients
    │   └── socket.ts       ✅ Day 5 — Socket.io + JWT auth + Redis adapter
    │
    ├── models/
    │   ├── User.ts         ✅ Day 2 → updated Day 3 (bio, avatar)
    │   ├── Meeting.ts      ✅ Day 4 — UUID roomId, participants, status
    │   ├── Message.ts      🔲 Day 6 — chat messages (meeting ref, type, readBy)
    │   ├── Notification.ts 🔲 Day 6 — in-app notifications
    │   ├── Workspace.ts    🔲 Day 18 — team workspaces
    │   ├── Project.ts      🔲 Day 18 — Kanban project boards
    │   └── Task.ts         🔲 Day 18 — tasks with meeting ref
    │
    ├── controllers/
    │   ├── auth.controller.ts      ✅ Day 2 — signup/login/refresh/logout/me
    │   ├── user.controller.ts      ✅ Day 3 — profile/avatar CRUD
    │   ├── meeting.controller.ts   ✅ Day 4+5 — CRUD+join/leave/end + Redis cache
    │   ├── chat.controller.ts      🔲 Day 6 — save/retrieve chat messages
    │   ├── notification.controller.ts  🔲 Day 6 — CRUD + mark-read
    │   ├── ai.controller.ts        🔲 Day 15–16 — transcribe, summarize, action items
    │   ├── workspace.controller.ts 🔲 Day 18 — workspace CRUD + member management
    │   ├── project.controller.ts   🔲 Day 18 — project + column CRUD
    │   └── task.controller.ts      🔲 Day 19 — task CRUD + from-action-item
    │
    ├── routes/
    │   ├── auth.routes.ts          ✅ Day 2 → rate-limited Day 3
    │   ├── user.routes.ts          ✅ Day 3 — profile + avatar
    │   ├── meeting.routes.ts       ✅ Day 4 — CRUD + join/leave/end
    │   ├── chat.routes.ts          🔲 Day 6 — message history endpoint
    │   ├── notification.routes.ts  🔲 Day 6 — list, mark-read
    │   ├── ai.routes.ts            🔲 Day 15 — transcribe, summary
    │   ├── workspace.routes.ts     🔲 Day 18
    │   ├── project.routes.ts       🔲 Day 18
    │   └── task.routes.ts          🔲 Day 19
    │
    ├── middleware/
    │   ├── auth.middleware.ts      ✅ Day 2 — protect + authorize (RBAC)
    │   ├── validate.middleware.ts  ✅ Day 2 — express-validator wrapper
    │   ├── error.middleware.ts     ✅ Day 2 — global error handler
    │   └── rateLimit.middleware.ts ✅ Day 3 — authLimiter + apiLimiter
    │
    ├── sockets/
    │   ├── meeting.socket.ts       ✅ Day 4 — WebRTC relay (offer/answer/ICE)
    │   ├── chat.socket.ts          🔲 Day 6 — send-message, typing, read-receipt
    │   └── notification.socket.ts  🔲 Day 6 — real-time notify emit
    │
    ├── utils/
    │   ├── jwt.ts          ✅ Day 2 — access (15m) + refresh (7d) tokens
    │   ├── logger.ts       ✅ Day 1 — Winston dev/prod formats
    │   ├── upload.ts       ✅ Day 3 — multer memoryStorage, 5MB, image filter
    │   ├── cache.ts        ✅ Day 5 — cacheGet/Set/Del/DelPattern
    │   ├── email.ts        🔲 Day 17 — nodemailer / Resend for meeting summaries
    │   └── pdf.ts          🔲 Day 17 — post-meeting PDF export helper
    │
    ├── services/
    │   ├── ai.service.ts       🔲 Day 15 — OpenAI Whisper transcription
    │   ├── summary.service.ts  🔲 Day 16 — GPT-4o summary + action item extraction
    │   └── storage.service.ts  🔲 Day 17 — recording storage (Cloudinary/S3)
    │
    └── types/
        └── express.d.ts        🔲 Day 6 — augment req.user globally (DRY)
```

---

## client/

```
client/
├── package.json            ✅ Day 1 (updated Day 8)
├── tsconfig.json           ✅ Day 1
├── tsconfig.node.json      ✅ Day 1
├── vite.config.ts          ✅ Day 1
├── index.html              ✅ Day 1
├── Dockerfile              🔲 Day 22
│
└── src/
    │
    ├── main.tsx            ✅ Day 1 — QueryClientProvider + BrowserRouter
    ├── App.tsx             ✅ Day 1 → full router Day 9
    ├── index.css           ✅ Day 1 — Tailwind v4 + dark theme tokens
    │
    ├── lib/
    │   ├── axios.ts        ✅ Day 1 — Axios + auto-refresh interceptor
    │   ├── socket.ts       🔲 Day 8 — socket.io-client instance with auth token
    │   └── queryClient.ts  🔲 Day 8 — TanStack QueryClient config
    │
    ├── store/
    │   ├── auth.store.ts   ✅ Day 1 — Zustand: user + accessToken (token not persisted)
    │   ├── meeting.store.ts 🔲 Day 10 — active meeting state (roomId, participants, stream)
    │   └── ui.store.ts      🔲 Day 10 — sidebar, modals, panel state
    │
    ├── hooks/
    │   ├── useAuth.ts          🔲 Day 9 — TanStack mutation wrapper (login/signup/logout)
    │   ├── useMeeting.ts       🔲 Day 10 — meeting CRUD mutations + queries
    │   ├── useWebRTC.ts        🔲 Day 10 — peer connections, getUserMedia, ICE
    │   ├── useChat.ts          🔲 Day 11 — socket chat events
    │   ├── useScreenShare.ts   🔲 Day 12 — getDisplayMedia + track replacement
    │   ├── useRecording.ts     🔲 Day 12 — MediaRecorder chunks + upload
    │   ├── useNotifications.ts 🔲 Day 20 — socket notification events
    │   └── useWorkspace.ts     🔲 Day 18 — workspace/project/task queries
    │
    ├── pages/
    │   ├── Home.tsx                  🔲 Day 9  — landing / marketing page
    │   ├── auth/
    │   │   ├── Login.tsx             🔲 Day 9  — form + validation
    │   │   └── Signup.tsx            🔲 Day 9  — form + avatar upload
    │   ├── dashboard/
    │   │   ├── Dashboard.tsx         🔲 Day 10 — meetings list + "New Meeting" CTA
    │   │   └── MeetingCard.tsx       🔲 Day 10 — upcoming/past meeting card
    │   ├── meeting/
    │   │   ├── MeetingLobby.tsx      🔲 Day 10 — pre-join: cam/mic check
    │   │   ├── MeetingRoom.tsx       🔲 Day 10 — video grid + controls
    │   │   ├── VideoGrid.tsx         🔲 Day 10 — remote peer video tiles
    │   │   ├── Controls.tsx          🔲 Day 12 — mute/cam/share/record/leave
    │   │   ├── ChatPanel.tsx         🔲 Day 11 — slide-out chat with typing indicator
    │   │   ├── ParticipantPanel.tsx  🔲 Day 13 — list w/ presence + host controls
    │   │   └── TranscriptPanel.tsx   🔲 Day 15 — live AI transcript stream
    │   ├── post-meeting/
    │   │   ├── MeetingSummary.tsx    🔲 Day 17 — AI summary + action items
    │   │   └── MeetingHistory.tsx    🔲 Day 5  — searchable past meetings
    │   ├── workspace/
    │   │   ├── WorkspaceList.tsx     🔲 Day 18 — team workspaces
    │   │   ├── KanbanBoard.tsx       🔲 Day 18 — drag-and-drop board
    │   │   ├── TaskModal.tsx         🔲 Day 19 — create/edit task
    │   │   └── TaskFromAction.tsx    🔲 Day 19 — convert action item to task
    │   ├── analytics/
    │   │   └── AnalyticsDashboard.tsx 🔲 Day 21 — charts + meeting metrics
    │   └── profile/
    │       └── ProfilePage.tsx       🔲 Day 9  — view + edit profile/avatar
    │
    ├── components/
    │   ├── ui/                       🔲 Day 8  — shadcn/ui shims (Button, Input, Modal…)
    │   ├── layout/
    │   │   ├── AppShell.tsx          🔲 Day 9  — sidebar + topbar wrapper
    │   │   ├── Sidebar.tsx           🔲 Day 9  — nav links, workspace switcher
    │   │   └── TopBar.tsx            🔲 Day 9  — user menu, notifications bell
    │   ├── common/
    │   │   ├── Avatar.tsx            🔲 Day 9  — user avatar w/ fallback initials
    │   │   ├── LoadingSpinner.tsx    🔲 Day 9
    │   │   ├── ProtectedRoute.tsx    ✅ Day 1  — redirect to /login if no token
    │   │   └── Toast.tsx             🔲 Day 8  — react-hot-toast wrapper
    │   └── notifications/
    │       ├── NotificationBell.tsx  🔲 Day 20 — badge + dropdown
    │       └── NotificationList.tsx  🔲 Day 20
    │
    └── types/
        ├── api.types.ts      🔲 Day 9 — shared API response interfaces
        ├── meeting.types.ts  🔲 Day 10
        ├── socket.types.ts   🔲 Day 11 — socket event payload types
        └── ai.types.ts       🔲 Day 15 — transcript/summary/action item types
```

---

## DevOps (Week 4)

```
IntellMeet/
├── docker-compose.yml          🔲 Day 22
├── .github/
│   └── workflows/
│       ├── ci.yml              🔲 Day 24 — lint + test
│       └── deploy.yml          🔲 Day 24 — build + push + deploy
├── k8s/                        🔲 Day 23
│   ├── server-deployment.yaml
│   ├── client-deployment.yaml
│   ├── server-service.yaml
│   ├── client-service.yaml
│   ├── ingress.yaml
│   ├── hpa.yaml                — HorizontalPodAutoscaler
│   ├── configmap.yaml
│   └── secret.yaml
├── helm/                       🔲 Day 23
│   └── intellmeet/
│       ├── Chart.yaml
│       ├── values.yaml
│       └── templates/          — wraps k8s/ manifests
└── monitoring/                 🔲 Day 26
    ├── prometheus.yml
    └── grafana-dashboard.json
```

---

## Summary by Week

| Week | Days | Focus |
|------|------|-------|
| 1 | 1–7 | Backend foundation: auth, profiles, meetings, WebRTC, Redis, Socket.io |
| 2 | 8–14 | Frontend: auth UI, video room, chat, screen share, participants |
| 3 | 15–21 | AI: transcription, summaries, action items, Kanban, notifications |
| 4 | 22–28 | DevOps: Docker, K8s, CI/CD, monitoring, QA |
