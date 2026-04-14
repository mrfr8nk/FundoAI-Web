# FUNDO AI — Web Platform

## Overview

FUNDO AI is Zimbabwe's premier AI study assistant for Grade 1 to A-Level students, aligned with the ZIMSEC curriculum. It provides real-time AI tutoring, persistent chat history, and file analysis (PDF, Word, Images).

## Architecture

pnpm monorepo with:
- **artifacts/fundo-ai** — React 19 + Vite 7 + Tailwind CSS v4 frontend (port 5000)
- **artifacts/api-server** — Express 5 + TypeScript backend (port 3000)
- **artifacts/mockup-sandbox** — UI component preview server
- **lib/api-spec** — OpenAPI spec + Orval codegen
- **lib/api-client-react** — Generated React Query hooks
- **lib/api-zod** — Generated Zod schemas
- **lib/db** — Drizzle ORM for PostgreSQL (planned)

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19 + Vite + Tailwind CSS v4 + wouter |
| Backend | Express 5 + TypeScript + esbuild |
| Database | MongoDB (Mongoose) |
| Auth | bcryptjs + JWT + nodemailer (SMTP) magic-link |
| AI | BK9 API (Llama 4 Scout) + Tavily search |
| UI | Dark theme + violet accent (#8b5cf6) + Lucide icons |
| Monorepo | pnpm workspaces |

## Workflows

- **Start application** — Frontend Vite dev server on port 5000 (webview)
- **Backend API** — Express API server on port 3000 (console)

## Required Secrets

- `JWT_SECRET` — JWT signing secret
- `MONGODB_URI` — MongoDB Atlas connection string
- `SMTP_EMAIL` — Your email address (SMTP host/port auto-detected from domain: Gmail, Outlook, Yahoo, Zoho, iCloud supported)
- `SMTP_PASSWORD` — Your email App Password
- `TAVILY_API_KEY` — Tavily web search API key
- `APP_URL` — Frontend URL for magic links (set after first deploy on Render)
- `BK9_MODEL` — BK9 AI model name (optional, default: meta-llama/llama-4-scout-17b-16e-instruct)

## Key Files

| File | Purpose |
|---|---|
| `artifacts/fundo-ai/vite.config.ts` | Vite config with proxy to backend |
| `artifacts/fundo-ai/src/App.tsx` | Main router with all page routes |
| `artifacts/fundo-ai/src/lib/auth.tsx` | AuthProvider context + useAuth hook |
| `artifacts/fundo-ai/src/lib/api.ts` | API client for all backend calls |
| `artifacts/api-server/src/app.ts` | Main Express application |
| `artifacts/api-server/src/routes/auth.ts` | All auth endpoints |
| `artifacts/api-server/src/routes/ai.ts` | AI chat + web search endpoints |
| `artifacts/api-server/src/models/User.ts` | MongoDB User model |

## Development Commands

- `pnpm install` — Install all dependencies
- `pnpm run typecheck` — Typecheck all packages
- `pnpm run build` — Build all packages
- `pnpm --filter @workspace/api-server run dev` — Run API server (port 3000)
- `pnpm --filter @workspace/fundo-ai run dev` — Run web app (port 5000)
