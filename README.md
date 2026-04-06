# 🤖🔥 FUNDO AI — Landing Page

> Zimbabwe's most advanced AI assistant for students, available on WhatsApp 24/7.

---

## Overview

FUNDO AI is a WhatsApp-based AI agent built specifically for Zimbabwean students from Grade 1 through A-Level. This repository contains the fully animated, glassmorphism dark landing page for the product.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Build Tool | [Vite 7](https://vitejs.dev/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) + custom CSS |
| Icons | [Lucide React](https://lucide.dev/) |
| Animations | CSS keyframes + IntersectionObserver (no external library) |
| Package Manager | [pnpm](https://pnpm.io/) (monorepo workspace) |
| Fonts | [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts |

The entire page is a **pure frontend static site** — no backend, no database, no authentication.

---

## Features

- Full glassmorphism dark design (purple / cyan palette)
- Scroll-triggered reveal animations on every section
- Animated floating AI orb with rotating conic gradient rings
- Live icon scroll rows (32 icons, dual direction)
- Animated AI chat demo cycling through 4 real scenarios
- Count-up stats (50K+, 99%, 24/7, A+) triggered on scroll
- Sticky scroll-aware navbar + animated mobile hamburger menu
- Multi-column professional footer with trust badges
- Custom scrollbar, smooth scroll, branded text selection
- Fully responsive — mobile-first down to 390px

---

## Local Development

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)

### Install & Run

```bash
# Install dependencies (from repo root)
pnpm install

# Start the dev server
pnpm --filter @workspace/fundo-ai dev
```

The site will be available at `http://localhost:<PORT>` (port assigned automatically by Vite).

### Build for Production

```bash
pnpm --filter @workspace/fundo-ai build
```

Output goes to `artifacts/fundo-ai/dist/`.

---

## Deploying as a Static Site

### Vercel (Recommended)

1. Push this repo to GitHub / GitLab / Bitbucket.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo.
3. Set the following in the Vercel project settings:

| Setting | Value |
|---|---|
| **Root Directory** | `artifacts/fundo-ai` |
| **Framework Preset** | Vite |
| **Build Command** | `pnpm install && pnpm build` |
| **Output Directory** | `dist` |
| **Install Command** | `pnpm install` |

4. Click **Deploy**. Done — Vercel will give you a live `.vercel.app` URL.

> **Custom domain:** Go to Project Settings → Domains and add your own domain.

---

### Render (Static Site)

1. Push this repo to GitHub.
2. Go to [render.com](https://render.com) → **New** → **Static Site**.
3. Connect your GitHub repo and set:

| Setting | Value |
|---|---|
| **Root Directory** | `artifacts/fundo-ai` |
| **Build Command** | `pnpm install && pnpm build` |
| **Publish Directory** | `dist` |

4. Click **Create Static Site**. Render will deploy and give you a `.onrender.com` URL.

> **Note:** Add a `_redirects` file inside `artifacts/fundo-ai/public/` with the content below if you use client-side routing:
> ```
> /* /index.html 200
> ```

---

### Netlify (Alternative)

1. Drag and drop the `artifacts/fundo-ai/dist/` folder onto [app.netlify.com/drop](https://app.netlify.com/drop), **or**
2. Connect your repo and set:
   - **Base directory:** `artifacts/fundo-ai`
   - **Build command:** `pnpm install && pnpm build`
   - **Publish directory:** `artifacts/fundo-ai/dist`

---

## Project Structure

```
artifacts/fundo-ai/
├── public/
│   └── favicon.svg          # Bot icon favicon (branded SVG)
├── src/
│   ├── pages/
│   │   └── Home.tsx         # Main landing page (all sections)
│   ├── App.tsx              # Router root
│   ├── main.tsx             # React entry point
│   └── index.css            # Global styles, glassmorphism utilities, keyframes
├── index.html               # HTML shell + font imports
├── vite.config.ts           # Vite config (path aliasing, base URL)
└── package.json
```

---

## WhatsApp Link

All CTA buttons point to:

```
https://wa.me/263719647303
```

To change the number, search for `263719647303` in `src/pages/Home.tsx` and replace globally.

---

## Credits

| Role | Name |
|---|---|
| **Creator & Product Owner** | Darrell Mucheri 🇿🇼 |
| **Product** | FUNDO AI |
| **Website** | [fundoai.gleeze.com](https://fundoai.gleeze.com) |
| **WhatsApp** | +263 719 647 303 |
| **Country** | Zimbabwe 🇿🇼 |

Built with ❤️ in Zimbabwe.

---

## License

This landing page is proprietary to FUNDO AI. All rights reserved © 2025 FUNDO AI.
