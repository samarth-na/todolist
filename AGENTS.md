<!-- BEGIN:nextjs-agent-rules -->
Next.js 16.2.4 (beta) with React 19 has breaking changes. Check `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands
- `npm run dev` - Start dev server (http://localhost:3000)
- `npm run build` - Production build
- `npm run lint` - Run ESLint

No typecheck or test scripts configured.

## Stack
- Next.js 16.2.4 (beta) with React 19
- shadcn/ui v4 with `radix-maia` style
- hugeicons for icons (not Lucide)
- Tailwind CSS v4 - config in `app/globals.css` (no tailwind.config.js)

## Paths
- UI components: `@/components/ui`
- Kanban components: `@/components/kanban`
- Utils: `@/lib/utils`
- Aliases in `components.json`

## Theme
- Uses `next-themes` for dark mode
- CSS variables for kanban columns: `--kanban-ideation`, `--kanban-planning`, etc.
- Status colors: `--status-on-track`, `--status-at-risk`, `--status-off-track`