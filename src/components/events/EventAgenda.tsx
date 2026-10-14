import { ArrowUpRight } from "lucide-react";

import {
  EVENT_CATEGORY_LABELS,
  formatEventDate,
  formatEventDateRange,
  formatEventTime,
  groupEventsByMonth,
  type TsaEvent,
} from "@/data/events";
import { cn } from "@/lib/utils";

const focusRing =
  "rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-tsa-red-600";

/**
 * Agenda list of events grouped by month. Takes the events as a prop so the
 * same list renders upcoming events (W42.1.1) and past events (W42.1.2).
 *
 * `order` sets the month order: "asc" for upcoming (soonest first), "desc"
 * for an archive (most recent first). Events within a month keep the order
 * they're passed in, so sort them with the `events.ts` helpers first.
 */
export default function EventAgenda({
  events,
  order = "asc",
  className,
}: {
  events: TsaEvent[];
  order?: "asc" | "desc";
  className?: string;
}) {
  const months = groupEventsByMonth(events, order);

  return (
    <div className={cn("flex flex-col gap-12 sm:gap-14", className)}>
      {months.map((month) => {
        const headingId = `events-${month.key}`;
        return (
          <section key={month.key} aria-labelledby={headingId}>
            <h2
              id={headingId}
              className="flex items-center gap-4 font-display text-2xl font-semibold tracking-tight text-tsa-navy-900 sm:text-3xl"
            >
              {month.label}
              <span aria-hidden="true" className="h-px flex-1 bg-tsa-navy-900/15" />
            </h2>

            <ol role="list" className="mt-5 flex flex-col gap-4 sm:mt-6">
              {month.events.map((event) => (
                <li key={event.id}>
                  <EventAgendaItem event={event} />
                </li>
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}

function EventAgendaItem({ event }: { event: TsaEvent }) {
  const time = formatEventTime(event);
  const isMultiDay = Boolean(event.end);

  return (
    <article className="flex gap-4 rounded-2xl bg-white/70 p-4 ring-1 ring-tsa-navy-900/10 sm:gap-6 sm:p-5">
      <time
        dateTime={event.start}
        className="flex w-16 shrink-0 flex-col items-center justify-center self-start rounded-xl bg-surface-navy py-2.5 text-surface-navy-fg sm:w-20 sm:py-3"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-tsa-gold-300">
          {formatEventDate(event.start, { month: "short" })}
        </span>
        <span className="font-display text-3xl font-semibold leading-none sm:text-4xl">
          {formatEventDate(event.start, { day: "numeric" })}
        </span>
      </time>

      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-bold leading-snug text-tsa-navy-900 sm:text-xl">
          {event.title}
        </h3>

        <dl className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-tsa-navy-900/75">
          <div className="flex gap-1">
            <dt className="sr-only">Category</dt>
            <dd className="rounded-full bg-tsa-gold-300/60 px-2.5 py-0.5 text-xs font-semibold text-tsa-navy-900">
              {EVENT_CATEGORY_LABELS[event.category]}
            </dd>
          </div>
          {isMultiDay ? (
            <div className="flex gap-1">
              <dt className="sr-only">Dates</dt>
              <dd>{formatEventDateRange(event)}</dd>
            </div>
          ) : null}
          {time ? (
            <div className="flex gap-1">
              <dt className="sr-only">Time</dt>
              <dd>{time}</dd>
            </div>
          ) : null}
          <div className="flex min-w-0 gap-1">
            <dt className="sr-only">Venue</dt>
            <dd className="break-words">{event.venue}</dd>
          </div>
        </dl>

        {event.description ? (
          <p className="mt-2 text-sm text-tsa-navy-900/80">{event.description}</p>
        ) : null}

        {event.instagramUrl ? (
          <a
            href={event.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-tsa-red-600 underline-offset-4 hover:underline",
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
