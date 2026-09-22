# W38 — Sprint Overview

**Week of:** 2026-09-14
**Scope:** Static front end only — Vite + React + Tailwind v4, deployed to GitHub Pages under `/tsa-website/`. No backend.
**Created:** 2026-09-21
**Updated:** 2026-09-21

---

## What we are building this week

Three features, broken into twelve ~1-hour specs across six tracks. Every spec is
a standalone assignment: it tells you *what* to change and *why*, but you write
the code. If a spec tells you exactly what to type, that is a bug in the spec —
tell Brennen.

| Feature | Specs | Summary |
| --- | --- | --- |
| **Feature 1 — Brand Identity System** | 1.1, 1.2, 1.3, 2.1, 2.2, 5 | Replace greyscale shadcn tokens and scattered hex with a real TSA palette, add a display serif, build a Thai ornament kit, and fix the logo / favicon / link preview. |
| **Feature 2 — Board Member Showcase** | 3.1, 3.2, 3.3 | Turn 14 anonymous photos into cards with name, role, major and fun facts — TSA's #1 feature request. |
| **Feature 3 — Gallery and Contact Polish** | 4.1, 4.2, 6 | Make the gallery look like the same site, give every photo alt text and an event, and replace placeholder contact details with real ones. |

### Overall proficiency per feature

The average of each feature's spec scores (see the [spec index](#spec-index) and
[proficiency scale](#proficiency-scale) below). Use it to pick a feature that fits;
the **hardest spec** column shows where a feature needs a pair.

| Feature | FE | BE | DevOps | Hardest spec |
| --- | :-: | :-: | :-: | --- |
| **Feature 1 — Brand Identity System** (6 specs) | 2.7 | 1.0 | 1.5 | FE 3 (1.1, 1.3, 2.1, 2.2) · DevOps 3 (W38.5) |
| **Feature 2 — Board Member Showcase** (3 specs) | 3.0 | 1.3 | 1.3 | FE 4 (W38.3.3) |
| **Feature 3 — Gallery and Contact Polish** (3 specs) | 2.0 | 1.3 | 1.0 | FE 3 (W38.4.2) |

In short: **Feature 2** is the most front-end heavy and suits an intermediate
developer paired with someone stronger. **Feature 1** needs a solid front-end
developer. **Feature 3** is the easiest place for newer developers to start.

Features **not** specced this week are tracked in
[`../features_TODO.md`](../features_TODO.md).

---

## Dependency graph

Specs with no dependencies can be picked up immediately. Chained specs
(`W38.1.1 → W38.1.2`) must be done in order — do not start a spec whose
dependency is still `TODO`. A dotted line is a **soft** dependency: use the
tokens if W38.1.1 has merged, raw hex from its palette table if not — don't
block on it.

```
START HERE (6 specs can start on day 1 — one per track)
│
├── W38.1.1 ──┬──► W38.1.2                      Track A
│             └──► W38.1.3
│             ┊
│             ┊  soft
│             ▼
├── W38.4.1 ──► W38.4.2                         Track D
│
├── W38.2.1 ──► W38.2.2                         Track B  (2.1 soft-depends on 1.1)
│
├── W38.3.1 ──► W38.3.2 ──► W38.3.3             Track C
│
├── W38.5                                       Track E
└── W38.6                                       Track F
```

**Available on day 1:** W38.1.1, W38.2.1, W38.3.1, W38.4.1, W38.5, W38.6

**Land W38.1.1 first.** It unblocks the rest of Track A and gives Tracks B and D
real tokens instead of hex.

---

## Spec index

| Spec | Title | Track | Status | Assigned | FE | BE | DevOps | Depends on |
| --- | --- | :-: | --- | --- | :-: | :-: | :-: | --- |
| [W38.1.1](./W38.1.1.md) | Define the TSA color token set | A | TODO | TBD | 3 | 1 | 1 | — |
| [W38.1.2](./W38.1.2.md) | Migrate hardcoded hex colors to tokens | A | TODO | TBD | 2 | 1 | 2 | W38.1.1 |
| [W38.1.3](./W38.1.3.md) | Add a display typeface and type scale | A | TODO | TBD | 3 | 1 | 1 | W38.1.1 |
| [W38.2.1](./W38.2.1.md) | Build the Thai ornament component kit | B | TODO | TBD | 3 | 1 | 1 | — (soft: W38.1.1) |
| [W38.2.2](./W38.2.2.md) | Apply ornaments to section headers | B | TODO | TBD | 3 | 1 | 1 | W38.2.1 |
| [W38.3.1](./W38.3.1.md) | Create the board member data model | C | TODO | TBD | 2 | 2 | 2 | — |
| [W38.3.2](./W38.3.2.md) | Redesign the board card with name and role | C | TODO | TBD | 3 | 1 | 1 | W38.3.1 |
| [W38.3.3](./W38.3.3.md) | Add the board member detail overlay | C | TODO | TBD | 4 | 1 | 1 | W38.3.2 |
| [W38.4.1](./W38.4.1.md) | Rethemed gallery page | D | TODO | TBD | 2 | 1 | 1 | — (soft: W38.1.1) |
| [W38.4.2](./W38.4.2.md) | Gallery captions, alt text, and grouping | D | TODO | TBD | 3 | 2 | 1 | W38.4.1 |
| [W38.5](./W38.5.md) | Transparent logo, favicon set, and social preview | E | TODO | TBD | 2 | 1 | 3 | — |
| [W38.6](./W38.6.md) | Real contact details and social links | F | TODO | TBD | 1 | 1 | 1 | — |

**Total:** 12 specs ≈ 12 developer-hours.

### Why the scores land where they do

- **Back End is mostly 1** — there is no server. The 2s are the specs that design
  a data shape (`src/data/board.ts`, `src/data/gallery.ts`).
- **DevOps rises where deploys can break:** W38.5 (Vite's `index.html` path
  rewriting, checking `dist/`, absolute OG URLs that only work once deployed),
  W38.3.1 (`BASE_URL` and GitHub Pages' case-sensitive filenames), and W38.1.2
  (a seven-file diff that has to rebase cleanly around four other tracks).
- **W38.3.3 is the only 4** — mouse, touch and keyboard all have to work, on top
  of an existing GSAP inertia effect, with correct ARIA.
- **W38.6 is the entry point** — a good first spec for someone new to the repo.

---

## Proficiency scale

Each spec is scored 1–4 on Front End, Back End and DevOps. The score is the
level at which the spec is comfortable, **not** a gate — a 2 attempting a 3 with
a pair is exactly how you become a 3.

| Score | Meaning |
| :-: | --- |
| **1** | Complete newbie. Has not written code in this area before. |
| **2** | Associate. Can follow a pattern that already exists in the repo. |
| **3** | Intermediate. Can design a small component or function from a description. |
| **4** | Senior. Can reason about state ownership, edge cases and browser APIs unaided. |

---

## Shared files — coordinate before you push

Tracks are split by file, but a few files are touched by more than one spec
this week. If your spec is on a row below, pull `main` before you start and
again before you open your PR, and keep your diff to what your spec asks for.

| File | Touched by |
| --- | --- |
| `src/index.css` | W38.1.1, W38.1.3 — **Track A owns it.** Need a token? Ask Track A. |
| `index.html` | W38.1.3 (fonts), W38.5 (favicons, OG tags) |
| `src/components/board/BoardMembersSection.tsx` | W38.1.2, W38.2.2, W38.3.1, W38.3.2, W38.3.3 |
| `src/pages/GalleryPage.tsx` | W38.1.2, W38.4.1, W38.4.2 |
| `src/pages/HomePage.tsx` | W38.1.2, W38.5, W38.6 |
| `src/components/footer/Footer.tsx` | W38.1.2, W38.5, W38.6 |
| `src/components/ui/aero-hero-2.tsx` | W38.1.2, W38.5 |
| `src/components/about/AboutUsScroll.tsx` | W38.1.2, W38.2.2 |
| `src/components/events/UpcomingEvents.tsx` | W38.1.2, W38.2.2 |

---

## Working agreements

1. **One branch per spec**, using the branch name in the spec's metadata table
   (e.g. `w38-3-2-board-card`).
2. **One PR per spec**, titled `W38.x.y — <short description>`. Link the spec
   file in the PR description.
3. **Update the spec file** in your PR: `In Progress` when you start,
   `In Review` when the PR opens, `Completed` when it merges. Put your name in
   **Assigned Developers**.
4. **Pairing:** if you pair, put both names in **Assigned Developers** and note
   who drove.
5. **Stay inside your spec's "Files You'll Touch" list.** If you think something
   else needs fixing, add it to `features_TODO.md` instead.
6. **Screenshots are part of the PR.** Most specs ask for before/after shots at
   375px, 768px and 1440px — the reviewer will look for them.
7. **`npm run build` and `npm run lint` must pass** before you open a PR.
   TypeScript errors are not "just warnings" here.

## Running the project

```bash
npm install
npm run dev              # Vite dev server
npm run build            # tsc + vite build — must pass before every PR
npm run lint             # must pass before every PR
npm run preview          # serve the built dist/ locally
npm run extract-posters  # regenerate video poster frames (W38.4.2 context)
```

The site deploys to GitHub Pages under `/tsa-website/`. In `.tsx` files, build
asset URLs from `import.meta.env.BASE_URL` — a leading `/` works locally and
404s in production. `index.html` is the exception: Vite rewrites root-relative
paths there at build time. See the repo README's "Referencing assets" section.
