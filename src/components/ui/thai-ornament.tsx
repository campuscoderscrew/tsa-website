import { useId } from "react";
import type { SVGProps } from "react";

/**
 * Thai ornament kit — small inline-SVG decorations drawn from Thai visual
 * tradition (spec W38.2.1).
 *
 * Sourcing: all path data in this file was drawn by hand for this project
 * from photographic references of temple borders and prangs. Nothing is
 * traced or adapted from a third-party SVG, so there is no upstream license.
 *
 * Every stroke and fill is `currentColor`, so consumers pick the color with a
 * text utility: `<LaiThaiDivider className="text-amber-400" />`. All three
 * components are purely decorative and are hidden from assistive tech.
 */

type OrnamentProps = SVGProps<SVGSVGElement>;

/** React's `useId` can contain `:`/`«` which are not safe inside `url(#…)`. */
function useSvgId() {
  return useId().replace(/[^a-zA-Z0-9_-]/g, "");
}

/* ---------------------------------------------------------------------- */
/* LaiThaiDivider                                                          */
/* ---------------------------------------------------------------------- */

// One repeat of the kranok (flame/tendril) motif, drawn in a 48×24 box:
// a base line, a curl, the main flame, a small sprout, and a dot.
const KRANOK_UNIT_WIDTH = 48;
const KRANOK_UNIT_HEIGHT = 24;

export interface LaiThaiDividerProps extends OrnamentProps {
  /**
   * Rendered height in px. The repeat unit scales with it, so this is also
   * how you control the size of the ornament. Width always fills the
   * container.
   */
  height?: number;
  /** Fade the pattern out at both ends so cut-off repeats are invisible. */
  fade?: boolean;
}

/**
 * Horizontal ornamental rule based on the repeating kranok motif that runs
 * along Thai temple borders. Tiles to any width.
 */
export function LaiThaiDivider({
  height = KRANOK_UNIT_HEIGHT,
  fade = true,
  className,
  ...props
}: LaiThaiDividerProps) {
  const id = useSvgId();
  const patternId = `${id}-kranok`;
  const maskId = `${id}-fade`;
  const gradientId = `${id}-grad`;
  const tileWidth = height * (KRANOK_UNIT_WIDTH / KRANOK_UNIT_HEIGHT);

  return (
    <svg
      width="100%"
      height={height}
      aria-hidden="true"
      focusable="false"
      className={className}
      {...props}
    >
      <defs>
        <pattern
          id={patternId}
          patternUnits="userSpaceOnUse"
          width={tileWidth}
          height={height}
          viewBox={`0 0 ${KRANOK_UNIT_WIDTH} ${KRANOK_UNIT_HEIGHT}`}
        >
          <path d="M0 21H48" stroke="currentColor" strokeWidth="1.2" fill="none" />
          <path d="M9 19C13 18 20 12 27 2C25 10 26 15 32 19Z" fill="currentColor" />
          <path
            d="M10 19c-4 0-6-3-4-5s5 0 3 2"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M34 19C36 14 39 12 43 11C40 13 38 16 38 19Z" fill="currentColor" />
          <path d="M17 18C19 15 21 14 24 14C22 15 21 17 21 19Z" fill="currentColor" />
          <circle cx="45.5" cy="16.5" r="1" fill="currentColor" />
        </pattern>
        {fade && (
          <>
            {/* Luminance mask: "white" here is mask coverage, not a rendered color. */}
            <linearGradient id={gradientId}>
              <stop offset="0" stopColor="white" stopOpacity="0" />
              <stop offset="0.15" stopColor="white" />
              <stop offset="0.85" stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id={maskId}>
              <rect width="100%" height="100%" fill={`url(#${gradientId})`} />
            </mask>
          </>
        )}
      </defs>
      <rect
        width="100%"
        height="100%"
        fill={`url(#${patternId})`}
        mask={fade ? `url(#${maskId})` : undefined}
      />
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/* ThaiCorner                                                              */
/* ---------------------------------------------------------------------- */

export type ThaiCornerPosition =
  | "top-left"
  | "top-right"
  | "bottom-right"
  | "bottom-left";

const CORNER_ROTATION: Record<ThaiCornerPosition, number> = {
  "top-left": 0,
  "top-right": 90,
  "bottom-right": 180,
  "bottom-left": 270,
};

export interface ThaiCornerProps extends OrnamentProps {
  /** Which corner of the parent this flourish sits in. Drawn for top-left and rotated. */
  corner?: ThaiCornerPosition;
}

/**
 * Corner flourish for framing cards and headers: two arms with terminal
 * curls, an ogee lotus-bud on the diagonal, and a kranok flame on each arm.
 */
export function ThaiCorner({
  corner = "top-left",
  className,
  ...props
}: ThaiCornerProps) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...props}
    >
      <g transform={`rotate(${CORNER_ROTATION[corner]} 50 50)`}>
        {/* arms */}
        <path
          d="M4 4H70c3 0 5 2 5 5s-3 4-5 2M4 4V70c0 3 2 5 5 5s4-3 2-5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* diagonal ogee bud: outline + solid inner */}
        <path
          d="M9 9C36 5 32 30 48 48C30 32 5 36 9 9Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          fill="none"
        />
        <path d="M14 14C30 13 28 26 38 38C26 28 13 30 14 14Z" fill="currentColor" />
        {/* kranok flame along each arm, with a curl at its base */}
        <path d="M24 4C34 5 46 10 56 22C48 14 44 12 46 7C40 9 32 7 24 4Z" fill="currentColor" />
        <path d="M4 24C5 34 10 46 22 56C14 48 12 44 7 46C9 40 7 32 4 24Z" fill="currentColor" />
        <path
          d="M24 4c-3 2-2 6 1 6M4 24c2-3 6-2 6 1"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="64" cy="14" r="2" fill="currentColor" />
        <circle cx="14" cy="64" r="2" fill="currentColor" />
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/* PrangSilhouette                                                         */
/* ---------------------------------------------------------------------- */

// Mirrored profile, bottom to top: three-step base with moulded lips, the
// main cell with a two-tier porch roof on each side, a flared cornice, seven
// tapering tiers with antefix cusps along a convex "corn-cob" envelope, then
// a lotus bud and trident finial.
const PRANG_PATH =
  "M50 200L98 200L98 193C98 191 96 190 94 190L94 186L91 186L91 180C91 178 89 177 87 177L87 172L84 172L84 167C84 165 82.5 164 81 164L81 160L85.5 160L85.5 144C85.5 141 84.5 139 83 138L83 134C83 131.5 81.5 129.5 79.5 128.5L79.5 126C79 124 81.5 123.5 82.5 121L82.5 118L79.5 118C79.7 112.4 78.6 107 77.7 105.5C78.8 104.2 79.8 103 79.4 102L77 102C77.1 96.8 76 92 75.1 90.5C76.2 89.2 77.2 88 76.8 87L74.3 87C74.4 82.1 73.3 78 72.4 76.5C73.5 75.2 74.5 74 74.1 73L71.4 73C71.5 68.5 70.4 65 69.5 63.5C70.6 62.2 71.6 61 71.2 60L68.5 60C68.6 55.8 67.5 53 66.6 51.5C67.7 50.2 68.7 49 68.3 48L65.2 48C65.3 44.5 64.2 43 63.3 41.5C64.4 40.2 65.4 39 65 38L61.6 38C61.7 35.2 60.6 35 59.7 33.5C60.8 32.2 61.8 31 61.4 30L55.6 30C55.2 26 55.5 22 54 18C53 15.5 52.2 14 52.2 12L53.2 12L53.2 10.5L51.4 9.5L51.4 4L52.4 4L52.4 2.5L50.9 2.5L50.9 0L50 0L49.1 0L49.1 2.5L47.6 2.5L47.6 4L48.6 4L48.6 9.5L46.8 10.5L46.8 12L47.8 12C47.8 14 47 15.5 46 18C44.5 22 44.8 26 44.4 30L38.6 30C38.2 31 39.2 32.2 40.3 33.5C39.4 35 38.3 35.2 38.4 38L35 38C34.6 39 35.6 40.2 36.7 41.5C35.8 43 34.7 44.5 34.8 48L31.7 48C31.3 49 32.3 50.2 33.4 51.5C32.5 53 31.4 55.8 31.5 60L28.8 60C28.4 61 29.4 62.2 30.5 63.5C29.6 65 28.5 68.5 28.6 73L25.9 73C25.5 74 26.5 75.2 27.6 76.5C26.7 78 25.6 82.1 25.7 87L23.2 87C22.8 88 23.8 89.2 24.9 90.5C24 92 22.9 96.8 23 102L20.6 102C20.2 103 21.2 104.2 22.3 105.5C21.4 107 20.3 112.4 20.5 118L17.5 118L17.5 121C18.5 123.5 21 124 20.5 126L20.5 128.5C18.5 129.5 17 131.5 17 134L17 138C15.5 139 14.5 141 14.5 144L14.5 160L19 160L19 164C17.5 164 16 165 16 167L16 172L13 172L13 177C11 177 9 178 9 180L9 186L6 186L6 190C4 190 2 191 2 193L2 200L50 200Z";

/**
 * Silhouette of a Thai prang tower. Solid fill, so it works as a low-opacity
 * watermark or section backdrop. Aspect ratio is 1:2.
 */
export function PrangSilhouette({ className, ...props }: OrnamentProps) {
  return (
    <svg
      width="100"
      height="200"
      viewBox="0 0 100 200"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...props}
    >
      <path d={PRANG_PATH} fill="currentColor" />
    </svg>
  );
}
