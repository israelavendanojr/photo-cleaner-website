# Bristle — marketing site

Marketing site for **Bristle**, an iOS photo-cleaning app. Today it's an email
waitlist page (backed by Supabase, protected by Cloudflare Turnstile) plus
`/privacy` and `/support`. Later it will host the post-launch landing page.

Built with Next.js 16 (App Router, Cache Components), TypeScript (strict),
Tailwind CSS v4, Motion, Zod and MDX.

## Local setup

Requires Node 20+ and pnpm 10.

```bash
pnpm install
cp .env.example .env.local   # then fill it in, see "Backend setup"
pnpm dev                     # http://localhost:3000
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
  api/join/route.ts     POST: waitlist signup (honeypot, timing, Turnstile, Supabase insert)
  api/keepalive/route.ts GET: daily cron ping so Supabase doesn't pause the project
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
  waitlist.ts           joinWaitlist(): the only waitlist API the UI uses
  validation.ts         Zod email schema (+ server-side normalization)
  env.ts                Validated server env (server-only)
  env-client.ts         Validated public env (Turnstile site key)
  supabase-server.ts    Supabase client with the secret key (server-only)
  turnstile.ts          verifyTurnstile(): Cloudflare siteverify (server-only)
  log.ts                maskEmail() for logs (server-only)
  site.ts               Name, URL, support email, footer links
  content.ts            ContentMeta type + metadata helper for MDX pages
  brand.ts              Raw brand colors for next/og and <meta theme-color>
  og.tsx, og-logo.tsx   Share-image rendering
  motion.ts             Easing, springs and stagger timing
assets/fonts/           TTFs used only by generated images (OFL, see LICENSE.md)
design/                 Approved reference from Claude Design (not shipped)
supabase/migrations/    SQL for the waitlist table
vercel.json             Daily cron for /api/keepalive
```

### Design tokens

All colors, type sizes, radii, shadows and named spacing live in the `@theme`
block of `app/globals.css` and are used through Tailwind utilities
(`bg-canvas`, `text-ink-muted`, `shadow-card`, `h-control`…). Don't hard-code
values in components. If a value is missing, add a token. `lib/brand.ts`
mirrors the few colors needed outside CSS.

## How a signup works

```
WaitlistForm → joinWaitlist() (lib/waitlist.ts) → POST /api/join → Supabase
```

The browser never talks to Supabase; only the server uses the secret key.
`POST /api/join` takes `{ email, honeypot, elapsedMs, turnstileToken }` and:

1. Honeypot filled, or submitted under 2s after the form mounted → returns
   normal success and saves nothing.
2. Verifies the Turnstile token. Rejected → `403 verification_failed`. If
   Cloudflare is unreachable it fails open (logs a warning, allows the signup).
3. Validates and normalizes the email (trim, lowercase, max 254) →
   `400 invalid_email` if bad.
4. Inserts it. A duplicate is treated as success, and the response is identical
   for new and existing emails so it never reveals who is on the list.

Unexpected errors return `500 unknown`. Logs never contain full emails.

On the client, the Turnstile widget (Managed mode) takes no space unless
Cloudflare asks for a click. Tokens are single use, so the widget resets after
every attempt. If it errors or hasn't produced a token after ~8s, the form
submits anyway (the server then decides).

## Backend setup

### 1. Supabase

Create a project, then run `supabase/migrations/0001_waitlist.sql` in the SQL
editor. It creates `public.waitlist` with RLS on and no access for `anon` or
`authenticated`, so only the secret key (`service_role`) can read or insert.

Free projects pause after a week without activity. The daily cron below keeps
it awake.

### 2. Cloudflare Turnstile

In the Cloudflare dashboard → Turnstile, add a widget in **Managed** mode with
`localhost` as a hostname. After deploying, add the production domain (and any
Vercel preview domains you want to test on) to the widget's hostnames, or the
widget will error there.

### 3. Environment variables

All variables are listed in `.env.example` with where each comes from.

- **Locally:** copy it to `.env.local` and fill it in. To skip the real widget,
  use Cloudflare's always-pass test keys (in `.env.example`).
- **Vercel:** Project → Settings → Environment Variables, same names. Use the
  real Turnstile keys for Production. `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is baked
  in at build time, so redeploy after changing it.

Server variables are validated on first use: a missing one makes the API fail
fast with a message naming it.

### 4. Cron

`vercel.json` schedules `GET /api/keepalive` daily (the Hobby plan allows one
run per day). It runs a trivial query and requires
`Authorization: Bearer $CRON_SECRET`, which Vercel Cron sends automatically
when `CRON_SECRET` is set in the project. To test it:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://<your-domain>/api/keepalive
```

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
- Add the production domain to the Turnstile widget's hostnames and set all
  env vars in Vercel (see "Backend setup").
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
