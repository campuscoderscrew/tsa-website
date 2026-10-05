# W41 — Sprint Overview

**Week of:** 2026-10-05
**Scope:** Static front end only — Vite + React + Tailwind v4, deployed to GitHub Pages under `/tsa-website/`. No backend.
**Developers:** 4, working in parallel on four disjoint features
**Created:** 2026-10-05

---

## Read this first — where W38 left us

W38 planned 12 specs across six tracks. **4 merged, 3 are sitting in unmerged
branches, 5 were never started.** Every spec file on `main` still says `TODO`,
so the board was out of date all week. The table below is what the code shows,
checked against each spec's acceptance criteria on 2026-10-05.

| Spec | Title | Where it is | Verdict |
| --- | --- | --- | --- |
| W38.1.1 | Color token set | Merged (#6) | **Done.** All 11 `--tsa-*` tokens, 6 surfaces, `@theme` registration, palette docs. |
| W38.1.2 | Hex → tokens | Branch `w38-1-2-hex-to-tokens`, not merged | **Mostly done.** `App.css` deleted, `TSA_COLORS` module added, template purple gone. Still left: all 14 board `tagColor` hexes, the hex string comparison that picks the name-tag text color, both board blob fills, the Events SVG fill, the gallery transition stroke, and the gallery Home button. |
| W38.1.3 | Display typeface | Branch `w38-1-3-display-type`, not merged | **Mostly done.** Picked Fraunces; `--font-display` / `--font-body` exist; Epilogue no longer loaded. Still left: a dead `font-epilogue` class in Events; the heading fallback stack is sans, not serif; only 400/700 are loaded, but headings ask for 600 and 800; the `-0.06em` / `tracking-tighter` tracking was never retuned for a serif. |
| W38.2.1 | Thai ornament kit | Merged (#4) | **Done.** Three components, `currentColor` only, `aria-hidden`, no hex. |
| W38.2.2 | Apply ornaments | Branch `w38-2-2-apply-ornaments`, not merged | **Done, but stale.** Written before tokens existed, so all five ornament colors are raw hex (`text-[#9B1B30]`). **It conflicts with W38.1.3** in `UpcomingEvents.tsx`. The board heading's `max-w-[4.15em]` was tuned for Manrope and will need a recheck in Fraunces. |
| W38.3.1–3.3 | Board showcase | — | **Not started.** TSA's #1 request. Carried to W41. |
| W38.4.1 | Gallery retheme | Merged (#3) | **Done.** Navy surface, real `<h1>`. Uses raw hex because it landed before tokens. |
| W38.4.2 | Gallery captions / alt | — | **Not started.** Every gallery image is still `alt=""`. Carried to W41. |
| W38.5 | Logo, favicons, OG | Merged (#8) | **Partly done.** Transparent logo and OG tags shipped. But the favicon `<link>` points at `/favicon.png`, **which does not exist** (the files are `favicon.svg` and `favicon-32.png`). `apple-touch-icon.png` is never linked. Root `thai.jpg` was not deleted. `logo.png` is 428 KB at 1000×1000 but is displayed at ≤72px. |
| W38.6 | Real contact details | — | **Not started.** The footer still says `hello@tsa.club` and links to platform homepages. Carried to W41. |

### Two problems bigger than any one spec

1. **The site has never deployed.** The repo README describes
   `.github/workflows/deploy.yml`, but that file was never committed, so the
   live URL has been a GitHub Pages 404. **Fixed 2026-10-05:** the workflow is
   now in the repo. It builds on every push to `main`.
2. **`npm run lint` fails on `main` (8 errors).** Every W38 spec's Definition of
   Done says lint must pass, so no W38 PR could have honestly ticked that box.
   - 7 of the errors are a real bug: `useTransform` is called inside a `.map()`
     in the events carousel (`rules-of-hooks`).
   - 1 is a `react-refresh` error in `GalleryTransitionProvider.tsx`.

   W41.3.1 and W41.2.3 fix them. **Until those land, the rule is "no *new*
   lint errors."** Run `npx eslint <your files>` rather than trusting the total.

### What to change in how we work

- **Update the spec Status when you start**, not at the end. The table above
  had to be reconstructed from git.
- **Open the PR the day the work is done.** Three finished branches sat
  unmerged for over a week and drifted into conflicts.
- **Use the tokens.** W38.2.2 and W38.4.1 hand-typed hex because they started
  before W38.1.1 merged. That was expected under the soft dependency. Starting
  W41, tokens exist on `main`, so a raw brand hex in a PR is a review blocker.

---

## Prerequisite — lead work before Monday's standup (W41.0)

The W41 specs are written against `main` **after** the three open W38 branches
land. Brennen does this, in this order:

1. Commit `.github/workflows/deploy.yml` and push to `main`. Confirm the
   Actions run is green and the site loads at
   <https://campuscoderscrew.github.io/tsa-website/>.
2. Merge `w38-1-2-hex-to-tokens` (it already has `main` merged in).
3. Merge `w38-1-3-display-type` (no conflicts after step 2).
4. Merge `w38-2-2-apply-ornaments`. There is **one conflict**, in
   `UpcomingEvents.tsx` around line 220. Keep **both** changes: the
   `LaiThaiDivider` line from W38.2.2, then the `<h2>` with `font-display`
   from W38.1.3. (Verified: that resolution builds clean.)
5. Set W38.1.1, 1.2, 1.3, 2.1, 2.2, 4.1 and 5 to `Completed` in their spec files.
   The leftovers listed above are now tracked in W41 specs.

Everything left over from those merges is assigned below. Nobody needs to
re-open a W38 PR.

---

## What we are building this week

Four features, one developer each, about 3 hours apiece. Every track owns its
own files (see [Shared files](#shared-files--coordinate-before-you-push)).

| Feature | Owner | Specs | Summary |
| --- | --- | --- | --- |
| **Feature 1 — Board Member Showcase** *(carried)* | Dev 1 · Track A | W38.3.1 → W38.3.2 → W38.3.3 | Turn 14 anonymous photos into cards with name, role, major and fun facts. Also clears every W38 leftover in the board section. |
| **Feature 2 — Brand & Build Hygiene** *(cleanup)* | Dev 2 · Track B | W41.2.1 → W41.2.2 → W41.2.3 | Finish the type pass, fix the broken favicon and other `<head>` gaps, delete dead assets, make lint pass, and gate every PR on lint and build in CI. |
| **Feature 3 — Events Foundation** *(new)* | Dev 3 · Track C | W41.3.1 → W41.3.2 → W41.3.3 | Fix the hooks bug in the carousel, move events into a typed data file with real dates, and make the carousel keyboard and screen-reader accessible. This is the first step toward the calendar TSA asked for. |
| **Feature 4 — Gallery & Contact** *(carried + new)* | Dev 4 · Track D | W38.6, W38.4.2 → W41.4.1 | Real contact links, gallery alt text and captions, then a full-screen lightbox. |

Carried specs keep their W38 IDs and branch names. Each one now ends with a
**W41 addendum** listing what changed since it was written. **Read the addendum
before you start.** It overrides the original spec where they disagree.

### Overall proficiency per feature

| Feature | FE | BE | DevOps | Hardest spec |
| --- | :-: | :-: | :-: | --- |
| **Feature 1 — Board Showcase** (3 specs) | 3.0 | 1.3 | 1.3 | FE 4 (W38.3.3) |
| **Feature 2 — Brand & Build Hygiene** (3 specs) | 2.3 | 1.0 | 2.7 | DevOps 3 (W41.2.2, W41.2.3) |
| **Feature 3 — Events Foundation** (3 specs) | 3.3 | 1.7 | 1.0 | FE 4 (W41.3.3) |
| **Feature 4 — Gallery & Contact** (3 specs) | 2.7 | 1.3 | 1.0 | FE 4 (W41.4.1) |

In short:

- **Feature 2** is the place for someone who wants DevOps practice and is
  comfortable in config files.
- **Features 1 and 3** each finish on a hard (FE 4) accessibility spec. Give
  them to your two strongest front-end developers.
- **Feature 4** starts with the easiest spec in the repo (W38.6), so it suits a
  newer developer. Its last spec (the lightbox) is FE 4, so plan a pairing
  session for it.

---

## Dependency graph

```
START HERE — one spec per developer on day 1
│
├── W38.3.1 ──► W38.3.2 ──► W38.3.3                   Dev 1 · Track A
│
├── W41.2.1 ──► W41.2.2 ──► W41.2.3                   Dev 2 · Track B
│                              ▲
│                              │ hard: lint can't be green until the hooks bug is fixed
├── W41.3.1 ───────────────────┘
│      └──► W41.3.2 ──► W41.3.3                       Dev 3 · Track C
│
└── W38.6 ;  W38.4.2 ──► W41.4.1                      Dev 4 · Track D
            (W38.6 and W38.4.2 are independent — either order)
```

**Available on day 1:** W38.3.1, W41.2.1, W41.3.1, W38.6, W38.4.2

**Land W41.3.1 early.** It is the only cross-track dependency this week.
W41.2.3 (CI lint gate) cannot be merged until W41.3.1 is on `main`.

---

## Spec index

| Spec | Title | Track | Status | Assigned | FE | BE | DevOps | Depends on |
| --- | --- | :-: | --- | --- | :-: | :-: | :-: | --- |
| [W38.3.1](../W38/W38.3.1.md) | Create the board member data model *(carried)* | A | TODO | TBD | 2 | 2 | 2 | W41.0 |
| [W38.3.2](../W38/W38.3.2.md) | Redesign the board card with name and role *(carried)* | A | TODO | TBD | 3 | 1 | 1 | W38.3.1 |
| [W38.3.3](../W38/W38.3.3.md) | Add the board member detail overlay *(carried)* | A | TODO | TBD | 4 | 1 | 1 | W38.3.2 |
| [W41.2.1](./W41.2.1.md) | Finish the brand pass: display type and leftover hex | B | TODO | TBD | 3 | 1 | 1 | W41.0 |
| [W41.2.2](./W41.2.2.md) | Fix the `<head>`: favicons, metadata, dead assets | B | TODO | TBD | 2 | 1 | 3 | W41.2.1 (same file) |
| [W41.2.3](./W41.2.3.md) | Make lint pass and gate PRs in CI | B | TODO | TBD | 2 | 1 | 3 | W41.3.1 |
| [W41.3.1](./W41.3.1.md) | Fix the hooks-in-a-loop bug in the events carousel | C | TODO | TBD | 3 | 1 | 1 | W41.0 |
| [W41.3.2](./W41.3.2.md) | Events data model with real dates | C | TODO | TBD | 3 | 3 | 1 | W41.3.1 |
| [W41.3.3](./W41.3.3.md) | Keyboard and screen-reader access for the events carousel | C | TODO | TBD | 4 | 1 | 1 | W41.3.2 |
| [W38.6](../W38/W38.6.md) | Real contact details and social links *(carried)* | D | TODO | TBD | 1 | 1 | 1 | — |
| [W38.4.2](../W38/W38.4.2.md) | Gallery captions, alt text, and grouping *(carried)* | D | TODO | TBD | 3 | 2 | 1 | W41.0 |
| [W41.4.1](./W41.4.1.md) | Gallery lightbox | D | TODO | TBD | 4 | 1 | 1 | W38.4.2 |

**Total:** 12 specs ≈ 12 developer-hours, 3 per developer.

---

## Shared files — coordinate before you push

The tracks were drawn so that almost no file has two owners. These are the
exceptions:

| File | Owner | Also touched by | What the other track may change |
| --- | --- | --- | --- |
| `src/index.css` | **Track B** | anyone needing a token | Nothing. Ask Track B to add the token. |
| `src/components/board/BoardMembersSection.tsx` | **Track A** | W41.2.3 | One import line (`useGalleryTransition` moves) |
| `src/pages/GalleryPage.tsx` | **Track D** | W41.2.3 | One import line (`useGalleryTransition` moves) |
| `src/components/staggered-menu/StaggeredMenu.tsx` | **Track B** | — | — |
| `src/components/events/UpcomingEvents.tsx` | **Track C** | — | — |
| `src/pages/HomePage.tsx` | **Track D** (`socialItems`) | — | Nobody else should need it this week |
| `index.html` | **Track B** | — | — |
| `.github/workflows/*` | **Track B** | — | — |

**W41.2.3 moves an import that three other files use.** Track B: land it last
in your chain, and post in the group chat before you push so Tracks A and D
can rebase. It's a one-line conflict at most.

---

## Working agreements

Same as W38, plus the first two items, which are new:

1. **Status in the spec file is the source of truth.** Set it to `In Progress`
   in your first commit, not your last.
2. **Brand colors come from tokens.** A raw brand hex in a component is a
   review blocker. The only exception is `src/lib/brandColors.ts`, which exists
   for the GSAP props that cannot read CSS variables.
3. One branch per spec, using the branch name in the spec. One PR per spec,
   titled `W41.x.y — <short description>`, with the spec linked. Carried specs
   keep their W38 branch name and title.
4. Stay inside your spec's **Files You'll Touch**. If something else is
   broken, add it to `features_TODO.md`.
5. Include screenshots at 375px, 768px and 1440px for anything visual.
6. `npm run build` must pass. Your PR must add no new lint errors. Once
   W41.2.3 merges, CI enforces both.

## Running the project

```bash
npm install
npm run dev              # Vite dev server
npm run build            # tsc + vite build + 404.html copy — must pass before every PR
npm run lint             # must not get worse; must be clean once W41.2.3 lands
npm run preview          # serve the built dist/ locally
```

Merging to `main` deploys automatically (`.github/workflows/deploy.yml`).
**Check the live site after your PR merges.** Asset paths that work in
`npm run dev` can 404 under `/tsa-website/`. See the repo README's
"Referencing assets" section.
