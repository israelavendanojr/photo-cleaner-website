# Bristle — marketing site

Marketing site for **Bristle**, an iOS photo-cleaning app. Today it's an email
waitlist page plus `/privacy` and `/support`. Later it will host the waitlist
backend and the post-launch landing page.

Built with Next.js 16 (App Router, Cache Components), TypeScript (strict),
Tailwind CSS v4, Motion, Zod and MDX.

## Local setup

Requires Node 20+ and pnpm 10.

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Scripts

| Script              | What it does                                                         |
| ------------------- | -------------------------------------------------------------------- |
| `pnpm dev`          | Dev server with hot reload                                           |
| `pnpm build`        | Production build (all routes prerender as static)                    |
| `pnpm start`        | Serve the production build                                           |
| `pnpm typecheck`    | Generate route types, then `tsc --noEmit`                            |
| `pnpm lint`         | ESLint (Next core-web-vitals + TypeScript rules, Prettier-safe)      |
| `pnpm format`       | Format everything with Prettier (sorts Tailwind classes)             |
| `pnpm format:check` | Check formatting without writing                                     |
| `pnpm check`        | typecheck + lint + format:check + build, which is what CI should run |

## Project structure

```
app/
  layout.tsx            Root layout: fonts, header, footer, site-wide metadata
  page.tsx              Waitlist page (/)
  privacy/page.tsx      /privacy (renders content/privacy.mdx)
  support/page.tsx      /support (renders content/support.mdx)
  globals.css           Design tokens (@theme) and base styles
  opengraph-image.tsx   Social share image (next/og), shared by all routes
  icon.svg, apple-icon.tsx, robots.ts, sitemap.ts
components/
  ui/                   Primitives: Button, Input, Card, Badge, Logo, Prose, Reveal, icons
  sections/             Page sections: SiteHeader, SiteFooter, Hero, WaitlistForm,
                        SuccessPill, TrustCard, ContentPage, PhoneMockup/
  motion-provider.tsx   LazyMotion + reduced-motion config
content/                MDX copy for content pages (edit text here)
lib/
  waitlist.ts           joinWaitlist(): the only waitlist API the UI uses (stub)
  validation.ts         Zod email schema
  site.ts               Name, URL, support email, footer links
  content.ts            ContentMeta type + metadata helper for MDX pages
  brand.ts              Raw brand colors for next/og and <meta theme-color>
  og.tsx, og-logo.tsx   Share-image rendering
  motion.ts             Easing, springs and stagger timing
assets/fonts/           TTFs used only by generated images (OFL, see LICENSE.md)
design/                 Approved reference from Claude Design (not shipped)
```

### Design tokens

All colors, type sizes, radii, shadows and named spacing live in the `@theme`
block of `app/globals.css` and are used through Tailwind utilities
(`bg-canvas`, `text-ink-muted`, `shadow-card`, `h-control`…). Don't hard-code
values in components. If a value is missing, add a token. `lib/brand.ts`
mirrors the few colors needed outside CSS.

## Where the backend plugs in

`lib/waitlist.ts` exports the single function the form calls:

```ts
joinWaitlist(email: string, options?: { honeypot?: string }): Promise<JoinResult>
```

It's currently a **stub** that waits ~800ms and returns success. To go live,
replace its body with a real request (e.g. `fetch("/api/waitlist", …)`) and map
the response onto `JoinResult`:

```ts
type JoinResult =
  | { ok: true; status: "joined" | "already_joined" }
  | { ok: false; error: "invalid_email" | "rate_limited" | "network" | "unknown"; message: string };
```

On error, the form shows `message` inline. No UI code needs to change.

- **Honeypot:** the form sends the hidden `company` field's value as
  `options.honeypot`. Humans leave it empty, so the backend should reject
  non-empty values.
- **Captcha:** a commented slot in `components/sections/waitlist-form.tsx`
  marks where a widget (e.g. Turnstile) mounts. Pass its token through
  `joinWaitlist`.

## Adding a content page

Content pages (`/privacy`, `/support`) are MDX, so copy can be edited without
touching components. To add one, e.g. `/press`:

1. Create `content/press.mdx` exporting
   `export const meta = { title, description, updated: "YYYY-MM-DD" }`.
2. Create `app/press/page.tsx` by copying `app/support/page.tsx` and swapping
   the import and path.
3. Add it to `navLinks` in `lib/site.ts` (footer) and to `app/sitemap.ts`.

Placeholder copy is marked with a visible `> **TODO: draft.**` callout and
`{/* TODO(…) */}` comments. Remove both before launch.

## Before launch

- Confirm the production domain in `lib/site.ts` (`url`). It feeds canonical
  URLs, Open Graph, robots.txt and the sitemap.
- Replace the TODO copy in `content/privacy.mdx` and `content/support.mdx`.
- Implement `joinWaitlist` against the real backend.
- If analytics is added (e.g. Vercel Analytics once deployed), update the
  Analytics section of the privacy page.

## Notes

- **Fonts:** headings use New York and body text uses SF on Apple devices.
  Elsewhere they fall back to Newsreader and Inter, loaded with `next/font`
  and not preloaded, since Apple devices never need them.
- **Motion:** the page-load entrance is pure CSS, so it paints before
  hydration. The phone loop and form transitions use Motion via `LazyMotion`.
  Everything respects `prefers-reduced-motion`.
- **Lighthouse** (local production build, simulated mobile / desktop):
  95+ in every category on all routes.
