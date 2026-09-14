# W__.__ — <Short title>

| Field | Value |
| --- | --- |
| **Spec ID** | W__.__ |
| **Feature** | <which feature this belongs to> |
| **Track** | <A–F — tracks are assigned to different files so work can run in parallel> |
| **Status** | TODO |
| **Assigned Developers** | _Unassigned_ |
| **Pairing** | <Solo / Pair — and why> |
| **Estimated Time** | 1 hour |
| **Depends On** | <spec ID, or —> |
| **Blocks** | <spec IDs that can't start until this lands, or —> |
| **Branch** | `w__-__-<slug>` |

---

## Objective

One or two sentences. What is different about the website after this lands, and
why does TSA care? Written so a reviewer can tell whether it was achieved
without reading the diff.

## Background

Why this work exists. What's in the codebase today, what's wrong with it, and
what TSA asked for. Reference the brand brief or their Instagram where relevant.

## Files You'll Touch

```
path/to/file.tsx      modify
path/to/new-file.tsx  create
```

Anything outside this list is another track's territory — if you need a change
there, ask in the group chat rather than editing it.

## Specification

Numbered, concrete requirements. What to change and how to approach it. Not the
code itself — the developer writes that.

## Acceptance Criteria

- [ ] Checkable statements. Every box ticked = the spec is done.
- [ ] Include at least one that covers mobile (375px) and one that covers
      keyboard or screen-reader behavior where relevant.

## Out of Scope

What a reviewer should *not* ask for in this PR, so the scope stays at one hour.

## Hints

Pointers for the non-obvious parts. Docs links, the name of the API to look up,
a gotcha specific to this codebase. Not a solution.

## Definition of Done

- [ ] `npm run build` passes with no new TypeScript errors
- [ ] `npm run lint` passes with no new warnings
- [ ] Checked at 375px, 768px and 1440px
- [ ] Checked with `prefers-reduced-motion: reduce` if the change animates
- [ ] PR opened, titled `W__.__ — <short title>`, spec file linked in the body
- [ ] Spec **Status** updated to `In Review`, then `Completed` on merge
