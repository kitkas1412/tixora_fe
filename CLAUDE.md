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

## Project structure

Domain modules that mirror the backend bounded contexts. Route groups do not change URLs.

```
app/
  (marketing)/        # page.tsx, events/[slug]
  (flow)/             # events/[slug]/seats, checkout, tickets/[code]
  layout.tsx, font.ts, globals.css, styles/
widgets/              # compose modules: SiteHeader, SiteFooter, TierSelector, SeatPicker, CheckoutScreen
modules/<ctx>/        # ctx = catalog, seating, booking, payment, ticketing (identity not yet)
  model/              # pure types and logic
  ui/                 # components (styles are global, see Styling)
  api/                # data access (catalog/api/events.mock.ts is mock data)
shared/
  ui/ (+ layout/, flow/), motion/, lib/, kernel/, content/, routing/
```

- Dependency direction: `app` -> `widgets` -> `modules/*` -> `shared`. `shared` imports nothing above it. `ui` may import `model` of its own module.
- A module never imports another module. Compose modules in widgets or pages through props and slots, and pass IDs, not other modules' types.
- Use `@/` imports. Components do not import CSS files. There are no barrel files.
- Server data access will go in `modules/<ctx>/api/*.server.ts` and actions in `modules/<ctx>/actions`, with DTO to view-model mapping at the module edge. None of this exists yet (no backend).

## App structure

Mock-only ticketing flow. There is no backend and payment is simulated: submitting checkout navigates to the ticket page.

- Routes: `/` (`app/(marketing)/page.tsx`), `/events/[slug]` (`app/(marketing)/events/[slug]/page.tsx`; `generateStaticParams` from `getEventSlugs()`, `notFound()` for unknown slugs), `/events/[slug]/seats`, `/checkout`, `/tickets/[code]` (the last three under `app/(flow)/`).
- Mobile flow screens (seats, checkout, tickets) use `shared/ui/layout/MobileShell`, a column of at most 480px. Put `MobileAppBar`, `<main>` and `StickyBar` inside it.
- Layout components: `SiteHeader` (`variant` `full` or `slim`) and `SiteFooter` are in `widgets/`; `MobileShell`, `MobileAppBar` and `StickyBar` are in `shared/ui/layout/`.
- Mock data is in `modules/catalog/api/events.mock.ts` (`getEvents`, `getEvent`, `getEventSlugs`, `getTier`); it is meant to become a server-only data layer later. `GENRES`, `TRUST_ITEMS` and `FOOTER_GROUPS` are in `shared/content/site.ts`. Types are in `modules/catalog/model/types.ts` (`EventItem`, `Tier`, `Zone`). `Tier.price` is all-in (service fee included); no fee is added anywhere, and `computeTotals` (`modules/booking/model/totals.ts`) returns `{count, total}` with total = sum(price × quantity).
- Flow state travels in URL search params. Build and parse flow URLs only through `shared/routing/flow-urls.ts`: `buildSeatsHref`/`parseSeatsParams`, `buildCheckoutHref`/`parseCheckoutParams` (kind `seats` with `zone` and `seats`, or kind `tiers` with `q`), and `buildTicketHref`/`parseTicketParams` (optional `paid=1` flag, set only when coming from checkout, shows the payment-success banner; `DEMO_TICKET_HREF` omits it). The codecs only validate format; pages and `resolveCheckout(params, event)` (`modules/booking/model/checkout.ts`) check the event. Limits: `MAX_TICKETS` (4, `shared/kernel/tier.ts`), `HOLD_MINUTES` (10, `modules/booking/model/hold.ts`).
- Pages that read `params` or `searchParams` (seats, checkout, tickets) await them inside a `Suspense`-wrapped async component with a `FlowLoading` fallback (`shared/ui/flow/FlowState.tsx`).
- `widgets/CheckoutScreen.tsx` is the client entry of the checkout page. It owns the payment state and passes a `payment` slot and `ticketHref` to `modules/booking/ui/CheckoutView`.
- Keep `Date.now()`, `newHoldExpiry()` and `generateOrderCode()` in event handlers or in effects after mount, to avoid prerender and hydration mismatches. `HoldTimer` renders `--:--` until mounted.
- The ticket QR is a fake SVG (`modules/ticketing/ui/FakeQr.tsx`). There is no QR dependency.

## Conventions and traps

- `next.config.ts` enables `cacheComponents: true` and `partialPrefetching: true`. Before writing caching or data-fetching code (`fetch` caching, `use cache`, dynamic APIs), read the matching guide in `node_modules/next/dist/docs/01-app/`, as `AGENTS.md` requires.
- Tailwind v4 has no `postcss.config.*` or `tailwind.config.*`. It is wired through the Turbopack `*.css` rule in `next.config.ts` and `app/globals.css` (`@import "tailwindcss";`). Map theme tokens in the `@theme inline` block in `app/styles/tailwind.css`. Do not create the config files.
- The font is Be Vietnam Pro. `app/font.ts` exports `tixoraFont` (`next/font/google`, variable `--font-be-vietnam`), applied to `<html lang="vi">` in `app/layout.tsx`. Geist is no longer used.
- `app/layout.tsx` uses the generated global `LayoutProps<"/">` type without an import. Use the generated global helpers (such as `LayoutProps` and `PageProps`) for props types.
- Do not remove the `<!-- BEGIN:nextjs-agent-rules -->` block from `AGENTS.md`. `next dev` writes it back.
- `.next/` is build output and is git-ignored. Do not edit it.
- The repo has the remote `origin` (github.com/kitkas1412/tixora_fe).
- The Tailwind `*.css` rule in `next.config.ts` must keep `condition: { not: { path: "*.module.css" } }`. It keeps CSS Modules on Next's native pipeline. No `*.module.css` files exist now, so the condition is defensive. Do not remove it.

## Motion

GSAP 3.15 with `@gsap/react`. Import `gsap`, `useGSAP`, `DUR`, `EASE`, `STAGGER`, `MQ_REDUCE`, `MQ_MOTION` and `motionMatchMedia` from `shared/motion/motion.ts`, which registers `useGSAP`. Durations are 150–400ms with `power2.out` or `power3.out`. No bounce or elastic easing.

- Register plugins in the file that uses them: `import { ScrollTrigger } from "gsap/ScrollTrigger"` (`Reveal`) or `gsap/Flip` (`ScheduleBoard`). Do not import `gsap/all`.
- Create tweens inside `useGSAP`, or in handlers wrapped with `contextSafe`. Never call `gsap` during render. Pass `scope` when tweens target the component's own elements.
- Every GSAP path must honour reduced motion: apply the end state instantly and never leave content hidden. Use `motionMatchMedia` or check `MQ_REDUCE`.
- Entrances visible on first paint use CSS keyframes (for example `tx-home-rise` in `app/styles/components.css`), not GSAP, so there is no flash after hydration. Under `prefers-reduced-motion: reduce`, `base.css` sets `animation` and `transition` to `none`.
- `Reveal` (`shared/motion/Reveal.tsx`) staggers in the direct children. Use it for content below the fold (`onScroll`) whose children do not change after mount. Its `<noscript>` style keeps children visible without JS.
- `AnimatedNumber` takes `format` as `"vnd" | "int" | "clock"`, a string, so server components can render it. The animated text is `aria-hidden`; the real value is in `.tx-sr-only`.

## Design system

The Tixora design system lives in `shared/` and `app/styles/`. Reuse existing components and tokens before creating new ones.

- `shared/ui/*`: primitives (Button, Dialog, Field, Labels, Notice, Radio, Section, SegmentedControl). `shared/ui/layout/` holds the mobile shell components and `shared/ui/flow/` holds `FlowState` and `Progress`.
- `modules/<ctx>/ui/*`: domain components (catalog, seating, booking, ticketing).
- `shared/lib/`: `cx.ts` (class join), `format.ts` (`formatVND`, `formatClock`, `holdSecondsLeft`). `shared/kernel/`: `tier.ts` (`TierKey`, `MAX_TICKETS`, `TIER_KEYS`, `TierQuantities`, `countTickets`), `sale.ts` (`SaleStatus`).
- There is no barrel file. Import each file directly, for example `@/shared/ui/Button`.
- New pages can use Tailwind utilities from `tailwind.css`.
- New tokens go in `app/styles/tokens.css`. Map them in `tailwind.css` only when a utility is needed.
- No rounded corners (`--radius: 0`) and no hard-coded colours. Use tokens.
- UI strings are in Vietnamese.

### Styling

- Component styles are in one global stylesheet, `app/styles/components.css`. There are no CSS Modules.
- `app/globals.css` imports `tokens.css`, `base.css`, `tailwind.css` and `components.css` in that order. `base.css` holds the reset (in `@layer base`) and the `.tx-*` helpers. `components.css` is unlayered, so its rules beat layered (Tailwind) utilities whatever the specificity.
- `components.css` sections, in order: shared (ui, layout, flow, motion), modules (catalog, seating, booking, ticketing), widgets, pages (`tx-home-*`, `tx-event-page-*`). Rule order matters: a later rule overrides an earlier one (for example `.tx-flow-cta` comes after the Button rules).
- Class names are `.tx-<area>-<name>` in kebab-case. Modifiers use `--` (`tx-btn--primary`, `tx-btn--on-brand`). Every class must be unique across the project and must not clash with a `.tx-*` class in `base.css` (Section uses `tx-section-layout` because `base.css` has `.tx-section`).
- Keyframes are prefixed the same way (`tx-home-rise`, `tx-booking-timer-pulse`).
- Components pass class strings with `cx(...)` from `@/shared/lib/cx`. Variant classes are built from template strings (for example `` `tx-btn--${size}` ``), so every value of a union type needs a matching class.
