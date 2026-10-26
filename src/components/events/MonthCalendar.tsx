import { useId, useState, type MouseEvent, type ReactNode } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

import {
  EVENT_CATEGORY_LABELS,
  eventDayKey,
  formatEventDate,
  formatEventDateRange,
  formatEventTime,
  formatMonthKey,
  getEventDayKeys,
  shiftDayKey,
  shiftMonthKey,
  type TsaEvent,
} from "@/data/events";
import { cn } from "@/lib/utils";

const focusRing =
  "outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-tsa-red-600";

/** Event chips shown in a day cell before the rest collapse into "+N more". */
const MAX_CHIPS = 2;

// 2026-11-01 is a Sunday; weeks start on Sunday (US convention).
const WEEKDAYS = Array.from({ length: 7 }, (_, i) => {
  const day = shiftDayKey("2026-11-01", i);
  return {
    long: formatEventDate(day, { weekday: "long" }),
    short: formatEventDate(day, { weekday: "short" }),
    narrow: formatEventDate(day, { weekday: "narrow" }),
  };
});

/**
 * Weeks of `month` (`YYYY-MM`) as rows of seven `YYYY-MM-DD` days, Sunday
 * first. Days from the neighbouring months are null. Four to six rows.
 */
function buildMonthGrid(month: string): (string | null)[][] {
  const [year, m] = month.split("-").map(Number);
  const leading = new Date(Date.UTC(year, m - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, m, 0)).getUTCDate();
  const weeks = Math.ceil((leading + daysInMonth) / 7);

  return Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const date = w * 7 + d - leading + 1;
      return date >= 1 && date <= daysInMonth
        ? `${month}-${String(date).padStart(2, "0")}`
        : null;
    }),
  );
}

/** "Thursday, March 12" */
function formatDayLabel(day: string): string {
  return formatEventDate(day, { weekday: "long", month: "long", day: "numeric" });
}

/** Accessible name for an event on one day: "Trivia Night, Thursday, March 12, 6:00 PM". */
function eventLinkLabel(event: TsaEvent, day: string): string {
  const time = formatEventTime(event);
  const range = event.end ? ` (${formatEventDateRange(event)})` : "";
  return `${event.title}, ${formatDayLabel(day)}${time ? `, ${time}` : ""}${range}`;
}

function targetId(event: TsaEvent): string {
  return `month-event-${event.id}`;
}

/**
 * Month calendar (W42.1.3).
 *
 * Accessibility model: a real `<table>` with a `<caption>` and `<th
 * scope="col">` weekday headers. Day cells are plain cells; only days with
 * events contain links, so Tab moves from event to event and never stops on
 * an empty day. This page is for reading what's on, not picking a date, so the
 * ARIA grid pattern (roving tabindex, arrow keys) would add cost for no gain.
 *
 * Opening an event always scrolls to and focuses it in the list of this
 * month's events below the grid. That list also carries the full details and
 * the Instagram link, and it's what makes the phone layout work: below the
 * `sm` breakpoint cells show dots, each day with events is one link, and the
 * titles are read in the list instead.
 *
 * `events` should already be limited to the month (`getEventsInMonth`) and
 * sorted soonest first.
 */
export default function MonthCalendar({
  month,
  events,
  onMonthChange,
  empty,
  className,
}: {
  /** `YYYY-MM` */
  month: string;
  events: TsaEvent[];
  onMonthChange: (month: string) => void;
  /** Shown in place of the list when the month has no events. */
  empty?: ReactNode;
  className?: string;
}) {
  const headingId = useId();
  const listHeadingId = useId();

  // Computed on each render in the visitor's browser, in the same Eastern-time
  // day the agenda uses to split upcoming from past.
  const today = eventDayKey(new Date().toISOString());
  const currentMonth = today.slice(0, 7);
  const label = formatMonthKey(month);
  const weeks = buildMonthGrid(month);

  const eventsByDay = new Map<string, TsaEvent[]>();
  for (const event of events) {
    for (const day of getEventDayKeys(event)) {
      if (!day.startsWith(month)) continue;
      eventsByDay.set(day, [...(eventsByDay.get(day) ?? []), event]);
    }
  }

  // Set only when the visitor changes month, so it's announced once per change
  // and not on page load.
  const [announcement, setAnnouncement] = useState("");

  function goTo(next: string) {
    onMonthChange(next);
    const message = formatMonthKey(next);
    // A trailing space toggles so the same message is still re-announced.
    setAnnouncement((prev) => (prev === message ? `${message} ` : message));
  }

  function openEvent(event: TsaEvent) {
    const target = document.getElementById(targetId(event));
    if (!target) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    target.focus({ preventScroll: true });
  }

  function eventLinkProps(event: TsaEvent) {
    return {
      href: `#${targetId(event)}`,
      onClick: (e: MouseEvent) => {
        e.preventDefault();
        openEvent(event);
      },
    };
  }

  const isPast = (event: TsaEvent) => eventDayKey(event.end ?? event.start) < today;

  return (
    <section aria-labelledby={headingId} className={className}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id={headingId}
          className="font-display text-3xl font-semibold tracking-tight text-tsa-navy-900 sm:text-4xl"
        >
          {label}
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goTo(currentMonth)}
            className={cn(
              "h-10 cursor-pointer rounded-full border border-tsa-navy-900/25 px-4 text-sm font-semibold text-tsa-navy-900 transition-colors hover:bg-tsa-navy-900/[0.06]",
              focusRing,
            )}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => goTo(shiftMonthKey(month, -1))}
            aria-label="Previous month"
            className={cn(
              "inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-tsa-navy-900/25 text-tsa-navy-900 transition-colors hover:bg-tsa-navy-900/[0.06]",
              focusRing,
            )}
          >
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(shiftMonthKey(month, 1))}
            aria-label="Next month"
            className={cn(
              "inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-tsa-navy-900/25 text-tsa-navy-900 transition-colors hover:bg-tsa-navy-900/[0.06]",
              focusRing,
            )}
          >
            <ChevronRight aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <table className="mt-5 w-full table-fixed border-collapse sm:mt-6">
        <caption className="sr-only">{label}</caption>
        <thead>
          <tr>
            {WEEKDAYS.map((weekday) => (
              <th
                key={weekday.long}
                scope="col"
                className="pb-2 text-xs font-semibold uppercase tracking-wider text-tsa-navy-900/75"
              >
                <span className="sr-only">{weekday.long}</span>
                <span aria-hidden="true" className="sm:hidden">
                  {weekday.narrow}
                </span>
                <span aria-hidden="true" className="hidden sm:inline">
                  {weekday.short}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week.find(Boolean)}>
              {week.map((day, i) => {
                // Days from the neighbouring months stay blank and never carry
                // events.
                if (!day) {
                  return (
                    <td
                      key={`blank-${i}`}
                      className="h-14 border border-tsa-navy-900/10 bg-tsa-navy-900/[0.04] sm:h-28"
                    />
                  );
                }

                const dayEvents = eventsByDay.get(day) ?? [];
                const isToday = day === today;
                const chips =
                  dayEvents.length > MAX_CHIPS ? dayEvents.slice(0, MAX_CHIPS) : dayEvents;
                const overflow = dayEvents.slice(chips.length);
                const dateNumber = (
                  <span
                    className={cn(
                      "inline-flex size-7 items-center justify-center rounded-full text-sm font-semibold tabular-nums",
                      isToday ? "bg-tsa-red-600 text-tsa-cream-100" : "text-tsa-navy-900",
                    )}
                  >
                    {Number(day.slice(8))}
                  </span>
                );

                return (
                  <td
                    key={day}
                    aria-current={isToday ? "date" : undefined}
                    className={cn(
                      "h-14 border border-tsa-navy-900/10 p-0.5 align-top sm:h-28 sm:p-1.5",
                      isToday ? "bg-tsa-gold-300/40" : "bg-white/70",
                    )}
                  >
                    {/* Phone: the whole day is one link to its events in the list. */}
                    {dayEvents.length > 0 ? (
                      <a
                        {...eventLinkProps(dayEvents[0])}
                        aria-label={`${formatDayLabel(day)}: ${dayEvents.map((e) => e.title).join(", ")}`}
                        className={cn(
                          "flex min-h-12 flex-col items-center gap-1 rounded-md sm:hidden",
                          focusRing,
                        )}
                      >
                        {dateNumber}
                        <span aria-hidden="true" className="flex gap-0.5">
                          {dayEvents.slice(0, 3).map((e) => (
                            <span key={e.id} className="size-1.5 rounded-full bg-tsa-navy-700" />
                          ))}
                        </span>
                      </a>
                    ) : null}
                    <div
                      className={cn(
                        "justify-center sm:justify-start",
                        dayEvents.length > 0 ? "hidden sm:flex" : "flex",
                      )}
                    >
                      {dateNumber}
                    </div>

                    {/* Wider screens: a chip per event, then "+N more". */}
                    {dayEvents.length > 0 ? (
                      <ul role="list" className="mt-1 hidden flex-col gap-1 sm:flex">
                        {chips.map((event) => (
                          <li key={event.id}>
                            <a
                              {...eventLinkProps(event)}
                              aria-label={eventLinkLabel(event, day)}
                              className={cn(
                                "block truncate rounded-md px-1.5 py-0.5 text-xs font-semibold",
                                isPast(event)
                                  ? "bg-tsa-navy-900/10 text-tsa-navy-900 hover:bg-tsa-navy-900/15"
                                  : "bg-surface-navy text-surface-navy-fg hover:bg-tsa-navy-900",
                                focusRing,
                              )}
                            >
                              {event.title}
                            </a>
                          </li>
                        ))}
                        {overflow.length > 0 ? (
                          <li>
                            <a
                              {...eventLinkProps(overflow[0])}
                              aria-label={`${overflow.length} more ${overflow.length === 1 ? "event" : "events"} on ${formatDayLabel(day)}`}
                              className={cn(
                                "block truncate rounded-md px-1.5 text-xs font-semibold text-tsa-red-600 underline-offset-2 hover:underline",
                                focusRing,
                              )}
                            >
                              +{overflow.length} more
                            </a>
                          </li>
                        ) : null}
                      </ul>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <section aria-labelledby={listHeadingId} className="mt-10 sm:mt-12">
        <h3
          id={listHeadingId}
          className="font-display text-2xl font-semibold tracking-tight text-tsa-navy-900 sm:text-3xl"
        >
          Events in {label}
        </h3>

        {events.length === 0 ? (
          <div className="mt-5">
            {empty ?? (
              <p className="rounded-2xl border border-dashed border-tsa-navy-900/25 p-6 text-center text-tsa-navy-900/80">
                No events in {label}.
              </p>
            )}
          </div>
        ) : (
          <ol role="list" className="mt-5 flex flex-col gap-3">
            {events.map((event) => (
              <li
                key={event.id}
                id={targetId(event)}
                tabIndex={-1}
                // A plain focus ring (not focus-visible) so mouse users also
                // see which event they opened.
                className="scroll-mt-24 rounded-2xl outline-none focus:outline-2 focus:outline-solid focus:outline-offset-2 focus:outline-tsa-red-600"
              >
                <MonthEventItem event={event} month={month} past={isPast(event)} />
              </li>
            ))}
          </ol>
        )}
      </section>
    </section>
  );
}

function MonthEventItem({
  event,
  month,
  past,
}: {
  event: TsaEvent;
  month: string;
  past: boolean;
}) {
  const time = formatEventTime(event);
  // A multi-day event that started last month shows the first day it's on
  // this month in its date badge; the full range is listed beside it.
  const badgeDay = getEventDayKeys(event).find((d) => d.startsWith(month)) ?? eventDayKey(event.start);

  return (
    <article
      className={cn(
        "flex gap-4 rounded-2xl p-4 ring-1",
        past ? "ring-tsa-navy-900/15" : "bg-white/70 ring-tsa-navy-900/10",
      )}
    >
      <time
        dateTime={badgeDay}
        className={cn(
          "flex w-14 shrink-0 flex-col items-center justify-center self-start rounded-xl py-2",
          past ? "bg-tsa-navy-900/[0.06] text-tsa-navy-900" : "bg-surface-navy text-surface-navy-fg",
        )}
      >
        <span
          className={cn(
            "text-xs font-semibold uppercase tracking-widest",
            past ? "text-tsa-navy-900/75" : "text-tsa-gold-300",
          )}
        >
          {formatEventDate(badgeDay, { weekday: "short" })}
        </span>
        <span className="font-display text-2xl font-semibold leading-none">
          {Number(badgeDay.slice(8))}
        </span>
      </time>

      <div className="min-w-0 flex-1">
        <h4 className="text-lg font-bold leading-snug text-tsa-navy-900">{event.title}</h4>
        <p className="mt-1 text-sm text-tsa-navy-900/75">
          {formatEventDate(event.start, { weekday: "long" })}, {formatEventDateRange(event)}
          {time ? ` · ${time}` : ""}
        </p>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-tsa-navy-900/75">
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-semibold text-tsa-navy-900",
              past ? "bg-tsa-navy-900/[0.07]" : "bg-tsa-gold-300/60",
            )}
          >
            {EVENT_CATEGORY_LABELS[event.category]}
          </span>
          {past ? <span className="text-xs font-semibold uppercase tracking-wider">Past</span> : null}
          <span className="break-words">{event.venue}</span>
        </p>

        {event.instagramUrl ? (
          <a
            href={event.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "mt-3 inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-tsa-red-600 underline-offset-4 hover:underline",
              focusRing,
            )}
          >
            <span>
              View <span className="sr-only">{event.title} </span>on Instagram
              <span className="sr-only"> (opens in a new tab)</span>
            </span>
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        ) : null}
      </div>
    </article>
  );
}
