# 🤖🔥 FUNDO AI — Web Platform

> Zimbabwe's most advanced AI study assistant — web platform with magic-link authentication, persistent AI chat, file uploads, and ZIMSEC curriculum alignment.

[![Made in Zimbabwe](https://img.shields.io/badge/Made%20in-Zimbabwe%20🇿🇼-green)](https://github.com)
[![AI Powered](https://img.shields.io/badge/AI-Llama%204%20Scout-purple)](https://bk9.dev)
[![License](https://img.shields.io/badge/License-Proprietary-red)](./LICENSE)

---

## Overview

FUNDO AI is a powerful, intelligent AI agent built specifically for Zimbabwean students from Grade 1 through A-Level. It provides real-time AI tutoring, live web search, weather, and more — available both on **WhatsApp** (+263 719 647 303) and this **web platform**.

This repository is a **pnpm monorepo** containing:

| Package | Description |
|---|---|
| `artifacts/fundo-ai` | React + Vite frontend (glassmorphism dark UI) |
| `artifacts/api-server` | Express 5 backend (auth, AI chat, user management) |

---

## Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 · Vite 7 · TypeScript · Tailwind CSS v4 · wouter |
| **Backend** | Express 5 · TypeScript · esbuild · pino logging |
| **Database** | MongoDB Atlas (Mongoose) |
| **Auth** | Magic-link email (no passwords) · JWT 30-day sessions |
| **AI** | BK9 API — Meta Llama 4 Scout 17B (vision + text) |
| **File Uploads** | Images (base64 vision) · PDF (pdf-parse) · Word (mammoth) |
| **Web Search** | Tavily · DuckDuckGo |
| **Live Data** | wttr.in (weather) · worldtimeapi.org (time zones) |
| **Package Manager** | pnpm workspaces |

---

## Features

### Authentication
- **No passwords** — users sign up or log in with just their email
- A **magic link** is emailed and expires in 15 minutes
- Click the link → auto-verified → redirected straight to chat
- **5 free guest messages** before an account is required
- JWT tokens stored in localStorage (30-day expiry)
- Branded HTML email templates (signup vs. returning user variants)

### AI Chat
- Powered by **Llama 4 Scout** via BK9 API (vision + text model)
- **File uploads**: images, PDFs, Word docs (up to 10 MB)
- **Live web search** triggered automatically for current events/news
- **Weather** via wttr.in (any city worldwide)
- **Time zones** via worldtimeapi.org
- Persistent chat history sidebar grouped by date (Today, Yesterday, etc.)
- Guest mode with countdown banner and GuestWall modal
- Full markdown rendering · animated typing indicator
- Suggested starter questions + capability badges

### Pages

| Route | Description |
|---|---|
| `/` | Full glassmorphism landing page |
| `/chat` | AI chat interface (guest + authenticated) |
| `/login` | Magic-link login |
| `/signup` | Magic-link signup with perk pills |
| `/auth/verify` | Auto-verify magic link token from email |
| `/about` | About page + creator profile |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Use |

---

## Environment Variables

### API Server variables

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Random secret string for signing JWTs (min 32 chars) |
| `SMTP_HOST` | ✅ | SMTP host — e.g. `smtp.gmail.com` |
| `SMTP_PORT` | ✅ | SMTP port — `587` for Gmail TLS |
| `SMTP_USER` | ✅ | Your Gmail address |
| `SMTP_PASS` | ✅ | Gmail **App Password** (16 chars — NOT your regular password) |
| `SMTP_FROM` | ✅ | Sender string — e.g. `FUNDO AI <noreply@fundoai.com>` |
| `APP_URL` | ✅ | **Frontend URL** — magic links point here (e.g. `https://fundo-ai.onrender.com`) |
| `BK9_MODEL` | — | AI model override (default: `meta-llama/llama-4-scout-17b-16e-instruct`) |
| `SESSION_SECRET` | — | Express session secret (if sessions are added later) |

> **`APP_URL` is the most important variable for magic links.** It must be set to where your **frontend** is deployed — not the API server URL. Magic links will be broken if this points to the wrong domain.

> **Gmail App Password:** Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords), enable 2-Step Verification if not already done, then generate an App Password for "Mail". Use the 16-character code as `SMTP_PASS`.

---

## Deploy on Render (single service)

Everything — frontend + API — runs as **one Web Service** on Render. The Express server builds and serves the React app for you. No separate Static Site needed.

### Step 1 — Create the Web Service

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repo
3. Set these fields:

   | Field | Value |
   |---|---|
   | **Name** | `fundo-ai` (or anything) |
   | **Root Directory** | *(leave blank)* |
   | **Runtime** | Node |
   | **Build Command** | `npm install -g pnpm && pnpm install && pnpm --filter @workspace/fundo-ai run build && pnpm --filter @workspace/api-server run build` |
   | **Start Command** | `pnpm --filter @workspace/api-server run start` |
   | **Instance Type** | Free (or Starter for always-on) |

### Step 2 — Add environment variables

In the **Environment** tab add all of these:

| Key | Value |
|---|---|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Any long random string (min 32 chars) |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | your-gmail@gmail.com |
| `SMTP_PASS` | Your 16-char Gmail App Password |
| `SMTP_FROM` | `FUNDO AI <your-gmail@gmail.com>` |
| `APP_URL` | *(leave blank for now — fill in after first deploy)* |

> **Do NOT set** `PORT`, `BASE_PATH`, or `VITE_API_BASE_URL` — they are handled automatically in single-service mode.

### Step 3 — Deploy and set APP_URL

1. Click **Create Web Service** — Render will build and deploy
2. Once live, copy your service URL (e.g. `https://fundo-ai.onrender.com`)
3. Go back to **Environment** → set `APP_URL` to that URL
4. Click **Save Changes** — Render redeploys automatically

**Done.** Your magic links will now point to `https://fundo-ai.onrender.com/auth/verify?token=...`

> **How it works:** The build command compiles the React app first, then compiles the Express server. At runtime the Express server detects the compiled frontend at `artifacts/fundo-ai/dist/public` and serves it as static files, with a fallback to `index.html` for all React routes. The `/api/*` routes are handled by Express as normal.

---

## Local Development

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- MongoDB Atlas account (free tier works)
- Gmail account with App Password

### Install & Run

```bash
# Install all dependencies from repo root
pnpm install

# Start the API server
pnpm --filter @workspace/api-server run dev

# Start the frontend (second terminal)
pnpm --filter @workspace/fundo-ai run dev
```

For local dev, `APP_URL` and `VITE_API_BASE_URL` can be left unset — requests go to relative `/api` automatically.

### Build for Production

```bash
pnpm --filter @workspace/api-server run build
pnpm --filter @workspace/fundo-ai run build
```

---

## API Reference

All endpoints are prefixed with `/api`.

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/magic` | — | Send magic link to email (signup + login) |
| `GET` | `/auth/magic/verify?token=` | — | Verify magic link → returns JWT |
| `GET` | `/auth/me` | JWT | Get current user profile |
| `PATCH` | `/auth/profile` | JWT | Update name / level |

### AI

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/ai/chat` | JWT | Send message → AI reply (saves history) |
| `POST` | `/ai/chat/guest` | — | Guest chat (no persistence, 5-message limit) |
| `POST` | `/ai/upload` | — | Upload file (image/PDF/Word) → returns extracted content |
| `GET` | `/ai/history` | JWT | Get full chat history |
| `DELETE` | `/ai/history` | JWT | Clear chat history |

### Health

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/healthz` | Server health check |

---

## Project Structure

```
├── artifacts/
│   ├── fundo-ai/                  # React frontend
│   │   └── src/
│   │       ├── components/
│   │       │   ├── AuthCard.tsx   # Glassmorphism auth form wrapper
│   │       │   └── PageLayout.tsx # Shared navbar + footer layout
│   │       ├── lib/
│   │       │   ├── api.ts         # API client (all fetch calls)
│   │       │   └── auth.tsx       # AuthProvider + useAuth hook
│   │       └── pages/
│   │           ├── Home.tsx       # Landing page
│   │           ├── Chat.tsx       # AI chat + history sidebar + file uploads
│   │           ├── Login.tsx      # Magic-link login
│   │           ├── Signup.tsx     # Magic-link signup
│   │           ├── MagicVerify.tsx# /auth/verify — token verification
│   │           ├── About.tsx
│   │           ├── Privacy.tsx
│   │           └── Terms.tsx
│   └── api-server/                # Express backend
│       └── src/
│           ├── lib/
│           │   ├── mongo.ts       # MongoDB connection
│           │   ├── jwt.ts         # JWT sign/verify
│           │   └── email.ts       # SMTP magic-link email helper
│           ├── models/
│           │   └── User.ts        # Mongoose User model
│           ├── middlewares/
│           │   └── auth.ts        # JWT auth middleware
│           └── routes/
│               ├── auth.ts        # Auth endpoints (magic link)
│               └── ai.ts          # AI chat + file upload endpoints
└── README.md
```

---

## WhatsApp Bot

```
https://wa.me/263719647303
```

Same BK9 AI engine, same ZIMSEC alignment, same FUNDO AI personality — on WhatsApp.

---

## Credits

| Role | Detail |
|---|---|
| **Creator & Developer** | Darrell Mucheri 🇿🇼 |
| **Product** | FUNDO AI |
| **WhatsApp** | +263 719 647 303 |
| **Country** | Zimbabwe 🇿🇼 |

Built with ❤️ in Zimbabwe.

---

## License

Proprietary — All rights reserved © 2025 FUNDO AI.
