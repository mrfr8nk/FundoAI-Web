# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### FUNDO AI (`artifacts/fundo-ai`)
- **Kind**: react-vite web app
- **Preview path**: `/`
- **Description**: FUNDO AI landing page — Zimbabwe's most advanced AI WhatsApp assistant
- **Features**:
  - Full glassmorphism dark UI with purple/cyan gradient palette
  - Left-to-right animated icon scroll rows (two rows, different speeds)
  - Floating rotating AI orb in hero
  - Stats grid, features grid, how-it-works section, CTA banner
  - Sticky glassmorphism navbar
  - Background orbs + grid overlay
