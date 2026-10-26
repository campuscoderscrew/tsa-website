import { useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import EventAgenda from "@/components/events/EventAgenda";
import EventFilters from "@/components/events/EventFilters";
import MonthCalendar from "@/components/events/MonthCalendar";
import { Button } from "@/components/ui/button";
import { LaiThaiDivider } from "@/components/ui/thai-ornament";
import {
  EVENT_CATEGORY_LABELS,
  eventMonthKey,
  filterEventsByCategory,
  formatMonthKey,
  getEventsInMonth,
  getPastEvents,
  getUpcomingEvents,
  groupEventsBySchoolYear,
  parseEventCategory,
  parseMonthKey,
  TSA_INSTAGRAM_URL,
  type TsaEventCategory,
} from "@/data/events";

const focusRing =
  "outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-tsa-red-600";

function countLabel(n: number) {
  return `${n} ${n === 1 ? "event" : "events"}`;
}

type EventsView = "list" | "month";

export default function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  // An unknown ?category= value falls back to "All" rather than showing nothing.
  const category = parseEventCategory(searchParams.get("category"));
  // List is the default; anything but ?view=month is the list.
  const view: EventsView = searchParams.get("view") === "month" ? "month" : "list";
  // The visitor's current month unless ?month= names a valid one.
  const month =
    parseMonthKey(searchParams.get("month")) ?? eventMonthKey(new Date().toISOString());

  // Runs on each render in the visitor's browser, so "upcoming" and "past"
  // are relative to when the page is viewed, not when the site was built.
  const allUpcoming = getUpcomingEvents();
  const allPast = getPastEvents();
  const upcoming = filterEventsByCategory(allUpcoming, category);
  const past = filterEventsByCategory(allPast, category);
  const pastByYear = groupEventsBySchoolYear(past);
  const allInMonth = getEventsInMonth(month);
  const inMonth = filterEventsByCategory(allInMonth, category);

  // Set only when the visitor changes the filter, so the count is announced
  // once per change and not on page load.
  const [announcement, setAnnouncement] = useState("");

  function changeCategory(next: TsaEventCategory | null) {
    setSearchParams(
      (params) => {
        if (next) params.set("category", next);
        else params.delete("category");
        return params;
      },
      { replace: true, preventScrollReset: true },
    );

    let message: string;
    if (view === "month") {
      const n = filterEventsByCategory(allInMonth, next).length;
      const monthName = formatMonthKey(month);
      message =
        n === 0
          ? `No events match this category in ${monthName}`
          : `${countLabel(n)} in ${monthName}`;
    } else {
      const u = filterEventsByCategory(allUpcoming, next).length;
      const p = filterEventsByCategory(allPast, next).length;
      message =
        u + p === 0
          ? "No events match this category"
          : `${countLabel(u + p)}: ${u} upcoming, ${p} past`;
    }
    // A trailing space toggles so the same message is still re-announced.
    setAnnouncement((prev) => (prev === message ? `${message} ` : message));
  }

  function changeView(next: EventsView) {
    setSearchParams(
      (params) => {
        if (next === "month") {
          params.set("view", "month");
        } else {
          params.delete("view");
          params.delete("month");
        }
        return params;
      },
      { replace: true, preventScrollReset: true },
    );
  }

  function changeMonth(next: string) {
    setSearchParams(
      (params) => {
        params.set("month", next);
        return params;
      },
      { replace: true, preventScrollReset: true },
    );
  }

  const categoryName = category ? `“${EVENT_CATEGORY_LABELS[category]}”` : "";

  return (
    <div className="min-h-dvh bg-surface-cream text-surface-cream-fg">
      <title>Events · Thai Student Association at UMD</title>

      <header className="sticky top-0 z-50 w-full bg-surface-cream/85 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-4xl items-center px-4 py-3 sm:px-6 sm:py-4">
          <Button
            size="sm"
            render={<Link to="/" />}
            className={`rounded-full border-transparent bg-surface-navy text-surface-navy-fg [:hover,[data-pressed]]:bg-tsa-navy-900 ${focusRing}`}
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Button>
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-4xl px-4 pb-[calc(4rem+env(safe-area-inset-bottom))] pt-6 outline-none sm:px-6 sm:pt-10"
      >
        <header className="mb-8 sm:mb-10">
          <div className="inline-flex rounded-full border border-tsa-navy-900/20 px-4 py-1.5 text-sm font-medium text-tsa-navy-900/75">
            Events
          </div>
          <LaiThaiDivider height={16} className="mt-5 text-tsa-red-600/60" />
          <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-tsa-navy-900 sm:text-5xl lg:text-6xl">
            What&rsquo;s coming up
          </h1>
          <p className="mt-4 max-w-2xl text-base text-tsa-navy-900/75 sm:text-lg">
            Festivals, socials and general body meetings from the Thai Student
            Association at UMD. Everyone is welcome.{" "}
            {view === "list"
              ? "Scroll down to see what we’ve done in past years."
              : "Step through the months to see what’s on and what we’ve done."}
          </p>
        </header>

        <div className="mb-10 flex flex-col gap-4 sm:mb-12">
          <ViewToggle value={view} onChange={changeView} />
          <EventFilters value={category} onChange={changeCategory} />
        </div>
        <p aria-live="polite" className="sr-only">
          {announcement}
        </p>

        {view === "month" ? (
          <MonthCalendar
            month={month}
            events={inMonth}
            onMonthChange={changeMonth}
            empty={
              category ? (
                <NoMatches
                  message={`No events in ${categoryName} in ${formatMonthKey(month)}.`}
                  onReset={() => changeCategory(null)}
                />
              ) : undefined
            }
          />
        ) : (
          <>
            <section aria-labelledby="upcoming-heading">
              <h2
                id="upcoming-heading"
                className="mb-6 font-display text-3xl font-semibold tracking-tight text-tsa-navy-900 sm:mb-8 sm:text-4xl"
              >
                Upcoming
              </h2>

              {allUpcoming.length === 0 ? (
                <div className="rounded-2xl bg-white/70 p-6 text-center ring-1 ring-tsa-navy-900/10 sm:p-8">
                  <p className="font-display text-xl font-semibold text-tsa-navy-900 sm:text-2xl">
                    Nothing on the calendar just yet
                  </p>
                  <p className="mx-auto mt-2 max-w-md text-tsa-navy-900/75">
                    We&rsquo;re planning what&rsquo;s next. Follow{" "}
                    <span className="font-semibold">@umdtsa</span> on Instagram to
                    hear about new events first.
                  </p>
                  <a
                    href={TSA_INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-tsa-red-700 ${focusRing}`}
                  >
                    Follow @umdtsa on Instagram
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </div>
              ) : upcoming.length === 0 ? (
                <NoMatches
                  message={`No upcoming events in ${categoryName}.`}
                  onReset={() => changeCategory(null)}
                />
              ) : (
                <EventAgenda events={upcoming} headingLevel={3} />
              )}
            </section>

            <section
              aria-labelledby="past-heading"
              className="mt-16 border-t border-tsa-navy-900/15 pt-12 sm:mt-20 sm:pt-14"
            >
              <h2
                id="past-heading"
                className="font-display text-3xl font-semibold tracking-tight text-tsa-navy-900 sm:text-4xl"
              >
                Past events
              </h2>
              <p className="mt-3 max-w-2xl text-tsa-navy-900/75">
                A look back at what TSA has done, by school year.
              </p>

              {pastByYear.length === 0 ? (
                <NoMatches
                  className="mt-8"
                  message={
                    category
                      ? `No past events in ${categoryName}.`
                      : "No past events to show yet."
                  }
                  onReset={category ? () => changeCategory(null) : undefined}
                />
              ) : (
                <div className="mt-8 flex flex-col gap-12 sm:mt-10 sm:gap-14">
                  {pastByYear.map((year) => (
                    <section key={year.schoolYear} aria-labelledby={`year-${year.schoolYear}`}>
                      <h3
                        id={`year-${year.schoolYear}`}
                        className="flex items-center gap-4 font-display text-2xl font-semibold tracking-tight text-tsa-navy-900 sm:text-3xl"
                      >
                        {year.schoolYear}
                        <span aria-hidden="true" className="h-px flex-1 bg-tsa-navy-900/15" />
                      </h3>

                      {year.semesters.map((semester) => (
                        <section key={semester.label} className="mt-6">
                          <h4 className="mb-3 text-sm font-semibold uppercase tracking-widest text-tsa-navy-900/75">
                            {semester.label}
                          </h4>
                          <EventAgenda events={semester.events} variant="past" headingLevel={5} />
                        </section>
                      ))}
                    </section>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

/**
 * "List" / "Month" switch. Two toggle buttons with `aria-pressed` in a
 * labelled group, styled like the category filter next to it.
 */
function ViewToggle({
  value,
  onChange,
}: {
  value: EventsView;
  onChange: (view: EventsView) => void;
}) {
  const options: { value: EventsView; label: string }[] = [
    { value: "list", label: "List" },
    { value: "month", label: "Month" },
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      <span id="events-view-label" className="shrink-0 text-sm font-semibold text-tsa-navy-900">
        View
      </span>
      <div
        role="group"
        aria-labelledby="events-view-label"
        className="inline-flex self-start rounded-full border border-tsa-navy-900/25 p-1"
      >
        {options.map((option) => {
          const pressed = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={pressed}
              onClick={() => onChange(option.value)}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${focusRing} ${
                pressed
                  ? "bg-surface-navy text-surface-navy-fg"
                  : "text-tsa-navy-900 hover:bg-tsa-navy-900/[0.06]"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NoMatches({
  message,
  onReset,
  className,
}: {
  message: string;
  onReset?: () => void;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-dashed border-tsa-navy-900/25 p-6 text-center ${className ?? ""}`}
    >
      <p className="text-tsa-navy-900/80">{message}</p>
      {onReset ? (
        <button
          type="button"
          onClick={onReset}
          className={`mt-3 cursor-pointer rounded-sm text-sm font-semibold text-tsa-red-600 underline underline-offset-4 ${focusRing}`}
        >
          Show all categories
        </button>
      ) : null}
    </div>
  );
}
