# Aniket Barai — The Digital Dimension

A 3D developer portfolio built with Next.js (App Router), TypeScript, Tailwind CSS v4,
React Three Fiber / Three.js, Drei and Motion.

## Features

- **Cinematic WebGL hero** — a brushed-metal monolith, glass panels, orbital rings, luminous fragments and drifting particles, with pointer parallax, a scroll-driven camera, hover labels and click-to-navigate objects. Non-WebGL clients get a composed SVG fallback, and the static composition holds the viewport while the 3D bundle downloads.
- **Spatial 3D project gallery** (desktop) with keyboard-operable tabs and a full detail panel; a touch-first scroll-snapped deck on mobile and tablets. Long project lists collapse gracefully instead of stacking at the horizon.
- **Case studies with real URLs** — every project gets a statically generated page at `/work/[slug]` with its own metadata, JSON-LD, emblem and previous/next navigation.
- **3D skills constellation** synced with an accessible category grid: hover or focus previews a technology, click pins it.
- **Experience timeline** with client work, team projects, leadership, technical events and problem-solving milestones, plus an education panel.
- **Engineering philosophy** and an immersive contact section with a validated form (loading, success and failure states, honeypot, timing check, optional Turnstile, server-side rate limiting).
- **Production concerns** — reduced-motion support, no-JS reveal fallback, error boundaries around every 3D scene, metadata/Open Graph, sitemap (including case studies), robots, JSON-LD, security headers.

## Content

All copy and facts live in `data/portfolio.ts` (types in `data/types.ts`). Nothing is
hard-coded in components.

| Want to change | Edit |
| --- | --- |
| Name, title, email, phone, location, status | `profile` |
| LinkedIn | `profile.linkedin` — set the URL; while it is `null` the row is hidden rather than linking nowhere |
| Phone / location | `profile.phone`, `profile.location` — set to `null` to hide |
| Projects | append to `projects`; the gallery, carousel, detail panel, case-study page and sitemap all pick it up |
| Skills | `skillCategories` |
| Timeline entries | `experience` |
| Education | `education` |
| Philosophy principles | `principles` |
| About copy and the fact rail | `about` |

`null` is meaningful throughout: an unknown year, a missing repository or a missing live
demo renders an honest state ("Source not published", "No public demo") instead of a dead
link, and the copy avoids numbers that cannot be verified.

Dated facts in the data file were checked against primary sources (repository metadata,
package manifests, contributor counts, commit and creation dates, and the previous live
portfolio). Re-check anything you change.

### Project screenshots

Each project ships with an original generated emblem rather than an invented screenshot.
To show a real one: drop the file in `public/` and set `image` on that project in
`data/portfolio.ts`.

## Setup

Requires Node.js 20.9+ (tested on 22).

```bash
npm install
cp .env.example .env.local   # then fill in values (see below)
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run typecheck`.

## Environment variables

See `.env.example`.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, OG tags, JSON-LD and the sitemap. |
| `RESEND_API_KEY` | Server-only key for sending contact emails via Resend. |
| `CONTACT_TO_EMAIL` | Inbox that receives messages. |
| `CONTACT_FROM_EMAIL` | Verified sender on your Resend domain. |
| `TURNSTILE_SECRET_KEY` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Optional Cloudflare Turnstile anti-spam widget. |

Without the Resend variables the contact endpoint returns **503 with a clear message** and
the form asks the visitor to email directly. It never reports a fake success. Secrets are
read on the server only; nothing sensitive reaches the client bundle.

## Résumé

The download link appears in the contact section **only when the file exists**, so it is
never a broken button. To enable it, add your PDF as `public/resume.pdf`.

## Deployment

Deploy to Vercel (or any Node host): import the repository, set the environment variables
above, and run `npm run build`. The contact rate limiter is in-memory per instance — swap
`lib/rate-limit.ts` for a shared store (Redis/Upstash) if you run multiple instances.

## Accessibility and performance notes

- Sections are reachable and readable with JavaScript disabled (the no-JS stylesheet forces reveals visible).
- `prefers-reduced-motion` is honoured in CSS, in Motion (`MotionConfig reducedMotion="user"`) and in the scenes, which render a single static frame instead of animating.
- Every scene is dynamically imported, pauses its render loop when off-screen, and is wrapped in an error boundary that degrades to a static composition.
- Device pixel ratio and particle counts are reduced on small or touch-first devices, and the heaviest layout (the spatial gallery) is desktop-only.
