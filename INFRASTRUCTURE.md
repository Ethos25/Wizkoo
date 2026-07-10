# Wizkoo Infrastructure Map

Captured 2026-07-09 during the wizkoo-app production deploy session (Day 6
deploy gate). Facts verified live against DNS, the Vercel API, Clerk-served
pages, and the repos on this machine unless marked otherwise.

**Rule for this file: env var NAMES only, never values. No keys, no tokens,
no secrets of any kind.**

---

## Repos on this machine

| Folder (Desktop\) | GitHub remote | Branch | Purpose |
|---|---|---|---|
| `Wizkoo` | github.com/Ethos25/Wizkoo | main | Marketing site (static HTML). Holds `netlify.toml` with the `/plan` proxy to the generator. THIS repo. |
| `wizkoo-app` | github.com/Ethos25/wizkoo-app | master | Per-child tracking app. pnpm/turbo monorepo: `apps/app` (@wizkoo/app, Next.js 16.2.2) + packages `types`, `design-tokens`, `pdf`, `ui`. |
| `wizkoo-plan-generator` | github.com/Ethos25/wizkoo-plan-generator | master | Plan generator. Next.js with `basePath: '/plan'`. Drizzle + Stripe + Resend + Sentry + Upstash + PostHog. |
| `Atlas` | github.com/Ethos25/Atlas | main | atlas.wizkoo.com (Netlify). ⚠ 168 uncommitted changes at survey time (2026-07-09). |
| `Elementum` | github.com/ethos25/elementum | main | elementum.wizkoo.com (Netlify). Clean. |
| `Wizkoo PDF` | — **not a git repo** | — | Local-only folder. |
| `Wizkoo Tracker` | — **not a git repo** | — | Local-only folder (predecessor material to wizkoo-app). |

All git repos had zero unpushed commits at survey time. Adjacent non-Wizkoo
folders (Learnkoo, AMD, Cowork Output) are separate ventures, out of scope
here; Learnkoo and AMD are not git repos either.

**Folder consolidation plan:** physical consolidation of these folders under
a single `Desktop\Wizkoo\` parent is planned **post-cron-verification (after
July 11, 2026)**. Full monorepo absorption (generator + marketing into
wizkoo-app's workspace) remains **Wave 2**.

---

## Deploys

### Vercel — two separate accounts

**Account amy@wizkoo.com (user `amy-8769`) → team `wizkoo`
(`team_qdCl4dKimN3Tsiv3kwi89K1i`), plan: Pro.** Owns all Wizkoo product
deploys:

| Project | ID | Source | Notes |
|---|---|---|---|
| `wizkoo-plan-generator` | `prj_LMoJkX1R0cJzp69LgiwSAPHH0ros` | Ethos25/wizkoo-plan-generator @ master | Serves wizkoo.com/plan via Netlify proxy. 4 crons (see below). |
| `wizkoo-app` | `prj_Da6AndoRNw83HdLZA9I1aAZ7wM7S` | Ethos25/wizkoo-app @ master, rootDirectory `apps/app` | Created 2026-07-09. Serves app.wizkoo.com. 1 cron. |

**Account amyoguntala-8873** (the login used day-to-day in the terminal):
- personal scope `amyoguntala-8873s-projects` — Hobby, no projects.
- team `ethos-signal` — Pro, hosts `drift-quotient` (www.driftquotient.com).
  EthosSignal venture, not Wizkoo.

Deployment protection on team `wizkoo`: `*.vercel.app` deployment URLs are
SSO-protected; custom production domains are public.

### Netlify

Sites (login/account **not verified this session** — confirm and record):
- `wizkoo.netlify.app` — marketing site from the `Wizkoo` repo; also proxies
  `/plan` and `/plan/*` (200 rewrites) to `wizkoo-plan-generator.vercel.app`.
- `atlas-wizkoo.netlify.app` — atlas.wizkoo.com.
- `wizkoo-elementum.netlify.app` — elementum.wizkoo.com.

---

## DNS — registrar: Porkbun (zone: wizkoo.com)

| Record | Type | Points to | Serves |
|---|---|---|---|
| `wizkoo.com` (apex) | A ×2 + AAAA ×2 | Netlify front (AWS IPs) | 301 → www |
| `www` | CNAME | wizkoo.netlify.app | Marketing site + /plan proxy |
| `app` | CNAME | f27c3b09e53925c1.vercel-dns-016.com | Tracking app (added 2026-07-09) |
| `atlas` | CNAME | atlas-wizkoo.netlify.app | Atlas |
| `elementum` | CNAME | wizkoo-elementum.netlify.app | Elementum |
| `clerk` | CNAME | frontend-api.clerk.services | Clerk Frontend API (prod) |
| `accounts` | CNAME | accounts.clerk.services | Clerk Account Portal |
| `clkmail` | CNAME | mail.v5yxksofs0po.clerk.services | Clerk email sending |
| `clk._domainkey` | CNAME | dkim1.v5yxksofs0po.clerk.services | Clerk DKIM 1 |
| `clk2._domainkey` | CNAME | dkim2.v5yxksofs0po.clerk.services | Clerk DKIM 2 |
| `wizkoo.com` | MX | smtp.google.com (pref 1) | Google Workspace mail (amy@/admin@) |
| `wizkoo.com` | TXT ×2 | SPF + verification (values not enumerated) | Mail auth |
| `_dmarc` | TXT | `v=DMARC1; p=none; rua/ruf=mailto:admin@wizkoo.com; fo=1` | DMARC (report-only) |
| `google._domainkey` | TXT | Google DKIM | Workspace mail signing |

---

## Clerk — ONE production instance, shared

- Primary domain: **wizkoo.com**; Frontend API: **clerk.wizkoo.com**.
- Shared by BOTH apps. Works across all subdomains (session cookie on
  `.wizkoo.com`) — sessions are shared between wizkoo.com/plan and
  app.wizkoo.com, and the user pool is one pool.
- **Dashboard Paths point at www.wizkoo.com/plan/* — these are the
  instance-wide defaults the GENERATOR depends on. Do not repoint.** Each app
  overrides paths in code: generator `signInUrl="/plan/sign-in"` (its
  `src/app/layout.tsx`), tracking app `signInUrl="/sign-in"`
  (`apps/app/src/app/layout.tsx`).
- Both apps use the same `pk_live_`/`sk_live_` production keys; local dev in
  both repos uses the dev instance (`pk_test_`/`sk_test_`).

## Supabase — one project, shared database

- Single project shared by generator and tracking app (URL in
  `NEXT_PUBLIC_SUPABASE_URL`, public by design).
- Shared core tables: `families`, `children`, `plans`, `plan_blocks`,
  `orbit_reports`. Tracking app adds its own (completions, pathways,
  off-plan, mastery, concept exposure, etc.).
- **RLS posture: deny-by-default on all 18 app tables; app reads happen
  server-side (service role).** Verified live 2026-07-09: bare-anon SELECT
  returns zero rows on all 13 probed tables, INSERT rejected (42501), UPDATE
  is a no-op. Generator uses direct Postgres (Drizzle/`DATABASE_URL`), which
  bypasses RLS by connecting as the database role — its safety rests on
  server-only code.

---

## Env var inventory (NAMES ONLY)

### wizkoo-app @ Vercel (production target only, set 2026-07-09)

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY` (server-side)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side)
- `CRON_SECRET` (server-side; bearer guard for `/api/cron/orbit`)

Preview environment intentionally has NO vars — preview deploys will not
boot against production data by default. Decide separately if previews are
ever needed.

### wizkoo-plan-generator @ Vercel (production)

`ANTHROPIC_API_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`,
`CRON_SECRET`, `DATABASE_URL`, `DIRECT_URL`,
`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_CLERK_SIGN_IN_URL`,
`NEXT_PUBLIC_CLERK_SIGN_UP_URL`, `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`,
`NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`, `NEXT_PUBLIC_POSTHOG_HOST`,
`NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_SITE_URL`,
`NEXT_PUBLIC_STREAM_ORIGIN`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`,
`RESEND_API_KEY`, `SENTRY_DSN`, `STRIPE_ANNUAL_PRICE_ID`,
`STRIPE_MONTHLY_PRICE_ID`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
`UPSTASH_REDIS_REST_TOKEN`, `UPSTASH_REDIS_REST_URL`

⚠ **Flag (2026-07-09):** the generator's PRODUCTION env carries TEST-mode
Stripe keys (`pk_test_`/`sk_test_`). Live payments are effectively off.
Confirm whether intentional (soft launch) and resolve.

### Upstash Redis (rate limiting) — REPLACED 2026-07-10

The original standalone-account Upstash database
(`internal-polecat-91323.upstash.io`) was deleted upstream (free tier,
inactivity) and its DNS stopped resolving — every generator API route that
calls the rate limiter directly (8 of 12) returned 500 until replaced.
Incident + fix: Day 8 seam audit.

Replacement: **Vercel Marketplace resource `wizkoo-rate-limit`** (Upstash
for Redis, plan **Pay As You Go**, region iad1, eviction on), installed on
team `wizkoo` (installation `icfg_iLa1p1R8QFQJqeX9qobRO2o6`), billed
through the team's Vercel payment method — no free-tier expiry class.
Marketplace manages `KV_REST_API_URL` / `KV_REST_API_TOKEN` (+ `KV_URL`,
`REDIS_URL`, read-only token) on the project; the code-expected
`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` were re-pointed to
the same resource in Production and Development. **Preview env re-add kept
failing via CLI — preview still lacks the UPSTASH_* pair (known residual;
preview deploys have no env vars by policy anyway for wizkoo-app, but the
generator's preview target previously had them).**

Standing rule (Amy, 2026-07-10): dependencies on free tiers that expire or
delete for inactivity are banned for production.

### Crons (Vercel, all on team wizkoo/Pro)

| App | Path | Schedule |
|---|---|---|
| wizkoo-app | `/api/cron/orbit` | `5 * * * *` (hourly at :05) |
| generator | `/plan/api/cron/orbit-report` | `0 6 * * 0` (Sun 06:00) |
| generator | `/plan/api/cron/plan-lifecycle` | `0 3 * * *` (daily 03:00) |
| generator | `/plan/api/cron/re-engagement` | `0 14 * * *` (daily 14:00) |
| generator | `/plan/api/cron/auth-reconciliation` | `0 7 * * 1` (Mon 07:00) — **stub, no logic yet** |

All cron routes are guarded by `Authorization: Bearer <CRON_SECRET>` (each
app has its own CRON_SECRET value).

---

## Domain map (who serves what)

| URL | Platform | Source |
|---|---|---|
| wizkoo.com | Netlify | 301 → www |
| www.wizkoo.com | Netlify | `Wizkoo` repo (marketing) |
| www.wizkoo.com/plan/* | Netlify 200-proxy → Vercel | `wizkoo-plan-generator` |
| app.wizkoo.com | Vercel | `wizkoo-app` (apps/app) |
| atlas.wizkoo.com | Netlify | `Atlas` repo |
| elementum.wizkoo.com | Netlify | `Elementum` repo |
| clerk./accounts.wizkoo.com | Clerk | production auth instance |
| mail (@wizkoo.com) | Google Workspace | MX smtp.google.com |
