<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run lint` - Run ESLint

Note: No typecheck or test scripts configured.

## Stack

- **Next.js 16.2.4** (beta) - uses React 19, major breaking changes from older versions
- **shadcn/ui v4** with `radix-maia` style (not default)
- **hugeicons** for icons (not Lucide)
- **Tailwind CSS v4** (not v3) - no `tailwind.config.js`, config is in `app/globals.css`

## Component paths

- UI components: `@/components/ui` (not `@/components/shadcn`)
- Utils: `@/lib/utils`
- Aliases in `components.json`