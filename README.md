# 🤖🔥 FUNDO AI — Web Platform

> Zimbabwe's most advanced AI study assistant — web platform with full authentication, persistent AI chat, and ZIMSEC curriculum alignment.

[![Made in Zimbabwe](https://img.shields.io/badge/Made%20in-Zimbabwe%20🇿🇼-green)](https://fundoai.gleeze.com)
[![AI Powered](https://img.shields.io/badge/AI-Llama%204%20Scout-purple)](https://fundoai.gleeze.com)
[![License](https://img.shields.io/badge/License-Proprietary-red)](./LICENSE)

---

## Overview

FUNDO AI is a powerful, intelligent AI agent built specifically for Zimbabwean students from Grade 1 through A-Level. It provides real-time AI tutoring, live web search, weather, and more — available both on **WhatsApp** (+263 719 647 303) and this **web platform**.

This repository is a **pnpm monorepo** containing:

| Package | Description |
|---|---|
| `artifacts/fundo-ai` | React + Vite frontend (glassmorphism dark UI) |
| `artifacts/api-server` | Express 5 backend (auth, AI chat, user management) |
| `artifacts/mockup-sandbox` | Component preview server (canvas/design tooling) |

---

## Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 · Vite 7 · TypeScript · Tailwind CSS v4 · wouter |
| **Backend** | Express 5 · TypeScript · esbuild · pino logging |
| **Database** | MongoDB Atlas (Mongoose) |
| **Auth** | JWT (30-day) · bcryptjs (12 rounds) · Nodemailer SMTP |
| **AI** | BK9 API — Meta Llama 4 Scout 17B |
| **Web Search** | Tavily (news/current events) · DuckDuckGo (general) |
| **Live Data** | wttr.in (weather) · worldtimeapi.org (time zones) |
| **UI** | Lucide icons · Glassmorphism CSS · Custom keyframe animations |
| **Package Manager** | pnpm workspaces |

---

## Features

### Web Platform
- Full glassmorphism dark design (purple / cyan palette)
- Scroll-triggered reveal animations on every section
- Animated floating AI orb with rotating conic gradient rings
- Live icon scroll rows (32 icons, dual direction)
- Animated AI chat demo cycling through 4 real scenarios
- Count-up stats triggered on scroll
- Sticky scroll-aware navbar · animated mobile hamburger menu
- Multi-column footer with working route links

### Authentication
- **Signup** with SMTP email verification (6-digit OTP, 10-min expiry)
- **Login** with JWT token (30-day session)
- **Forgot password** → reset code via email → new password
- **Email verification** with OTP digit inputs, paste support, resend countdown
- Branded HTML email templates (verification + password reset)

### AI Chat
- Powered by **Llama 4 Scout** via BK9 API
- **Live web search** triggered automatically for current events, news, prices
- **Weather** via wttr.in (any city)
- **Time zones** via worldtimeapi.org
- Persistent chat history stored in MongoDB (authenticated users)
- Guest mode (5 free messages, then account required)
- Full markdown rendering with bullet points and bold support
- Suggested starter questions · animated typing indicator

### Pages
| Route | Description |
|---|---|
| `/` | Full glassmorphism landing page |
| `/chat` | AI chat interface (guest + authenticated) |
| `/login` | Login page |
| `/signup` | Signup with perk pills + password strength meter |
| `/verify-email` | 6-digit OTP verification |
| `/forgot-password` | Forgot password flow |
| `/reset-password` | Reset password with OTP |
| `/about` | About page + creator profile |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Use |

---

## Local Development

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- MongoDB Atlas account (free tier works)
- Gmail account with App Password for SMTP

### Environment Variables

Create these as environment secrets (or a `.env` file — **never commit secrets**):

| Variable | Description |
|---|---|
| `JWT_SECRET` | Random secret string for JWT signing |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `SMTP_HOST` | SMTP host (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | SMTP port (e.g. `587`) |
| `SMTP_USER` | SMTP username / email |
| `SMTP_PASS` | Gmail App Password (not your regular password — see below) |
| `SMTP_FROM` | Sender name + email (e.g. `FUNDO AI <noreply@fundoai.com>`) |
| `TAVILY_API_KEY` | Tavily API key for live web search |
| `BK9_MODEL` | AI model (default: `meta-llama/llama-4-scout-17b-16e-instruct`) |

> **Gmail SMTP:** Gmail requires an **App Password**, not your regular password. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords), enable 2-Step Verification, then generate an App Password for "Mail". Use that 16-character code as `SMTP_PASS`.

### Install & Run

```bash
# Install all dependencies from repo root
pnpm install

# Start the API server (port assigned automatically)
pnpm --filter @workspace/api-server run dev

# Start the frontend (in a second terminal)
pnpm --filter @workspace/fundo-ai run dev
```

Both will be available at `http://localhost:<PORT>` (ports assigned automatically by the environment).

### Build for Production

```bash
# Build everything
pnpm run build

# Or individually:
pnpm --filter @workspace/api-server run build
pnpm --filter @workspace/fundo-ai run build
```

---

## API Reference

All endpoints are prefixed with `/api`.

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/signup` | — | Register + send verification email |
| `POST` | `/auth/verify-email` | — | Verify OTP → returns JWT token |
| `POST` | `/auth/resend-code` | — | Resend verification OTP |
| `POST` | `/auth/login` | — | Login → returns JWT token |
| `POST` | `/auth/forgot-password` | — | Send password reset OTP |
| `POST` | `/auth/reset-password` | — | Reset password with OTP |
| `GET` | `/auth/me` | JWT | Get current user profile |
| `PATCH` | `/auth/profile` | JWT | Update name / level |

### AI

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/ai/chat` | JWT | Send message, get AI reply (with history) |
| `POST` | `/ai/chat/guest` | — | Guest chat (no persistence) |
| `GET` | `/ai/history` | JWT | Get chat history |
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
│   │           ├── Chat.tsx       # AI chat interface
│   │           ├── Login.tsx      # Login page
│   │           ├── Signup.tsx     # Signup page
│   │           ├── VerifyEmail.tsx
│   │           ├── ForgotPassword.tsx
│   │           ├── ResetPassword.tsx
│   │           ├── About.tsx
│   │           ├── Privacy.tsx
│   │           └── Terms.tsx
│   └── api-server/                # Express backend
│       └── src/
│           ├── lib/
│           │   ├── mongo.ts       # MongoDB connection
│           │   ├── jwt.ts         # JWT sign/verify
│           │   └── email.ts       # SMTP email helpers
│           ├── models/
│           │   └── User.ts        # Mongoose User model
│           ├── middlewares/
│           │   └── auth.ts        # JWT auth middleware
│           └── routes/
│               ├── auth.ts        # All auth endpoints
│               └── ai.ts          # AI chat endpoints
├── replit.md                      # Project documentation
└── README.md                      # This file
```

---

## Deployment

This platform is deployed on [Replit](https://replit.com) with automatic routing. The artifact router maps:

- `/` → `artifacts/fundo-ai` (React frontend)
- `/api/*` → `artifacts/api-server` (Express backend)

For external deployment (VPS, Railway, Render), run both services and configure a reverse proxy (nginx/Caddy) to route `/api` to the Express server and everything else to the frontend.

---

## WhatsApp Bot

The WhatsApp bot version is a separate integration available at:

```
https://wa.me/263719647303
```

It uses the same BK9 AI API and Tavily search as the web platform, with ZIMSEC curriculum alignment and the same FUNDO AI personality.

---

## Credits

| Role | Detail |
|---|---|
| **Creator & Developer** | Darrell Mucheri 🇿🇼 |
| **Product** | FUNDO AI |
| **Website** | [fundoai.gleeze.com](https://fundoai.gleeze.com) |
| **WhatsApp** | +263 719 647 303 |
| **Country** | Zimbabwe 🇿🇼 |

Built with ❤️ in Zimbabwe.

---

## License

This platform is proprietary to FUNDO AI. All rights reserved © 2025 FUNDO AI.
