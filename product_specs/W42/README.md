# W42 — Sprint Overview

**Week of:** 2026-10-12
**Scope:** Static front end only — Vite + React + Tailwind v4, deployed to GitHub Pages under `/tsa-website/`. No backend.
**Developers:** 5, working in parallel on five disjoint features
**Created:** 2026-10-14

---

## Read this first

W42 is written against `main` **with the W41 work merged**. Five W41 specs are
direct dependencies this week:

| W42 spec | Needs on `main` | Why |
| --- | --- | --- |
| W42.1.1 | W41.3.2 | Reads events through the `events.ts` helpers |
| W42.2.1, W42.3.2 | W38.3.1 | Reads `src/data/board.ts` |
| W42.2.3 | W41.2.2 | Sits next to `check-assets` in the build script |
| W42.4.1 | W38.6 | The join page reuses the real contact links |
| W42.5.3 | W41.5.3 | Adds routes to `lighthouserc.json` (skip that step if it hasn't merged) |

**At Monday's standup, check each of these is `Completed`.** If one isn't, the
W42 spec that needs it is `Blocked`. Don't start it on top of an unmerged
branch. Every track except Track A has at least one spec it can start without
W41 (see the dependency graph), so nobody is idle while a W41 PR lands.

Every feature this week comes from `features_TODO.md`. None of them repeats work
already done or specced in W38 or W41; the last section of this README maps each
one to its backlog entry.

---

## What we are building this week

Five features, one developer each, about 3 hours apiece. Every track owns its
own files (see [Shared files](#shared-files--coordinate-before-you-push)).

| Feature | Owner | Specs | Summary |
| --- | --- | --- | --- |
| **Feature 1 — Events Calendar & Archive** | Dev 1 · Track A | W42.1.1 → W42.1.2 → W42.1.3 | An `/events` page with an upcoming agenda, a past-events archive by school year, and a month calendar. TSA asked for "a calendar" and an "archive of previous events." |
| **Feature 2 — Board Archive** | Dev 2 · Track B | W42.2.1 → (W42.2.2, W42.2.3) | Multiple board years in the data, a `/board` page with a term switcher, and a build check that catches data typos before they ship. TSA's #2 request. |
| **Feature 3 — Real Content** | Dev 3 · Track C | W42.3.1, W42.3.2, W42.3.3 (any order) | Replace the About section's visible "Placeholder" text, swap stock-photo strangers in the hero for real members, and show the clubs TSA partners with. |
| **Feature 4 — Join TSA** | Dev 4 · Track D | W42.4.1 → (W42.4.2, W42.4.3) | A `/join` page for new members, an interest sign-up the club owns, and an FAQ. |
| **Feature 5 — Site-wide Accessibility** | Dev 5 · Track E | W42.5.1 → W42.5.2 → W42.5.3 | Skip link, landmarks and focus on route change; an accessible slide-out menu; reduced motion and one focus ring everywhere. |

### Overall proficiency per feature

The average of each feature's spec scores (see the [spec index](#spec-index) and
[proficiency scale](#proficiency-scale) below). Use it to pick a feature that
fits; the **hardest spec** column shows where a feature needs a pair.

| Feature | FE | BE | DevOps | Hardest spec |
| --- | :-: | :-: | :-: | --- |
| **Feature 1 — Events Calendar & Archive** (3 specs) | 3.3 | 2.3 | 1.3 | FE 4 (W42.1.3) |
| **Feature 2 — Board Archive** (3 specs) | 2.0 | 2.0 | 2.0 | DevOps 3 (W42.2.3) · BE 3 (W42.2.1) |
| **Feature 3 — Real Content** (3 specs) | 2.0 | 1.3 | 1.3 | FE 2 (all) — the hard part is getting answers from the club |
| **Feature 4 — Join TSA** (3 specs) | 2.7 | 2.0 | 1.7 | FE 3 · BE 3 (W42.4.2) |
| **Feature 5 — Site-wide Accessibility** (3 specs) | 3.3 | 1.0 | 1.0 | FE 4 (W42.5.2) |

In short:

- **Features 1 and 5** are the most front-end heavy and each has an FE 4 spec.
  Give them to your two strongest front-end developers, and plan a pairing
  session for W42.1.3 and W42.5.2.
- **Feature 2** is the balanced one: a little of everything, with a real DevOps
  piece at the end. Good for someone who wants to touch the build.
- **Feature 3** is the easiest code this week and the best fit for a newer
  developer. Its real difficulty is communication: all three specs need answers
  from the club, so **send those messages on day 1**.
- **Feature 4** sits in the middle. W42.4.2 involves a privacy decision, so pair
  for it.

### Waiting on the club

Seven of the fifteen specs ask TSA something. Every one of them is written so
it can ship an honest fallback if the answer doesn't arrive this week, but the
fallback is always the weaker version. **One combined message from the lead on
Monday is better than seven separate ones from seven developers.** The questions:

| Spec | Question |
| --- | --- |
| W42.2.1 | Names, roles, majors and photos of previous boards, by year, and consent to list them |
| W42.3.1 | Approval of the drafted About copy |
| W42.3.2 | Real members in the hero, or remove the avatars? |
| W42.3.3 | Which partner orgs to list, their full names and links |
| W42.4.1 | GBM time and place, dues, the one next step for a new member |
| W42.4.2 | Form or link? Which club account owns submissions? |
| W42.4.3 | The questions new members ask most |

These overlap with open questions 3, 4, 7 and 8 in `features_TODO.md`.

---

## Dependency graph

Specs with no dependencies can be picked up immediately. Chained specs must be
done in order — do not start a spec whose dependency is still `TODO`. A dotted
line is a **soft** dependency: use the other spec's work if it has merged, and
leave a `TODO` to switch over if it hasn't. Don't block on it.

```
START HERE
│
├── W42.1.1 ──► W42.1.2 ──► W42.1.3                    Dev 1 · Track A   (needs W41.3.2)
│
├── W42.2.1 ──┬──► W42.2.2                             Dev 2 · Track B   (needs W38.3.1)
│             └──► W42.2.3                                               (2.3 also needs W41.2.2)
│             ┊
│             ┊ soft: current-term helper
│             ▼
├── W42.3.1 ;  W42.3.2 ;  W42.3.3                      Dev 3 · Track C   (any order)
│
├── W42.4.1 ──┬──► W42.4.2                             Dev 4 · Track D   (needs W38.6)
│             └──► W42.4.3                                               (2 and 3: either order, one at a time)
│
└── W42.5.1 ──► W42.5.2 ──► W42.5.3                    Dev 5 · Track E
        ┊
        ┊ convention: every new page has <main id="main-content">
        ▼
     W42.1.1, W42.2.1, W42.4.1
```

**Available on day 1:** W42.1.1, W42.2.1, W42.3.1, W42.3.2, W42.3.3, W42.4.1, W42.5.1

**Land W42.5.1 early.** Tracks A, B and D each add a route to `App.tsx`, which
Track E owns. If the skip link and route-focus hook are in first, everyone else
adds one `<Route>` line on top and there's nothing to untangle.

---

## Spec index

| Spec | Title | Track | Status | Assigned | FE | BE | DevOps | Depends on |
| --- | --- | :-: | --- | --- | :-: | :-: | :-: | --- |
| [W42.1.1](./W42.1.1.md) | Events page with an upcoming-events agenda | A | TODO | TBD | 3 | 2 | 2 | W41.3.2 |
| [W42.1.2](./W42.1.2.md) | Past events archive, grouped by school year | A | TODO | TBD | 3 | 3 | 1 | W42.1.1 |
| [W42.1.3](./W42.1.3.md) | Month calendar view | A | TODO | TBD | 4 | 2 | 1 | W42.1.2 |
| [W42.2.1](./W42.2.1.md) | Board terms and a `/board` page | B | TODO | TBD | 2 | 3 | 2 | W38.3.1 |
| [W42.2.2](./W42.2.2.md) | Term switcher and archive cards | B | TODO | TBD | 3 | 1 | 1 | W42.2.1 |
| [W42.2.3](./W42.2.3.md) | Validate the site's data files in the build | B | TODO | TBD | 1 | 2 | 3 | W42.2.1, W41.2.2 |
| [W42.3.1](./W42.3.1.md) | Replace the About section's placeholder copy | C | TODO | TBD | 2 | 1 | 1 | — |
| [W42.3.2](./W42.3.2.md) | Real members in the hero, not stock photos | C | TODO | TBD | 2 | 1 | 2 | W38.3.1 (soft: W42.2.1) |
| [W42.3.3](./W42.3.3.md) | Partner organizations strip | C | TODO | TBD | 2 | 2 | 1 | — |
| [W42.4.1](./W42.4.1.md) | A `/join` page | D | TODO | TBD | 2 | 2 | 2 | W38.6 |
| [W42.4.2](./W42.4.2.md) | Interest sign-up on a static site | D | TODO | TBD | 3 | 3 | 2 | W42.4.1 |
| [W42.4.3](./W42.4.3.md) | Join FAQ with linkable answers | D | TODO | TBD | 3 | 1 | 1 | W42.4.1 |
| [W42.5.1](./W42.5.1.md) | Skip link, landmarks and focus on route change | E | TODO | TBD | 3 | 1 | 1 | — |
| [W42.5.2](./W42.5.2.md) | Make the slide-out menu keyboard and screen-reader friendly | E | TODO | TBD | 4 | 1 | 1 | W42.5.1 |
| [W42.5.3](./W42.5.3.md) | Reduced motion and one focus ring, site-wide | E | TODO | TBD | 3 | 1 | 1 | W42.5.2 |

**Total:** 15 specs ≈ 15 developer-hours. Three per developer.

### Why the scores land where they do

- **Back End rises where a data shape or a data decision is designed:** the
  school-year rule (W42.1.2), the current-term rule (W42.2.1), and where form
  submissions go and who owns them (W42.4.2).
- **DevOps rises where deploys can break:** new routes that must survive a hard
  refresh under `/tsa-website/` (W42.1.1, W42.2.1, W42.4.1), new image assets
  under the case-sensitive filesystem (W42.3.2), and a new step in the build
  (W42.2.3).
- **The two 4s** are a calendar grid that works with a keyboard and screen
  reader (W42.1.3) and a modal menu with focus management on top of an existing
  GSAP animation (W42.5.2).
- **W42.3.3 and W42.3.1 are the entry points** — good first specs for someone
  new to the repo.

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

The tracks were drawn so that almost no file has two owners. These are the
exceptions. If your spec is on a row below, pull `main` before you start and
again before you open your PR, and keep your change to the lines described.

| File | Owner | Also touched by | What the other track may change |
| --- | --- | --- | --- |
| `src/App.tsx` | **Track E** | W42.1.1, W42.2.1, W42.4.1 | One `<Route>` line each |
| `src/pages/HomePage.tsx` | **Track D** (`menuItems`) | W42.1.1, W42.3.3, W42.5.1 | One menu item (A); one line rendering the partner strip (C); the `<main>` wrapper and page title (E) |
| `src/index.css` | **Track E** | anyone needing a token | Nothing. Ask Track E to add the token. |
| `index.html` | **Track E** | — | — |
| `src/data/board.ts` | **Track B** | W42.3.2 | Nothing. Import from it; don't edit it. |
| `src/data/events.ts` | **Track A** | W42.2.3 | Nothing. The check script reads it. |
| `src/data/gallery.ts` | nobody this week | W42.2.3 | Nothing. The check script reads it. |
| `package.json` | **Track B** (W42.2.3) | — | — |
| `lighthouserc.json` | **Track E** (W42.5.3) | — | — |
| `features_TODO.md` | everyone | everyone | Append only, under the right heading. Pull before you edit. |

---

## Page conventions — every new page follows these

Three new routes arrive this week (`/events`, `/board`, `/join`). For the skip
link (W42.5.1), route-change focus (W42.5.1) and Lighthouse (W42.5.3) to work
on all of them, each page:

1. Wraps its content in `<main id="main-content" tabIndex={-1}>`. The menu and
   footer stay outside it.
2. Has exactly **one** `<h1>`, and heading levels below it don't skip.
3. Sets a document title of the form `<Page> · Thai Student Association at UMD`.
4. Uses the brand header pattern: eyebrow label, `LaiThaiDivider`, heading.
5. Links to other routes through the router (`<Link to="/events">`) or, where a
   plain `<a>` is unavoidable, through the base path
   (`` `${import.meta.env.BASE_URL}events` ``). A bare `href="/events"` works in
   `npm run dev` and **404s on GitHub Pages**.
6. Is checked with a direct load and a hard refresh of
   `/tsa-website/<route>` on `npm run preview`. The `404.html` fallback makes
   that work, but only if the route is registered.

Open Graph tags can't vary per route on this site: crawlers don't run
JavaScript, so they only ever see `index.html`. Don't try to set them per page.

---

## Working agreements

Same as W41:

1. **Status in the spec file is the source of truth.** Set it to `In Progress`
   in your first commit, not your last.
2. **Brand colors come from tokens.** A raw brand hex in a component is a
   review blocker. The only exception is `src/lib/brandColors.ts`, for the GSAP
   props that cannot read CSS variables.
3. One branch per spec, using the branch name in the spec. One PR per spec,
   titled `W42.x.y — <short title>`, with the spec linked.
4. **Check the PR's base branch is `main` before merging.**
5. Stay inside your spec's **Files You'll Touch**. If something else is broken,
   add it to `features_TODO.md`.
6. Screenshots at 375px, 768px and 1440px for anything visual.
7. `npm run build` and `npm run lint` must pass; CI enforces both (W41.2.3).

New this week:

8. **Never publish what the club hasn't confirmed.** Names, roles, dates,
   meeting times, partner names, dues. Ship the honest fallback and mark the
   gap with `// TODO: awaiting club`. A wrong fact about a real student or a real
   meeting on a public site is worse than a missing one.

## Running the project

```bash
npm install
npm run dev              # Vite dev server
npm run build            # tsc + checks + vite build + 404.html copy — must pass before every PR
npm run lint             # must pass before every PR
npm run preview          # serve the built dist/ locally — test new routes here, not in dev
```

Merging to `main` deploys automatically (`.github/workflows/deploy.yml`).
**Check the live site after your PR merges**, especially any new route.

---

## Where these features came from

Every W42 feature is an item from `features_TODO.md` that no W38 or W41 spec
covers.

| W42 feature | Backlog entry | Not to be confused with |
| --- | --- | --- |
| Feature 1 — Events Calendar & Archive | Priority 1: "Events calendar", "Archive of previous events" | W41.3.x built the data model and the home carousel, not a page |
| Feature 2 — Board Archive | Priority 1: "Archive of previous board members"; Priority 4: "Repo housekeeping" (data checks) | W38.3.x built the current board showcase; W41.2.2 checks code asset paths, not data files |
| Feature 3 — Real Content | Priority 2: "About section copy", "Hero avatar stack"; Priority 4: "Partner organization logos" | W38.6 fixed the footer contact details only |
| Feature 4 — Join TSA | Priority 1: "Join / membership flow" | W38.6 pointed the footer CTA at a contact link; this is the flow behind it |
| Feature 5 — Site-wide Accessibility | Priority 3: "Accessibility audit", "Mobile navigation polish" | W41.3.3, W38.3.3 and W41.4.1 fixed single components; this is the site-wide layer |
