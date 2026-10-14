/**
 * TSA events — single source of truth for every place the site shows events.
 *
 * Pages and components read events only through the helpers at the bottom of
 * this file (`getUpcomingEvents`, `getPastEvents`, `formatEventDate`, …),
 * never the raw array. If the club moves events to a Google Calendar
 * (features_TODO.md, open question 1), a fetch that produces the same
 * `TsaEvent[]` replaces `EVENTS` and nothing else changes.
 *
 * Google Calendar API `Event` resource → `TsaEvent`:
 *   id                                   → id
 *   summary                              → title
 *   start.date | start.dateTime          → start
 *   end.date   | end.dateTime            → end   (note: Calendar's all-day
 *                                                 end.date is exclusive)
 *   location                             → venue
 *   description                          → description
 *   extendedProperties.shared.category   → category
 *   extendedProperties.shared.instagram  → instagramUrl
 *   attachments[0].fileUrl               → media
 */

export type TsaEventCategory =
  | "festival"
  | "gbm"
  | "social"
  | "fundraiser"
  | "collab";

export const EVENT_CATEGORY_LABELS: Record<TsaEventCategory, string> = {
  festival: "Festival",
  gbm: "General body meeting",
  social: "Social",
  fundraiser: "Fundraiser",
  collab: "Collab",
};

export type EventMedia =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; poster?: string };

export type TsaEvent = {
  /** Stable slug; never reuse one for a different event. */
  id: string;
  title: string;
  /**
   * ISO 8601. Either a date (`2026-11-14`) for an all-day event, or a
   * date-time with an offset (`2026-11-14T18:00:00-05:00`) when the time is
   * known.
   */
  start: string;
  /** ISO 8601, inclusive. Set only for events that run past `start`. */
  end?: string;
  venue: string;
  category: TsaEventCategory;
  /** The Instagram post for this event. */
  instagramUrl?: string;
  media?: EventMedia;
  description?: string;
};

export const TSA_INSTAGRAM_URL = "https://www.instagram.com/umdtsa/";

const base = import.meta.env.BASE_URL;

// Real 2025–26 events from the unmerged `feature/upcoming-events-images`
// branch. No upcoming events are listed until the club confirms them: an empty
// agenda is better than an invented one.
export const EVENTS: TsaEvent[] = [
  {
    id: "senior-send-off-2025",
    title: "Senior Send-Off",
    start: "2025-12-03", // TODO: unconfirmed — year inferred from "DEC 3"
    venue: "Tawes 1100",
    category: "social",
  },
  {
    id: "trivia-night-2026",
    title: "Trivia Night",
    start: "2026-03-12", // TODO: unconfirmed — year inferred from "MAR 12"
    venue: "Tawes 1107",
    category: "social",
    media: {
      type: "video",
      src: `${base}video/trivia.mp4`,
      poster: `${base}video/trivia_poster.jpg`,
    },
  },
  {
    id: "water-festival-2026",
    title: "Water Festival",
    start: "2026-04-18", // TODO: unconfirmed — year inferred from "APR 18"
    venue: "Hornbake Plaza",
    category: "festival",
    media: {
      type: "video",
      src: `${base}video/water_festival.mp4`,
      poster: `${base}video/water_festival_poster.jpg`,
    },
  },
];

/* ---------------------------------------------------------------------- */
/* Dates                                                                   */
/* ---------------------------------------------------------------------- */

/** TSA meets in College Park, so date-times are shown in Eastern time. */
export const EVENT_TIME_ZONE = "America/New_York";

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/** True when the ISO string is a calendar date with no time of day. */
export function isDateOnly(iso: string): boolean {
  return DATE_ONLY.test(iso);
}

/**
 * `new Date("2026-11-14")` is midnight UTC, which is Nov 13 in College Park.
 * A date-only string is a calendar day, not an instant, so pin it to noon UTC
 * and format it in UTC: the day can't shift whatever the visitor's zone.
 * Date-times are real instants and are formatted in Eastern time.
 */
function resolve(iso: string): { date: Date; timeZone: string } {
  if (isDateOnly(iso)) {
    return { date: new Date(`${iso}T12:00:00Z`), timeZone: "UTC" };
  }
  return { date: new Date(iso), timeZone: EVENT_TIME_ZONE };
}

/** Format an event's ISO date with `Intl.DateTimeFormat`, time-zone safe. */
export function formatEventDate(
  iso: string,
  options: Intl.DateTimeFormatOptions,
): string {
  const { date, timeZone } = resolve(iso);
  return new Intl.DateTimeFormat("en-US", { ...options, timeZone }).format(
    date,
  );
}

/** Calendar day of an ISO string as `YYYY-MM-DD`, in the event's zone. */
export function eventDayKey(iso: string): string {
  if (isDateOnly(iso)) return iso;
  const { date, timeZone } = resolve(iso);
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** `YYYY-MM` of the event's start, for grouping by month. */
export function eventMonthKey(iso: string): string {
  return eventDayKey(iso).slice(0, 7);
}

/** "Nov 14", or "Nov 14–16" / "Nov 30 – Dec 2" for multi-day events. */
export function formatEventDateRange(event: TsaEvent): string {
  const startLabel = formatEventDate(event.start, {
    month: "short",
    day: "numeric",
  });
  if (!event.end || eventDayKey(event.end) === eventDayKey(event.start)) {
    return startLabel;
  }
  if (eventMonthKey(event.end) === eventMonthKey(event.start)) {
    return `${startLabel}–${formatEventDate(event.end, { day: "numeric" })}`;
  }
  return `${startLabel} – ${formatEventDate(event.end, {
    month: "short",
    day: "numeric",
  })}`;
}

/** "6:00 PM", or null for all-day events. */
export function formatEventTime(event: TsaEvent): string | null {
  if (isDateOnly(event.start)) return null;
  return formatEventDate(event.start, { hour: "numeric", minute: "2-digit" });
}

/* ---------------------------------------------------------------------- */
/* Derived views                                                           */
/* ---------------------------------------------------------------------- */

function byStart(a: TsaEvent, b: TsaEvent): number {
  return resolve(a.start).date.getTime() - resolve(b.start).date.getTime();
}

/**
 * Events that haven't finished yet, soonest first. An event stays upcoming
 * through its last day, so a festival is still listed while it's running.
 *
 * `now` defaults to page-load time in the visitor's browser, not build time.
 */
export function getUpcomingEvents(
  now: Date = new Date(),
  events: TsaEvent[] = EVENTS,
): TsaEvent[] {
  const today = eventDayKey(now.toISOString());
  return events
    .filter((e) => eventDayKey(e.end ?? e.start) >= today)
    .sort(byStart);
}

/** Events that have finished, most recent first. */
export function getPastEvents(
  now: Date = new Date(),
  events: TsaEvent[] = EVENTS,
): TsaEvent[] {
  const today = eventDayKey(now.toISOString());
  return events
    .filter((e) => eventDayKey(e.end ?? e.start) < today)
    .sort((a, b) => byStart(b, a));
}

export type EventMonthGroup = {
  /** `YYYY-MM` */
  key: string;
  /** "November 2026" */
  label: string;
  events: TsaEvent[];
};

/**
 * Group events by the month they start in. Groups come back in the order of
 * their keys (`direction`), and each group keeps the order it was given.
 */
export function groupEventsByMonth(
  events: TsaEvent[],
  direction: "asc" | "desc" = "asc",
): EventMonthGroup[] {
  const groups = events.reduce<Record<string, TsaEvent[]>>((acc, event) => {
    const key = eventMonthKey(event.start);
    (acc[key] ??= []).push(event);
    return acc;
  }, {});

  const keys = Object.keys(groups).sort();
  if (direction === "desc") keys.reverse();

  return keys.map((key) => ({
    key,
    label: formatEventDate(`${key}-01`, { month: "long", year: "numeric" }),
    events: groups[key],
  }));
}
