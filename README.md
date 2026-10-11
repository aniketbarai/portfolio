# Aniket Barai — The Digital Dimension

A 3D developer portfolio built with Next.js (App Router), TypeScript, Tailwind CSS v4,
React Three Fiber / Three.js, Drei and Motion.

## Features
- Full-screen WebGL hero (brushed-metal monolith, glass panels, orbit rings, particles) with pointer parallax, scroll-driven camera, hover labels and click-to-navigate. Static SVG fallback when WebGL is unavailable.
- Spatial 3D project gallery on desktop with keyboard tabs and a detail panel; touch-first horizontal carousel on mobile/tablet.
- 3D skills constellation synced with an accessible category grid.
- Experience timeline, engineering philosophy, and a contact form with validation, loading/success/error states and server-side spam protection.
- Reduced-motion support, responsive layouts, metadata/Open Graph, sitemap, robots, JSON-LD.

## Content
All copy and facts live in `data/portfolio.ts` (types in `data/types.ts`). Add a project by appending to `projects`; it appears in the gallery, carousel and detail views automatically.

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
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, OG tags and sitemap. |
| `RESEND_API_KEY` | Server-only key for sending contact emails via Resend. |
| `CONTACT_TO_EMAIL` | Inbox that receives messages. |
| `CONTACT_FROM_EMAIL` | Verified sender on your Resend domain. |
| `TURNSTILE_SECRET_KEY` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Optional Cloudflare Turnstile anti-spam widget. |

Without the Resend variables the contact form shows an honest "not connected" message with the email address; it never reports a fake success.

To add a resume, place `public/resume.pdf`. The download link appears only when the file exists.

## Deployment
Deploy to Vercel (or any Node host): import the repository, set the environment variables above, and run `npm run build`. The contact rate limiter is in-memory per instance; use a shared store if you run multiple instances.

## Notes
- Project screenshots: each project uses a generated 3D emblem. Add an image under `public/` and set `image` in `data/portfolio.ts` to show a screenshot.
