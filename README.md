# TSA Website

Website for the **Thai Student Association at the University of Maryland**, built
by Campus Coders Crew.

Stack: React 19 + TypeScript + Vite 7 + Tailwind CSS v4, with GSAP and Framer
Motion for the scroll and card animations.

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

Other scripts:

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Type-check, production build into `dist/`, then write the SPA 404 fallback |
| `npm run preview` | Serve the built `dist/` locally — **use this to test a Pages build** |
| `npm run lint` | ESLint over the repo |
| `npm run extract-posters` | Regenerate video poster frames in `public/video/` |

---

## Deployment (GitHub Pages)

Deploys are automatic. **Merge to `main` and the site goes live** —
`.github/workflows/deploy.yml` builds the project and publishes `dist/` to
GitHub Pages. You can also trigger a deploy by hand from the Actions tab
("Deploy to GitHub Pages" → Run workflow).

Live URL: <https://campuscoderscrew.github.io/tsa-website/>

### One-time repo setup

Someone with admin rights has to do this once, or the workflow will fail on its
last step:

1. **Settings → Pages → Build and deployment → Source: `GitHub Actions`.**
   (Not "Deploy from a branch".)
2. Push to `main` and watch the run in the Actions tab.

### What makes Pages work

A project site lives at a sub-path (`/tsa-website/`), not at the domain root, so
three things are configured for it. If you are changing any of them, change all
three together.

1. **`vite.config.ts` → `base`.** Set to `/tsa-website/`. Vite prefixes every
   built asset URL with it and exposes it as `import.meta.env.BASE_URL`.
2. **`src/main.tsx` → `<BrowserRouter basename={...}>`.** Strips the prefix
   before route matching, so `/tsa-website/gallery` matches the `/gallery` route.
3. **`scripts/copy-404.mjs`.** Pages has no rewrite rule, so a hard refresh on
   `/tsa-website/gallery` is a request for a file that does not exist. Copying
   `index.html` to `404.html` lets the SPA boot and resolve the route client-side.

(You may see `.nojekyll` in other GitHub Pages projects — it disables Jekyll
processing. It isn't needed here: `actions/deploy-pages` publishes the build
artifact directly and never runs Jekyll. It *would* be needed if we ever
switched to deploying from a branch.)

### Referencing assets — important

Anything in `public/` **must** be referenced through the base URL, never with a
bare leading slash:

```tsx
const base = import.meta.env.BASE_URL;

<img src={`${base}logo.jpg`} />   // ✅ /tsa-website/logo.jpg in prod, /logo.jpg in dev
<img src="/logo.jpg" />           // ❌ 404 in production
```

Same for links: use React Router's `<Link to="/gallery">` (the router adds the
basename) rather than a raw `<a href="/gallery">`.

Imported assets (`import hero from "@/assets/hero.png"`) are rewritten by Vite
automatically and need nothing special.

### Moving to a custom domain later

1. Add `public/CNAME` containing the bare domain, e.g. `tsa.campuscoderscrew.com`.
2. Build with `VITE_BASE=/` (set it in the workflow's build step).
3. Point the DNS record at GitHub Pages and set the domain in Settings → Pages.

### Deploy troubleshooting

| Symptom | Cause |
| --- | --- |
| Blank page, console 404s on `/assets/*.js` | `base` is wrong or missing in `vite.config.ts` |
| Home page works, `/gallery` 404s on refresh | `404.html` missing — check `copy-404.mjs` ran in the build |
| Images broken in prod but fine in dev | Hardcoded `/foo.jpg` instead of `` `${base}foo.jpg` `` |
| Workflow fails on "Deploy to GitHub Pages" | Pages source is not set to "GitHub Actions" in repo settings |
| Old content still served | Pages CDN cache — hard-refresh, or wait a minute |

---

## Project layout

```
public/              static assets served at the site root (images, video)
src/
  components/
    about/           AboutUsScroll — pinned scroll cards
    board/           BoardMembersSection — board photo grid + gallery CTA
    events/          UpcomingEvents — draggable fanned card carousel
    footer/          Footer — contact + socials
    motion/          shared motion helpers
    staggered-menu/  slide-out nav
    transitions/     GalleryTransitionProvider — route transition
    ui/              shared primitives (button, avatar, hero, image-tiles)
  pages/             HomePage, GalleryPage
  lib/               utils
  index.css          Tailwind v4 theme + design tokens
scripts/             build-time node scripts
product_specs/       weekly specs for contributors — start here
```

## Contributing

Work is tracked as weekly specs in [`product_specs/`](./product_specs). Pick up
the spec you were assigned, branch off `main`, and open a PR that references the
spec ID in its title (e.g. `W38.1.1 — define TSA color tokens`).
