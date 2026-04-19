## Critical: Next.js 16 (beta)

Next.js 16.2.4 (beta) with React 19 has breaking changes. Check `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.

## Commands

- `bun run dev` - Start dev server (http://localhost:3000)
- `bun run build` - Production build
- `bun run lint` - Runs ESLint (not Biome, despite `biome.json` existing)

No typecheck script exists. Run `npx tsc --noEmit` directly if needed.

## Stack

- Next.js 16.2.4 (beta), React 19, App Router
- shadcn/ui v4, `radix-maia` style, `hugeicons` for icons (NOT Lucide)
- Tailwind CSS v4 — no `tailwind.config.js`; theme lives in `app/globals.css`
- Drizzle ORM with Turso (libsql) — schema at `lib/db/schema.ts`, migrations at `lib/db/migrations/`
- Biome exists (`biome.json`) for formatting config, but lint script delegates to ESLint

## Paths

- UI components: `@/components/ui`
- Kanban components: `@/components/kanban`
- Utils: `@/lib/utils`
- DB: `@/lib/db` (index, schema, migrations)
- Path aliases defined in `components.json`

## Auth

- better-auth with email/password, Drizzle adapter, Turso (libsql)
- Server config: `lib/auth.ts` — client: `lib/auth-client.ts`
- API route: `app/api/auth/[...all]/route.ts`
- Auth tables: `user`, `session`, `account`, `verification` in `lib/db/schema.ts`
- Login/signup page: `app/login/page.tsx`
- Root page (`app/page.tsx`) is a server component that checks session and redirects to `/login` if unauthenticated
- Env vars: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (in `.env`)

## Data layer

- `lib/db/index.ts` creates a Turso client from `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` env vars
- Drizzle schema has a legacy `users` table (integer PK) and better-auth tables (`user`, `session`, `account`, `verification` with text PKs)
- Kanban board stores tasks in **localStorage**, not the DB (keys: `kanban-tasks`, `kanban-all-categories`)
- Drizzle config: `drizzle.config.ts`

## Kanban architecture

- Board is a client component (`"use client"`) in `components/kanban/board.tsx`
- Tasks persist to `localStorage` under key `kanban-tasks`; categories under `kanban-all-categories`
- Columns: `todo`, `in-progress`, `done`
- Drag-and-drop is native HTML5, no DnD library
- Types defined in `components/kanban/types.ts`

## Styling

- Fonts: Sora (sans) and JetBrains Mono — loaded via `next/font/google` in `app/layout.tsx`
- Dark mode via `next-themes` with class strategy
- CSS custom properties for kanban columns (`--kanban-ideation`, `--kanban-planning`, etc.) and status colors (`--status-on-track`, `--status-at-risk`, `--status-off-track`)
- Design philosophy: minimal, Notion-inspired, content-first — see `.impeccable.md`
