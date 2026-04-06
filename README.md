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

### Frontend (build-time) variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | ✅ on Render | Full URL of your API server — e.g. `https://fundo-ai-api.onrender.com/api` |

> On Render, the frontend and API are deployed as separate services with different URLs. You **must** set `VITE_API_BASE_URL` so the frontend knows where to send requests. In same-domain setups (Replit, nginx proxy), leave this unset and the relative `/api` path is used automatically.

---

## Deploy on Render

Render hosts the API and frontend as **two separate services**. Follow these steps:

### Step 1 — Deploy the API Server

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repo
3. Set:
   - **Name:** `fundo-ai-api` (or anything you like)
   - **Root Directory:** leave blank (monorepo root)
   - **Build Command:** `npm install -g pnpm && pnpm install && pnpm --filter @workspace/api-server run build`
   - **Start Command:** `pnpm --filter @workspace/api-server run start`
   - **Instance Type:** Free (or Starter for always-on)
4. Add these **Environment Variables** in the Render dashboard:

   | Key | Value |
   |---|---|
   | `MONGODB_URI` | Your Atlas connection string |
   | `JWT_SECRET` | Any long random string |
   | `SMTP_HOST` | `smtp.gmail.com` |
   | `SMTP_PORT` | `587` |
   | `SMTP_USER` | your-gmail@gmail.com |
   | `SMTP_PASS` | Your 16-char Gmail App Password |
   | `SMTP_FROM` | `FUNDO AI <your-gmail@gmail.com>` |
   | `APP_URL` | *(leave blank for now — fill in after Step 2)* |

5. Click **Create Web Service** → wait for deploy → copy the URL (e.g. `https://fundo-ai-api.onrender.com`)

---

### Step 2 — Deploy the Frontend

1. Go to [render.com](https://render.com) → **New → Static Site**
2. Connect the same repo
3. Set:
   - **Name:** `fundo-ai`
   - **Root Directory:** leave blank
   - **Build Command:** `npm install -g pnpm && pnpm install && pnpm --filter @workspace/fundo-ai run build`
   - **Publish Directory:** `artifacts/fundo-ai/dist`
4. Add this **Environment Variable**:

   | Key | Value |
   |---|---|
   | `VITE_API_BASE_URL` | `https://fundo-ai-api.onrender.com/api` *(your API URL + /api)* |

5. Add a **Rewrite Rule** so React routing works (single-page app):
   - **Source:** `/*`
   - **Destination:** `/index.html`
   - **Action:** Rewrite

6. Click **Create Static Site** → copy your frontend URL (e.g. `https://fundo-ai.onrender.com`)

---

### Step 3 — Link them together

Go back to your **API Server** service → **Environment** tab → add:

| Key | Value |
|---|---|
| `APP_URL` | `https://fundo-ai.onrender.com` *(your frontend URL from Step 2)* |

Click **Save Changes** — Render will redeploy automatically.

**Done.** Your magic links will now point to `https://fundo-ai.onrender.com/auth/verify?token=...` and everything will work correctly.

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
