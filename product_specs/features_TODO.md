# Features TODO — no specs written yet

Everything identified as needed for the TSA website that is **not** being worked
on in Week 38. Nothing here has a spec. Before a feature moves into a week, a
lead breaks it into ~1-hour specs in a `W__/` folder and links them from
[`README.md`](./README.md).

Ordered roughly by value to TSA. That order is a starting point for the
conversation, not a decision — argue with it at standup.

---

## Priority 1 — Explicitly requested by TSA, not yet built

These come straight off the club's intake form. Each is a feature they asked for
by name and the site currently does not have.

### Events calendar

> *Requested: "A calendar"*

No calendar exists. `UpcomingEvents` is a carousel of **three hardcoded events**
with invented dates (`APR 21`, `MAY 03`, `JUN 14`) and generic venues ("Campus
green", "Student union"). TSA's real calendar is rich and seasonal: Songkran in
April, Loy Krathong in November, GBMs through the semester, fundraisers,
mixers with other orgs.

Needs deciding before any spec: does the club maintain events in the repo, or
should the site read their Google Calendar? Repo-maintained means a developer
edits a file every time an event changes. A Google Calendar embed or API read
means the club updates it themselves and the site follows. The second is almost
certainly right, and it's an architecture decision, not a styling one.

Rough shape: month grid or agenda list, past vs upcoming, links to the Instagram
post for each event.

### Archive of previous board members

> *Requested: "Archive of Previous Board Members & Events"*

W38.3.1 adds a `term` field to the board data specifically so this is possible.
Needs a route (`/board/archive` or similar), a term selector, and — the hard part
— photos and names for previous boards, which someone has to collect from the
club.

### Archive of previous events

> *Requested: "Archive of Previous Board Members & Events"*

Same idea for events. Depends on the events data model existing first, so it
should follow the calendar work rather than lead it.

### Full event gallery with albums

> *Requested: "A gallery for all events"*

W38.4.2 adds event metadata to nine photos. The real ask is every event, grouped
into albums, with many photos each. Needs: a decision on where photos live (repo
vs Google Drive vs Instagram embeds), album routes, pagination or infinite
scroll, and image optimization — a hundred full-resolution phone photos will
destroy load time and blow past GitHub's repo size guidance.

### Lightbox / full-screen photo viewer

Natural companion to the gallery. Click a photo, see it large, arrow between
photos, Esc to close. Must be keyboard-navigable and must trap focus correctly —
this is a genuinely easy thing to build badly.

### Join / membership flow

The footer says "we're always welcoming new members" with nothing to click.
W38.6 points it at something real, but a proper flow — what a GBM is, when they
meet, what dues cost if any, a form — is a feature of its own.

A contact form needs a backend, which a static GitHub Pages site doesn't have.
Options: Formspree, Google Forms embed, or a `mailto:`. Worth resolving early
because it constrains the design.

---

## Priority 2 — Content that's currently fake

The site ships visible placeholder content. Each of these is small, and each one
is embarrassing if a club officer clicks through before it's fixed.

### About section copy

All four cards in `AboutUsScroll.tsx` contain literal placeholder text:
*"Placeholder text about cultural celebrations, food nights, and shared
traditions..."* — with the word "Placeholder" visible on the live site. The
headings ("Cultural Events", "Community", "Leadership", "Support") are fine; the
body copy needs writing with the club.

The section heading also reads "Built for culture, community, and impact." and
the eyebrow says "Our Services" — startup language for a student club. And the
subhead literally explains the scroll animation to the visitor ("each section
pins, then tilts and scales away as the next one arrives"), which is a developer
describing their own work.

**Small, high-value, and blocked on the club, not on engineering.**

### Hero avatar stack — currently stock photos of strangers

`aero-hero-2.tsx` renders four avatars pulled from **Unsplash URLs** — photographs
of random people who have nothing to do with TSA, presented next to the word
"Community" as though they're members.

This should be TSA members, or it should be removed. It's also an external
network dependency in the hero, so it's a performance issue too.

### Real event data

Tied to the calendar work above, but even without a calendar the three existing
events should have true names, dates and venues.

---

## Priority 3 — Quality, accessibility, and performance

### Accessibility audit

W38.3.2 and W38.4.2 fix alt text in two sections. A full pass is still needed:

- **No skip-to-content link** — keyboard users tab through the entire nav on every page
- Heading hierarchy — confirm one `h1` per page and no skipped levels
- Color contrast across every brand color combination (do this *after* W38.1.1 lands)
- Focus-visible styling on all interactive elements
- The `StaggeredMenu` slide-out: focus trap, Esc to close, `aria-expanded`
- The draggable events carousel — currently drag-only, with **no keyboard alternative at all**
- `prefers-reduced-motion` coverage across GSAP, Framer Motion, and the two CSS float animations in `index.css`

The events carousel is the most serious item: a keyboard user cannot reach the
second or third event by any means.

### Performance

- Three MP4s in `public/video/` ship uncompressed. Check sizes and transcode.
- Board photos and gallery images are unoptimized JPEGs. No responsive `srcset` anywhere.
- No modern image formats (WebP/AVIF).
- GSAP, Framer Motion **and** `motion` are all dependencies. `framer-motion` and `motion` are the same library under two names — consolidating could cut a chunk of bundle.
- `@gsap/react` is installed but `useGSAP` is never used; components use `gsap.context` directly.
- Run Lighthouse and set a baseline.

### SEO and metadata

W38.5 adds Open Graph tags. Still missing: `robots.txt`, `sitemap.xml`, structured
data (`Organization` / `Event` schema — valuable for a club that runs public
events), and a canonical URL.

### Dark mode — decide yes or no

`src/index.css` has a complete `.dark` token block and `@custom-variant dark`,
but nothing ever sets the `dark` class and there's no toggle. It's dead code
pretending to be a feature. Either build the toggle or delete the block. Leaving
it is the worst of the three.

### Mobile navigation polish

`StaggeredMenu` is 610 lines and the most complex component in the codebase.
Needs a review pass for touch targets, focus management, and behavior when
opened mid-scroll.

### Thai script support

If the site ever shows Thai text — event names in Thai, a bilingual tagline —
Latin webfonts have no Thai glyphs and the browser falls back to an unstyled
system font. **Noto Sans Thai** / **Noto Serif Thai** are the standard answer.
Deliberately not loaded in W38.1.3, since loading an unused font family is the
exact problem that spec removed. Revisit when there's actual Thai content.

### Per-page metadata

The site is effectively one page plus a gallery, so a single set of `<head>` tags
works today. Once there are more routes, titles and OG tags should vary per route.

---

## Priority 4 — Nice to have

### Partner organization logos

TSA collaborates constantly — NSA, MCA, KSA, VSA all appear in their event
posts. A partners strip would show the club is plugged into a wider community.

### Photo credits

Their photos are taken by club members. Crediting photographers is good practice
and good for club morale.

### Events countdown

A "next event in 12 days" element. Cheap, festive, and it makes the site feel
live rather than static.

### Alumni / past board hall of fame

TSA's board includes "Alumni Advisor" roles, so continuity matters to them.
Overlaps with the board archive.

### Newsletter or mailing list

Depends on whether the club wants to maintain one.

### Repo housekeeping

- `public/lotus_flower.png` is committed but imported nowhere. Either use it (Track B's ornament work may supersede it) or delete it.
- `src/assets/react.svg` and `public/vite.svg` are template leftovers.
- `README.md` was the Vite starter README until the Week 38 deploy work replaced it — check nothing else still describes the template rather than this project.

---

## Open questions for the club

Things engineering cannot decide alone. Worth getting answers before speccing
Priority 1 work.

1. Who maintains events after handoff — a developer editing files, or an officer editing a Google Calendar?
2. Where should event photos live? Repo, Google Drive, or Instagram embeds?
3. Do they want a contact form, or is email and Instagram enough?
4. Is there a regular meeting location and time to publish?
5. Which social accounts do they actively use? (The footer currently links LinkedIn and TikTok — do those exist?)
6. Can they provide the logo as a vector or transparent PNG? (W38.5)
7. Do they have photos and names for previous boards?
8. Is anyone available to write the About section copy, or should we draft and have them edit?
