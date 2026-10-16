/**
 * Gallery photos. Array order is display order within an event; tiles are
 * grouped by `event` (see `groupByEvent`), so a new photo can be appended
 * anywhere and will still sit with the rest of its event.
 *
 * `src` / `video` are paths relative to /public — the page prepends
 * `import.meta.env.BASE_URL`, so don't include it here.
 */
export type GalleryImage = {
  src: string;
  /** Describes what is in the photo. The event name is already in the caption. */
  alt: string;
  /** Event the photo is from, or null when the club hasn't confirmed one. */
  event: string | null;
  /** ISO date (YYYY-MM-DD) when known exactly. */
  date: string | null;
  /** Academic term, e.g. "Fall 2025" — the unit an archive would group by. */
  term: string | null;
  caption?: string;
  /** Set when `src` is a still extracted from a clip in /public/video. */
  video?: string;
  width: number;
  height: number;
};

export const GALLERY: GalleryImage[] = [
  // TODO(club): confirm event + term. Labelled from the krathong being folded
  // and the matching Loy Krathong clip; nothing in the photos names the event.
  {
    src: "thai.jpeg",
    alt: "Students around a table folding banana leaves into round bases while a smiling student holds one up",
    event: "Loy Krathong",
    date: null,
    term: null,
    caption: "Folding banana leaves",
    width: 1377,
    height: 910,
  },
  {
    src: "events.jpg",
    alt: "Two students smiling and holding a finished krathong decorated with purple flowers and incense sticks",
    event: "Loy Krathong",
    date: null,
    term: null,
    caption: "A finished krathong",
    width: 750,
    height: 509,
  },
  // TODO(club): same shot as thai.jpeg with a white border — likely a duplicate.
  {
    src: "thai_2.jpeg",
    alt: "Wider framing of students gathered at a table, shaping banana leaves into krathong bases",
    event: "Loy Krathong",
    date: null,
    term: null,
    caption: "Shaping the bases",
    width: 1440,
    height: 977,
  },
  {
    src: "video/krathong_poster.jpg",
    alt: "A hand lights incense on a marigold krathong shown on a tablet, with floating krathong glowing behind it",
    event: "Loy Krathong",
    date: null,
    term: null,
    caption: "Promo clip",
    video: "video/krathong.mp4",
    width: 720,
    height: 1280,
  },
  {
    src: "community.jpg",
    alt: "Scrapbook collage of students sharing snacks, posing in groups, and building spaghetti-and-marshmallow towers",
    event: "Thai Tea GBM",
    date: null,
    term: null,
    caption: "Snacks and tower building",
    width: 1350,
    height: 1688,
  },
  {
    src: "video/trivia_poster.jpg",
    alt: "Three students standing side by side in a gym under an on-screen caption inviting people to trivia",
    event: "Trivia GBM",
    date: null,
    term: null,
    caption: "Promo clip",
    video: "video/trivia.mp4",
    width: 720,
    height: 1280,
  },
  // Clip caption says April 18; the year isn't shown.
  {
    src: "video/water_festival_poster.jpg",
    alt: "Three students in matching red sweaters dancing in front of a whiteboard with a hand-drawn festival sign",
    event: "Water Festival",
    date: null,
    term: null,
    caption: "Promo clip",
    video: "video/water_festival.mp4",
    width: 720,
    height: 1280,
  },
  // TODO(club): "09/02/2025" is handwritten on the collage — read as US
  // month/day (Sep 2). If it's day/month, change to 2025-02-09 / Spring 2025.
  {
    src: "leadership.jpg",
    alt: "Polaroid-style collage of the board smiling and making peace signs around a Korean barbecue table",
    event: "Board Bonding",
    date: "2025-09-02",
    term: "Fall 2025",
    caption: "Dinner at Honey Pig",
    width: 1350,
    height: 1688,
  },
  // TODO(club): which event is this from?
  {
    src: "support.jpg",
    alt: "Three students smiling outside a brick campus building on a sunny day, each holding an iced drink",
    event: null,
    date: null,
    term: null,
    caption: "Out on campus",
    width: 1440,
    height: 978,
  },
];

export type GalleryGroup = {
  /** null collects photos without a confirmed event. */
  event: string | null;
  images: GalleryImage[];
};

/** Groups in order of each event's first appearance; unlabelled photos last. */
export function groupByEvent(images: readonly GalleryImage[]): GalleryGroup[] {
  const groups = new Map<string | null, GalleryImage[]>();
  for (const image of images) {
    const list = groups.get(image.event) ?? [];
    list.push(image);
    groups.set(image.event, list);
  }
  const ordered = [...groups].map(([event, list]) => ({ event, images: list }));
  return [
    ...ordered.filter((g) => g.event !== null),
    ...ordered.filter((g) => g.event === null),
  ];
}
