# BlazeAid Hub — Frontend

Open-source humanitarian-aid platform for post-earthquake Venezuela.
Frontend agent for `blaze-aid`. Backend lives at
`https://blaze-aid-backend.fly.dev` (Go API, Fly.io).

## Commands

| Command            | What it does                                                  |
| ------------------ | ------------------------------------------------------------- |
| `npm run dev`      | Vite dev server (http://localhost:5173)                       |
| `npm run build`    | `tsc -b` (strict) + `vite build` → `dist/`                   |
| `npm run preview`  | Preview the production build                                  |
| `npm run lint`     | oxlint                                                        |
| `npm run gen:api`  | Regenerate `src/api/schema.ts` from the live OpenAPI spec     |

## Env

- `VITE_API_BASE_URL` (optional) — API base. Defaults to
  `https://blaze-aid-backend.fly.dev`.

## Stack

- React 19 + Vite 8 + TypeScript (strict)
- Tailwind CSS v4 (`@tailwindcss/vite`) + shadcn/ui (new-york, dark-first)
- TanStack Query (server state) + TanStack Router (file-based, type-safe)
- openapi-fetch + openapi-typescript (typed API client from the live spec)
- Zustand (UI/auth state, sessionStorage-persisted JWT)

## Conventions

- Code, commits and configs in **English**; UI microcopy in **Spanish**.
- API client is typed end-to-end: never hand-type a response shape — run
  `npm run gen:api` after any backend contract change.
- Query keys are stable tuples (`['projects', filters]`).
- Auth is Bearer-only (no cookie). JWT lives in Zustand + sessionStorage.
- 8pt grid, dark theme, NOC density. Do not alter global radius/font sizes.
- Three.js scenes (Fase 1+) must dispose geometry/material/texture on unmount.

## Deploy

Vercel (SPA rewrite to `/index.html`, see `vercel.json`). When a preview/prod
domain is fixed, send it to the backend so it can pin `CORS_ORIGINS` exactly.
