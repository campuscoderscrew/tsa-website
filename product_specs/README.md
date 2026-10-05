# TSA Website — Product Specs

This folder is the work queue for the TSA website. Each spec is a self-contained
unit of work sized at **about one hour**. Bigger pieces of work are split into a
chain (`W38.1.1 → W38.1.2 → W38.1.3`) so nobody is holding a four-hour task.

## How this works

- Specs are grouped by week. `W41` = ISO week 41 (week of 2026-10-05).
- A spec tells you **what** to build and **why**. It does not give you the code.
  Figuring out the implementation is the point — that's the part you're here to
  learn. Hints are included where a spec touches something non-obvious.
- Every spec has an **Acceptance Criteria** list. Your PR is done when every box
  is checked, not when the code compiles.

## Picking up a spec

1. Find your name in the **Assigned Developers** field (or ask the lead to
   assign you at standup).
2. Check the **Depends On** field. If the spec it depends on is not `Completed`,
   talk to that developer before you start — you may be about to build on top of
   something that's still moving.
3. Edit the spec file: set **Status** to `In Progress` and put your name in
   **Assigned Developers**. Commit that change on its own so the board stays
   accurate.
4. Branch off `main` using the branch name in the spec.
5. Open a PR titled `W41.x.y — <short description>` (carried specs keep their W38 ID). Link the spec file in the
   description.
6. When the PR is merged, set **Status** to `Completed`.

## Status values

| Status | Meaning |
| --- | --- |
| `TODO` | Nobody has started. Up for grabs. |
| `In Progress` | Someone is actively working on it — their name is in Assigned Developers. |
| `Blocked` | Started, but waiting on another spec or a decision. Say what it's waiting on. |
| `In Review` | PR is open and waiting for review. |
| `Completed` | Merged to `main`. |

## Working in parallel without stepping on each other

Specs are grouped into **tracks**, and tracks are deliberately assigned to
different files. Stay inside the files listed in your spec's **Files You'll
Touch** and merge conflicts mostly disappear.

The one file every track reads is `src/index.css`. Each week's README names
the track that owns it (W38: Track A; W41: Track B). If you need a new token,
**ask the owning track to add it** rather than adding it yourself — two people
adding tokens to the same block is the most likely conflict in any week.

Pull `main` before you start and again before you open your PR.

---

## Week 41 — current

Four developers, four features, ~3 hours each. Full plan, W38 assessment,
dependency graph and file ownership: **[`W41/README.md`](./W41/README.md)**.

| Feature | Track | Specs | Depends on |
| --- | --- | --- | --- |
| Feature 1 — Board Member Showcase *(carried)* | A | [W38.3.1](./W38/W38.3.1.md) → [W38.3.2](./W38/W38.3.2.md) → [W38.3.3](./W38/W38.3.3.md) | W41.0 |
| Feature 2 — Brand & Build Hygiene | B | [W41.2.1](./W41/W41.2.1.md) → [W41.2.2](./W41/W41.2.2.md) → [W41.2.3](./W41/W41.2.3.md) | W41.2.3 waits on W41.3.1 |
| Feature 3 — Events Foundation *(new)* | C | [W41.3.1](./W41/W41.3.1.md) → [W41.3.2](./W41/W41.3.2.md) → [W41.3.3](./W41/W41.3.3.md) | W41.0 |
| Feature 4 — Gallery & Contact | D | [W38.6](./W38/W38.6.md), [W38.4.2](./W38/W38.4.2.md) → [W41.4.1](./W41/W41.4.1.md) | — |

Carried W38 specs keep their IDs and branch names, and end with a **W41
addendum** — read it first.

---

## Week 38 — closed

W38 ended with 4 of 12 specs merged, 3 in unmerged branches (landed by the lead
in W41.0) and 5 carried into W41. Assessment in [`W41/README.md`](./W41/README.md).

### Week 38 plan (as written)

Three features were planned. Roughly 12 hours of work across 6 developers.

### Feature 1 — Brand Identity System

The site currently uses default shadcn greyscale tokens with brand colors
hardcoded as one-off hex values scattered across eight files. This feature gives
the site a real design system and a Thai visual vocabulary.

| Spec | Title | Track | Est. | Depends on | Status |
| --- | --- | --- | --- | --- | --- |
| [W38.1.1](./W38/W38.1.1.md) | Define the TSA color token set | A | 1h | — | TODO |
| [W38.1.2](./W38/W38.1.2.md) | Migrate hardcoded hex colors to tokens | A | 1h | W38.1.1 | TODO |
| [W38.1.3](./W38/W38.1.3.md) | Add a display typeface and type scale | A | 1h | W38.1.1 | TODO |
| [W38.2.1](./W38/W38.2.1.md) | Build the Thai ornament component kit | B | 1h | — | TODO |
| [W38.2.2](./W38/W38.2.2.md) | Apply ornaments to section headers | B | 1h | W38.2.1 | TODO |
| [W38.5](./W38/W38.5.md) | Transparent logo, favicon set, and social preview | E | 1h | — | TODO |

### Feature 2 — Board Member Showcase

TSA asked for a board member gallery. We have 14 photos and nothing else — no
names, no roles. Their Instagram board cards show name, role, major, and a few
fun facts. This feature closes that gap.

| Spec | Title | Track | Est. | Depends on | Status |
| --- | --- | --- | --- | --- | --- |
| [W38.3.1](./W38/W38.3.1.md) | Create the board member data model | C | 1h | — | TODO |
| [W38.3.2](./W38/W38.3.2.md) | Redesign the board card with name and role | C | 1h | W38.3.1 | TODO |
| [W38.3.3](./W38/W38.3.3.md) | Add the board member detail overlay | C | 1h | W38.3.2 | TODO |

### Feature 3 — Gallery and Contact Polish

The gallery page is a bare dark grid that looks like it belongs to a different
website, and the footer ships placeholder contact details.

| Spec | Title | Track | Est. | Depends on | Status |
| --- | --- | --- | --- | --- | --- |
| [W38.4.1](./W38/W38.4.1.md) | Rethemed gallery page | D | 1h | W38.1.1 | TODO |
| [W38.4.2](./W38/W38.4.2.md) | Gallery captions, alt text, and grouping | D | 1h | W38.4.1 | TODO |
| [W38.6](./W38/W38.6.md) | Real contact details and social links | F | 1h | — | TODO |

### Suggested allocation

Six developers, 1–5 hours each. Aim for 3–4 specs in flight at any moment.

| Unit | Suggested composition | Specs | Hours |
| --- | --- | --- | --- |
| Track A | Pair — this one sets conventions everyone else inherits, so two heads help | W38.1.1 → W38.1.2 → W38.1.3 | 3 |
| Track B | Solo — self-contained, mostly new files | W38.2.1 → W38.2.2 | 2 |
| Track C | Pair — biggest chain, and W38.3.3 is the fiddliest interaction work | W38.3.1 → W38.3.2 → W38.3.3 | 3 |
| Track D | Solo | W38.4.1 → W38.4.2 | 2 |
| Track E | Solo — good for whoever has the least time this week | W38.5 | 1 |
| Track F | Solo — good for whoever has the least time this week | W38.6 | 1 |

**Start order matters.** W38.1.1 unblocks Track A's chain and W38.4.1. Whoever
takes Track A should land it first; everyone else can start immediately.

---

Features that still need specs are listed in
[`features_TODO.md`](./features_TODO.md).

The spec format lives in [`TEMPLATE.md`](./TEMPLATE.md).
