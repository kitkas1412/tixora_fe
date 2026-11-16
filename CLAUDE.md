@AGENTS.md

# Tixora frontend (tixora_fe)

Next.js 16.4.6 App Router app with React 19.3.0, TypeScript 5 (strict) and Tailwind CSS 4.3.3. Routes live in `app/` (there is no `src/` directory). The import alias `@/*` maps to the repo root.

## Commands

Use pnpm only. `package.json` sets `packageManager` to pnpm@12.21.0. The boilerplate `README.md` still lists npm, yarn and bun; ignore those.

```bash
pnpm install
pnpm dev                  # next dev
pnpm build                # next build
pnpm lint                 # eslint (flat config in eslint.config.mjs)
pnpm exec tsc --noEmit    # typecheck; there is no typecheck script
```

- There is no test script, test framework, formatter (Prettier or Biome) or CI config yet.
- Adding a test framework or formatter adds a dependency. Ask before adding one.

## Conventions and traps

- `next.config.ts` enables `cacheComponents: true` and `partialPrefetching: true`. Before writing caching or data-fetching code (`fetch` caching, `use cache`, dynamic APIs), read the matching guide in `node_modules/next/dist/docs/01-app/`, as `AGENTS.md` requires.
- Tailwind v4 has no `postcss.config.*` or `tailwind.config.*`. It is wired through the Turbopack `*.css` rule in `next.config.ts` and `app/globals.css` (`@import "tailwindcss";`). Map theme tokens in the `@theme inline` block in `app/styles/tailwind.css`. Do not create the config files.
- The font is Be Vietnam Pro. `app/font.ts` exports `tixoraFont` (`next/font/google`, variable `--font-be-vietnam`), applied to `<html lang="vi">` in `app/layout.tsx`. Geist is no longer used.
- `app/layout.tsx` uses the generated global `LayoutProps<"/">` type without an import. Use the generated global helpers (such as `LayoutProps` and `PageProps`) for props types.
- Do not remove the `<!-- BEGIN:nextjs-agent-rules -->` block from `AGENTS.md`. `next dev` writes it back.
- `.next/` is build output and is git-ignored. Do not edit it.
- The repo has no git remote yet.

## Design system

The Tixora design system lives in `components/` and `app/styles/`. Reuse existing components and tokens before creating new ones.

- `components/ui/*`: primitives (Button, Dialog, Field, Labels, Notice, Section, SegmentedControl). Each has a `.module.css` file.
- `components/ticketing/*` and `components/event/*`: domain components, sharing `Ticketing.module.css` and `Event.module.css`.
- `lib/`: `cx.ts` (class join), `format.ts` (`formatVND`, `formatClock`), `types.ts` (`TierKey`, `SaleStatus`).
- `app/globals.css` imports `tokens.css`, `base.css` and `tailwind.css` in that order. Tokens are in `app/styles/tokens.css`; `base.css` holds the reset and the `.tx-*` classes.
- There is no barrel file. Import each file directly, for example `@/components/ui/Button`.
- Components use CSS Modules with `var(--*)` tokens. New pages can use Tailwind utilities from `tailwind.css`.
- New tokens go in `app/styles/tokens.css`. Map them in `tailwind.css` only when a utility is needed.
- No rounded corners (`--radius: 0`) and no hard-coded colours. Use tokens.
- UI strings are in Vietnamese.
