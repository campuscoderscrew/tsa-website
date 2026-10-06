import { ArrowLeft, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useGalleryTransition } from "@/components/transitions/GalleryTransitionProvider";
import { GALLERY, groupByEvent, type GalleryImage } from "@/data/gallery";

const base = import.meta.env.BASE_URL;

const GROUPS = groupByEvent(GALLERY);
// One masonry for now: most events have a single photo, so per-event headings
// would leave mostly-empty rows. To switch, map GROUPS to <section>s, each with
// an <h2> and its own columns container around `group.images`.
const TILES = GROUPS.flatMap((group) => group.images);

const EVENT_COUNT = GROUPS.filter((group) => group.event !== null).length;
const VIDEO_COUNT = GALLERY.filter((image) => image.video).length;
const PHOTO_COUNT = GALLERY.length - VIDEO_COUNT;

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

const SUMMARY = [
  plural(PHOTO_COUNT, "photo"),
  VIDEO_COUNT > 0 ? ` and ${plural(VIDEO_COUNT, "video still")}` : "",
  EVENT_COUNT > 0 ? ` from ${plural(EVENT_COUNT, "event")}` : "",
].join("");

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function GalleryTile({ image }: { image: GalleryImage }) {
  const when = image.date ? dateFormat.format(new Date(image.date)) : image.term;
  const detail = [image.caption, when].filter(Boolean).join(" · ");

  return (
    <figure className="relative break-inside-avoid overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/15 sm:rounded-2xl">
      <img
        src={`${base}${image.src}`}
        alt={image.alt}
        width={image.width}
        height={image.height}
        className="h-auto w-full object-cover"
        draggable={false}
        loading="lazy"
        decoding="async"
      />
      {image.video && (
        <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-tsa-navy-900/80 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm sm:right-3 sm:top-3">
          <Play className="h-3 w-3 fill-current" aria-hidden="true" />
          Video
        </span>
      )}
      <figcaption className="px-4 py-3 sm:px-5 sm:py-4">
        <p className="text-sm font-semibold text-white sm:text-base">
          {image.event ?? "More moments"}
        </p>
        {detail && <p className="mt-0.5 text-sm text-white/70">{detail}</p>}
      </figcaption>
    </figure>
  );
}

export default function GalleryPage() {
  const { transitionTo } = useGalleryTransition();
  return (
    <main className="relative w-full">
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 w-full">
        <div className="pointer-events-auto w-full bg-tsa-navy-900/70 pt-[env(safe-area-inset-top)] backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-3 py-3 sm:px-6 sm:py-4">
          <Button
            size="sm"
            variant="secondary"
            render={
              <button
                type="button"
                aria-label="Go back to home page"
                onClick={() => transitionTo("/")}
              />
            }
            className="rounded-full bg-[#FFFFF0] text-[#1B1638] hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Button>

          </div>
        </div>
      </header>

      <section className="min-h-dvh w-full bg-tsa-navy-900 px-3 pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-[calc(5rem+env(safe-area-inset-top))] sm:px-6 sm:pt-[calc(6rem+env(safe-area-inset-top))]">
        <div className="mx-auto w-full max-w-7xl">

            <div className="mb-8 pt-4 sm:mb-10 sm:pt-6">
              <div className="mb-4 inline-flex rounded-full border border-white/25 px-4 py-1.5 text-sm font-medium text-white/80">
                Gallery
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Moments from our community
              </h1>
              <p className="mt-4 text-base text-white/70 sm:text-lg">{SUMMARY}</p>
            </div>

          <div className="columns-1 gap-3 space-y-3 sm:columns-2 sm:gap-5 sm:space-y-5 lg:columns-3">
            {TILES.map((image) => (
              <GalleryTile key={image.src} image={image} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

