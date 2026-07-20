# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Next.js dev server with Turbopack (http://localhost:3000)
npm run build        # Production build
npm run start        # Serve the production build
npm run lint         # next lint (eslint-config-next: core-web-vitals + typescript)
npm run seed:supabase # Seed Supabase from app/data/cms.ts using the service-role key (tsx)
```

No test framework is configured.

To exercise a single page during dev, just visit its route; there is no per-file test runner.

## Environment

`.env` (gitignored) must contain Supabase credentials for content to render:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — used by both server reads and the browser client.
- `SUPABASE_SERVICE_ROLE_KEY` — only for `seed:supabase` (bypasses RLS).
- `NEXT_PUBLIC_SITE_URL` — canonical base URL for metadata/SEO (defaults to `https://latitibabu.com`).

## Architecture

This is Lati Tibabu's personal portfolio (Next.js 15 App Router, React 19, TypeScript strict, Tailwind v4 + daisyUI). It markets Odoo ERP/marketplace work, a graphics gallery, and a blog, backed by a Supabase CMS.

### Content model: three collections, two sources

Three collections — **graphics**, **marketplace** (Odoo apps/themes), **blog** — each with a list page and a `[slug]` detail page under `app/`.

- **Public pages read only from Supabase** via server-side loaders in `app/lib/content.ts` (`loadGraphicsItems`, `loadMarketplaceItems`, `loadBlogPosts`). These create a fresh anon client per call, return `[]` when Supabase is unconfigured or empty, and filter blog drafts (`is_draft = false`). Detail pages `notFound()` if the slug isn't in the loaded set — so with no Supabase config, list and detail pages render empty / 404.
- **Static seed data** lives in `app/data/cms.ts` (marketplace built from `app/data/odooMarketplace.ts`). It defines the TypeScript types (`GraphicItem`, `MarketplaceItem`, `BlogPost`) and the shapes the schema expects, but is **not** rendered directly by public pages — it feeds `npm run seed:supabase`. When adding a new collection, update both the Supabase schema/loaders and the static seed data so they stay in sync.
- Row → model mapping in `content.ts` normalizes snake_case DB columns to camelCase, coerces array columns (`tags`, `highlights`, `screenshots`) that may arrive as comma strings, and falls back to `https://placehold.co/600x400@2x.png` for blank image URLs.

### Admin CMS (`app/admin`)

`app/admin/AdminConsole.tsx` is a single large client component that drives the whole CMS. It uses the **browser** Supabase client (`app/lib/supabase/browser.ts`) with **email/password auth**. RLS (defined in `supabase/schema.sql`) grants anon read and authenticated full CRUD on all three tables; blog drafts are hidden from anon. The admin can upload graphics images to the `portfolio-media` storage bucket. `Header.tsx` shows the **Admin** nav link only when a Supabase session exists.

When extending the admin, follow the existing per-collection pattern: a `*Form` state object, an `empty*Form()` factory, an auto-slug effect gated by a `*SlugManuallyEdited` flag, an `ensureUnique*Slug` loop that appends `-N` on conflict, and a `save*` / `delete*` pair that calls `loadAll()` afterward.

### Content rendering

Detail bodies are stored as HTML (or Markdown for blog, via `marked`) in `details_html` / `details_html`. `BlogContent` chooses HTML vs Markdown by `contentFormat` and renders through `RichHtml`. Blog post slugs, format, and draft state are stored in `blog_posts`.

### Styling & theme

Theming is **CSS custom properties**, not a Tailwind config or DESIGN.md hex values. Tokens are defined in `app/globals.css` (`:root`): `--color-surface`, `--color-on-surface`, `--color-on-surface-variant`, `--color-surface-border`, `--color-electric-blue` (primary CTA / links), `--color-success-teal`, `--color-error`, plus `--color-surface-container-*` elevation steps. Components reference these as `bg-[var(--color-surface)]` / `text-[var(--color-on-surface)]` arbitrary-value utilities. The implemented palette is a cool slate + electric-blue (`#0ea5e9`) system — note that `DESIGN.md` describes a *different* warm parchment/Anthropic-inspired palette and is an aspirational reference, not the current implementation. Trust `globals.css` tokens for actual colors.

Fonts via `next/font/google`: Geist (`--font-geist`, headings via `.font-heading`), Inter (`--font-inter`, body), JetBrains Mono (`--font-mono`). They are wired in `app/layout.tsx`.

### Images

`next.config.ts` whitelists remote image hosts: `**.supabase.co/storage`, `apps.odoocdn.com`, and `placehold.co`. Graphics uploaded through admin go to the public `portfolio-media` bucket; the admin stores both the public `image_url` and the storage `image_path`.

### SEO

Every page exports `metadata` or `generateMetadata` with canonical URLs and OpenGraph/Twitter cards. `app/layout.tsx` injects a `Person` JSON-LD block; detail pages add `BlogPosting` / `ItemList` structured data. `app/sitemap.ts` and `app/robots.ts` generate those dynamically. Slugs are kebab-case, lowercased, auto-derived from title/name.

### Database setup

`supabase/schema.sql` is the full idempotent schema (tables, constraints, the `portfolio-media` bucket, and RLS policies). `supabase/migrations/` holds incremental changes. To set up a fresh project, run `schema.sql` against it, then `npm run seed:supabase`.