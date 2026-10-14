import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import EventAgenda from "@/components/events/EventAgenda";
import { Button } from "@/components/ui/button";
import { LaiThaiDivider } from "@/components/ui/thai-ornament";
import { getUpcomingEvents, TSA_INSTAGRAM_URL } from "@/data/events";

const focusRing =
  "outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-tsa-red-600";

export default function EventsPage() {
  // Runs on each render in the visitor's browser, so "upcoming" is relative
  // to when the page is viewed, not when the site was built.
  const upcoming = getUpcomingEvents();

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
        <header className="mb-10 sm:mb-14">
          <div className="inline-flex rounded-full border border-tsa-navy-900/20 px-4 py-1.5 text-sm font-medium text-tsa-navy-900/75">
            Events
          </div>
          <LaiThaiDivider height={16} className="mt-5 text-tsa-red-600/60" />
          <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-tsa-navy-900 sm:text-5xl lg:text-6xl">
            What&rsquo;s coming up
          </h1>
          <p className="mt-4 max-w-2xl text-base text-tsa-navy-900/75 sm:text-lg">
            Festivals, socials and general body meetings from the Thai Student
            Association at UMD. Everyone is welcome.
          </p>
        </header>

        {upcoming.length > 0 ? (
          <EventAgenda events={upcoming} />
        ) : (
          <section
            aria-labelledby="events-empty-heading"
            className="rounded-2xl bg-white/70 p-6 text-center ring-1 ring-tsa-navy-900/10 sm:p-10"
          >
            <h2
              id="events-empty-heading"
              className="font-display text-2xl font-semibold text-tsa-navy-900 sm:text-3xl"
            >
              Nothing on the calendar just yet
            </h2>
            <p className="mx-auto mt-3 max-w-md text-tsa-navy-900/75">
              We&rsquo;re planning what&rsquo;s next. Follow{" "}
              <span className="font-semibold">@umdtsa</span> on Instagram to
              hear about new events first.
            </p>
            <a
              href={TSA_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-6 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-tsa-red-700 ${focusRing}`}
            >
              Follow @umdtsa on Instagram
              <ArrowUpRight aria-hidden="true" className="size-4" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </section>
        )}
      </main>
    </div>
  );
}
