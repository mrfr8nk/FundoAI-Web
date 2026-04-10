# FUNO AI — Web Platform

## Overview

FUNDO AI is Zimbabwe's premier AI study assistant, built as a pnpm workspace monorepo. It includes a glassmorphism React web app, an Express API server with full auth + AI chat, and MongoDB user management.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS v4 + wouter |
| Backend | Express 5 + TypeScript + esbuild |
| Database | MongoDB (Mongoose) |
| Auth | bcryptjs + JWT + nodemailer (SMTP) |
| AI | BK9 API (Llama 4 Scout) + Tavily search + DuckDuckGo |
| UI | Dark theme + single violet accent (#8b5cf6) + Lucide icons |
| Monorepo | pnpm workspaces |

## Artifacts

- **artifacts/fundo-ai** → React web app (port from `$PORT`, base path from `$BASE_PATH`)
- **artifacts/api-server** → Express API server (port from `$PORT`)
- **artifacts/mockup-sandbox** → Canvas component preview server

## Pages (Frontend)

| Route | Page |
|---|---|
| `/` | Landing page (professional dark SaaS) |
| `/chat` | AI chat interface (guest + authenticated) |
| `/login` | Login with email/password |
| `/signup` | Signup with email verification |
| `/verify-email` | OTP code entry (6-digit) |
| `/forgot-password` | Forgot password flow |
| `/reset-password` | Reset password with OTP |
| `/about` | About page + creator profile (Darrell Mucheri) |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Use |

## API Routes (Backend)

| Endpoint | Description |
|---|---|
| `GET /api/healthz` | Health check |
| `POST /api/auth/signup` | Register + send verification email |
| `POST /api/auth/verify-email` | Verify OTP code → returns JWT |
| `POST /api/auth/resend-code` | Resend verification code |
| `POST /api/auth/login` | Login → returns JWT |
| `POST /api/auth/forgot-password` | Send password reset OTP |
| `POST /api/auth/reset-password` | Reset password with OTP |
| `GET /api/auth/me` | Get current user (JWT required) |
| `PATCH /api/auth/profile` | Update name/level (JWT required) |
| `POST /api/ai/chat` | Authenticated AI chat (Llama 4 + Tavily) |
| `POST /api/ai/chat/guest` | Guest AI chat (limited) |
| `GET /api/ai/history` | Get chat history (JWT required) |
| `DELETE /api/ai/history` | Clear chat history (JWT required) |

## Environment Variables / Secrets Required

- `JWT_SECRET` — JWT signing secret
- `MONGODB_URI` — MongoDB Atlas connection string
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` — Email/SMTP config
- `TAVILY_API_KEY` — Tavily web search API key
- `BK9_MODEL` — BK9 AI model name (default: `meta-llama/llama-4-scout-17b-16e-instruct`)

## Key Files

| File | Purpose |
|---|---|
| `artifacts/fundo-ai/src/App.tsx` | Main router with all page routes |
| `artifacts/fundo-ai/src/lib/auth.tsx` | AuthProvider context + useAuth hook |
| `artifacts/fundo-ai/src/lib/api.ts` | API client for all backend calls |
| `artifacts/fundo-ai/src/components/AuthCard.tsx` | Glassmorphism auth form wrapper |
| `artifacts/fundo-ai/src/components/PageLayout.tsx` | Shared layout with navbar + footer |
| `artifacts/fundo-ai/src/pages/Home.tsx` | Full landing page |
| `artifacts/fundo-ai/src/pages/Chat.tsx` | AI chat interface |
| `artifacts/api-server/src/routes/auth.ts` | All auth endpoints |
| `artifacts/api-server/src/routes/ai.ts` | AI chat + web search endpoints |
| `artifacts/api-server/src/models/User.ts` | MongoDB User model |
| `artifacts/api-server/src/lib/email.ts` | SMTP email helpers |
| `artifacts/api-server/src/lib/jwt.ts` | JWT sign/verify helpers |

## Creator

**Darrell Mucheri** — Zimbabwe 🇿🇼 · Full-Stack Developer · AI Engineer
- WhatsApp bot: +263 719 647 303 → `https://wa.me/263719647303`
- Website: `https://fundoai.gleeze.com`

## Key Commands

- `pnpm run typecheck` — typecheck all packages
- `pnpm run build` — build all packages
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/fundo-ai run dev` — run web app locally
