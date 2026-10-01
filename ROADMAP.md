# IntellMeet – Full Project Roadmap & Continuation Reference

> **For any AI/developer picking this up:** Days 1–2 are fully implemented. Start from Day 3.
> See `walkthrough.md` (in the brain artifacts dir) for what was built in Days 1-2.

---

## ✅ COMPLETED

### Day 1 – Foundation
- [x] Monorepo: `/server` (Express + TS) + `/client` (React 19 + Vite + TS)
- [x] MongoDB connection with retry logic (`server/src/config/db.ts`)
- [x] Helmet, CORS, Morgan, cookie-parser, Winston logger
- [x] `.env.example`, `tsconfig.json`, `.gitignore`, `README.md`

### Day 2 – Authentication
- [x] User model: name, email, password (bcrypt 12), role (admin/member), avatar, refreshToken
- [x] JWT: access token 15m, refresh token 7d, rotation, stored hash in DB
- [x] Auth routes: POST /api/auth/signup, /login, /refresh, /logout, GET /me
- [x] Middleware: `protect` (Bearer), `authorize` (RBAC), `validate` (express-validator), global error handler
- [x] Client: Axios instance (auto-refresh interceptor), Zustand auth store, App router, Tailwind v4 theme

**Server runs:** `cd server && npm install && npm run dev` → port 5000
**Client runs:** `cd client && npm install && npm run dev` → port 5173

---

## 🔲 REMAINING – WEEK 1 (Days 3–7)

### Day 3 – Profile & Security Hardening
**Backend:**
- [ ] Profile update route: `PATCH /api/users/profile` (name, bio, avatar)
- [ ] Avatar upload via Cloudinary (`cloudinary` + `multer` packages)
  - Multer memoryStorage → upload buffer to Cloudinary → save URL to User model
  - Add `bio`, `cloudinary_public_id` fields to User schema
- [ ] Rate limiting on auth routes using `express-rate-limit`
  - 10 requests/15min on `/api/auth/login` and `/api/auth/signup`
  - 100 requests/15min general API limit
- [ ] Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` to `.env.example`

**Key packages:** `cloudinary`, `multer`, `express-rate-limit`

### Day 4 – Meeting Model & WebRTC Signaling
**Backend:**
- [ ] Meeting Mongoose model:
  ```
  title, description, host (ref: User), participants [{user, joinedAt, leftAt, role}],
  status (scheduled|active|ended), startTime, endTime,
  roomId (uuid), recording {url, duration}, isRecorded,
  agenda, timestamps
  ```
- [ ] Meeting CRUD routes:
  - `POST /api/meetings` – create meeting (host = req.user)
  - `GET /api/meetings` – list user's meetings
  - `GET /api/meetings/:id` – get single meeting
  - `PATCH /api/meetings/:id` – update (host only)
  - `DELETE /api/meetings/:id` – cancel (host only)
  - `POST /api/meetings/:id/join` – join meeting
  - `POST /api/meetings/:id/leave` – leave meeting
- [ ] WebRTC signaling via Socket.io:
  - Events: `join-room`, `user-connected`, `user-disconnected`, `offer`, `answer`, `ice-candidate`
  - Room management: Map of roomId → Set of socketIds
  - Emit `existing-participants` to newly joined user

**Key packages:** `uuid`, `socket.io` (already in plan — add to package.json)

### Day 5 – Redis Caching & Socket.io Configuration
**Backend:**
- [ ] Redis client setup using `ioredis` (`src/config/redis.ts`)
  - Cache recently accessed meetings (TTL 5 minutes)
  - Store active Socket.io rooms in Redis (for horizontal scaling)
- [ ] Socket.io server fully configured:
  - Attach to HTTP server in `index.ts`
  - JWT auth middleware for socket connections (verify token on `io.use()`)
  - Namespace: `/meeting` for meeting-specific events
  - Namespace: `/notification` for system notifications
- [ ] Redis-backed Socket.io adapter (`@socket.io/redis-adapter`)

**Key packages:** `ioredis`, `@socket.io/redis-adapter`

### Day 6 – In-Meeting Chat & Notifications
**Backend:**
- [ ] Chat message model:
  ```
  meeting (ref), sender (ref: User), content, type (text|file|system),
  readBy [{user, readAt}], timestamps
  ```
- [ ] Socket.io chat events:
  - `send-message` → broadcast to room → save to DB async
  - `typing-start` / `typing-stop` → broadcast (no DB save)
  - `message-read` → update readBy
- [ ] Notification model:
  ```
  recipient (ref: User), type (meeting-invite|action-item|mention|system),
  title, body, data (JSON), isRead, timestamps
  ```
- [ ] Notification Socket.io events: `notify` emit to specific user's socket

### Day 7 – Week 1 Checkpoint
- [ ] Verify all backend routes work in Postman (collection export)
- [ ] End-to-end test: signup → login → create meeting → join → socket connect
- [ ] Update README with API docs
- [ ] Git commit: `feat: week-1 complete - auth, meetings, realtime, redis`

---

## 🔲 WEEK 2 – Frontend & Real-Time Meeting Core (Days 8–14)

> **Note:** Frontend scaffold (React 19, Vite, Zustand, TanStack Query, Tailwind v4) is already done from Day 1.

### Day 8 – Frontend Packages & Setup
- [ ] Install: `react-hook-form`, `zod`, `@hookform/resolvers`, `date-fns`, `react-hot-toast`
- [ ] Install WebRTC + media: `simple-peer` or native RTCPeerConnection wrappers
- [ ] Setup TanStack Query hooks for auth (`useLogin`, `useSignup`, `useMe`)
- [ ] Setup socket.io-client instance (`src/lib/socket.ts`) with auth token
- [ ] Global toast notification system (react-hot-toast)

### Day 9 – Auth Pages UI
- [ ] `/login` page – form with email/password, validation (zod + react-hook-form), loading state
- [ ] `/signup` page – form with name/email/password/confirm, avatar optional
- [ ] Auth layout component (centered card, gradient bg, IntellMeet branding)
- [ ] `useAuth` hook wrapping TanStack Query mutation + Zustand store
- [ ] Redirect to `/dashboard` on successful login
- [ ] Persist login: on app load, if `user` in Zustand → call `GET /api/auth/me` to verify + refresh token

### Day 10 – Meeting Lobby & Video Room
- [ ] Dashboard page: list upcoming meetings, "New Meeting" button, join by code
- [ ] Meeting creation modal (title, description, schedule time)
- [ ] `/meeting/:roomId` page – Video Room
  - Access camera/mic via `getUserMedia`
  - Connect to signaling socket on mount
  - Render local video + remote video grid
  - WebRTC peer connection per participant

### Day 11 – Real-Time Chat in Meeting Room
- [ ] Chat panel (slide-out) in meeting room
- [ ] Display messages with sender avatar, timestamp
- [ ] Typing indicator ("John is typing…")
- [ ] Message input with emoji support
- [ ] Auto-scroll to latest message

### Day 12 – Screen Sharing & Recording Controls
- [ ] Screen share: `getDisplayMedia()`, replace video track in peer connections
- [ ] Recording: `MediaRecorder` API → save chunks → upload to Cloudinary on stop
- [ ] Meeting controls bar: mute/unmute, cam on/off, screen share, record, leave

### Day 13 – Participant List & Presence
- [ ] Side panel: participant list with video/audio status indicators
- [ ] Host controls: mute participant, remove from meeting
- [ ] Presence: green dot for active, grey for away (via socket events)

### Day 14 – Week 2 Checkpoint
- [ ] End-to-end test: create meeting → join from 2 browser tabs → video calls working
- [ ] Chat functional, screen share functional
- [ ] Git commit: `feat: week-2 complete - video meeting UI fully functional`

---

## 🔲 WEEK 3 – AI Intelligence & Collaboration (Days 15–21)

### Day 15 – AI Transcription
- [ ] Record audio chunks in-meeting → POST to `/api/ai/transcribe`
- [ ] Backend: OpenAI Whisper API (`openai` package) or AssemblyAI
- [ ] Store transcript segments in Meeting document
- [ ] Real-time partial transcript display in meeting (via socket emit)

**Key packages:** `openai`
**Env vars:** `OPENAI_API_KEY`

### Day 16 – AI Summary & Action Items
- [ ] Post-meeting trigger: when meeting ends (status → 'ended') →
- [ ] Send full transcript to OpenAI GPT-4o with structured prompt:
  - Extract: summary (3–5 sentences), key decisions, action items with assignees
- [ ] Store in Meeting document: `aiSummary`, `actionItems [{text, assignee, dueDate, status}]`
- [ ] Route: `GET /api/meetings/:id/ai-summary`

### Day 17 – Post-Meeting Dashboard
- [ ] `/meetings/:id/summary` page
- [ ] Display: recording, transcript, AI summary, action items (with check-off)
- [ ] Export to PDF (using `jspdf` or `react-pdf`)
- [ ] Email summary to all participants (using `nodemailer` or Resend API)

### Day 18 – Team Workspace & Kanban Board
- [ ] Workspace model: `name, description, owner, members [{user, role}], projects`
- [ ] Project model: `name, workspace, columns [{name, tasks[]}]`
- [ ] Task model: `title, description, assignee, dueDate, priority, status, meetingRef`
- [ ] Kanban board UI: drag-and-drop with `@dnd-kit/core`
- [ ] Routes: CRUD for workspaces, projects, tasks

### Day 19 – Tasks from Action Items
- [ ] "Convert to Task" button on each action item in post-meeting dashboard
- [ ] Pre-fills task form with action item text + suggested assignee
- [ ] Links task back to source meeting
- [ ] View all tasks in Kanban board

### Day 20 – Notification System
- [ ] In-app notification bell with unread count
- [ ] Notifications list page
- [ ] Real-time delivery via Socket.io `/notification` namespace
- [ ] Mark as read, mark all as read
- [ ] Email notifications for action item assignments (optional)

### Day 21 – Week 3 Checkpoint
- [ ] Test AI summary on a sample 5-min recorded meeting audio
- [ ] Kanban board with drag-and-drop working
- [ ] Git commit: `feat: week-3 complete - AI intelligence and collaboration tools`

---

## 🔲 WEEK 4 – Deployment, Monitoring & Production (Days 22–28)

### Day 22 – Docker
- [ ] `server/Dockerfile` – multi-stage build (builder → production)
- [ ] `client/Dockerfile` – multi-stage (build Vite → serve with nginx)
- [ ] `docker-compose.yml` – server + client + MongoDB + Redis all orchestrated
- [ ] `.dockerignore` for both

### Day 23 – Kubernetes & Helm
- [ ] K8s manifests: `Deployment`, `Service`, `Ingress`, `ConfigMap`, `Secret` for server + client
- [ ] `HorizontalPodAutoscaler` for server (min 2, max 10 replicas)
- [ ] Helm chart wrapping all manifests
- [ ] Redis via Helm chart (`bitnami/redis`)

### Day 24 – GitHub Actions CI/CD
- [ ] Pipeline on push to `main`:
  1. Lint + TypeScript check
  2. Unit tests (Jest/Vitest)
  3. Docker build + push to registry (GHCR or ECR)
  4. Deploy to K8s cluster (kubectl apply or Helm upgrade)
- [ ] Environment secrets in GitHub Actions secrets

### Day 25 – Cloud Deployment
- [ ] Option A: AWS (EKS + MongoDB Atlas + ElastiCache Redis + S3)
- [ ] Option B: Vercel (client) + Render (server) + MongoDB Atlas (simpler)
- [ ] Set all environment variables in cloud provider
- [ ] Configure custom domain + SSL (Let's Encrypt)

### Day 26 – Monitoring & Error Tracking
- [ ] Sentry SDK in both client and server (`@sentry/node`, `@sentry/react`)
- [ ] Prometheus metrics endpoint (`/metrics`) using `prom-client`
- [ ] Grafana dashboard: request rate, error rate, socket connections, DB query time
- [ ] Uptime monitoring (Grafana Alerting or PagerDuty)

### Day 27 – Load Testing & Security Audit
- [ ] JMeter or k6 load test: simulate 500 concurrent users / 100 concurrent meetings
- [ ] OWASP ZAP scan on API endpoints
- [ ] Security headers audit (Helmet config review)
- [ ] Fix any identified vulnerabilities

### Day 28 – Final QA & Polish
- [ ] Edge case testing (network drop mid-meeting, invalid tokens, etc.)
- [ ] Final README polish with screenshots and API docs
- [ ] Record 3-min demo video
- [ ] Export Postman collection as JSON
- [ ] Git tag `v1.0.0`, final commit

---

## Tech Stack Reference

| Layer | Tech | Version |
|-------|------|---------|
| Frontend | React + TypeScript + Vite | 19 / 5 / 5 |
| UI | Tailwind CSS + shadcn/ui | v4 |
| State | Zustand + TanStack Query | 4 / 5 |
| Backend | Node.js + Express + TypeScript | 20 / 4 / 5 |
| Database | MongoDB + Mongoose | 7 / 8 |
| Real-Time | Socket.io + WebRTC | 4 |
| Cache | Redis (ioredis) | 7 |
| AI | OpenAI (Whisper + GPT-4o) | latest |
| Auth | JWT + bcrypt | - |
| Storage | Cloudinary + AWS S3 | - |
| Containers | Docker multi-stage | - |
| Orchestration | Kubernetes + Helm | - |
| CI/CD | GitHub Actions | - |
| Monitoring | Prometheus + Grafana + Sentry | - |

## Key Environment Variables (full list)
```
PORT, NODE_ENV, MONGO_URI
JWT_SECRET, JWT_REFRESH_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN
CLIENT_URL, COOKIE_SECRET
REDIS_URL
CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
OPENAI_API_KEY
AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET (optional)
SENTRY_DSN
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (for email notifications)
```
