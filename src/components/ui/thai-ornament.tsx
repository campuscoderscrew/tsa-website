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

// Mirrored stepped profile: three-tier base, cornice, main body, nine
// narrowing tiers with notched eaves, and a trident finial.
const PRANG_PATH =
  "M98 200V190H92V182H86V174H80V168H83V162H80V140H84V134H78V122H81V117H75V106H78V101H72V91H75V86H69V77H72V72H66V64H69V59H63V52H66V47H60V41H63V36H57V31H60V27H55V22H57V19H53V12L55 10L51.5 8V0H48.5V8L45 10L47 12V19H43V22H45V27H40V31H43V36H37V41H40V47H34V52H37V59H31V64H34V72H28V77H31V86H25V91H28V101H22V106H25V117H19V122H22V134H16V140H20V162H17V168H20V174H14V182H8V190H2V200Z";

/**
 * Stepped tower silhouette of a Thai prang. Solid fill, so it works as a
 * low-opacity watermark or section backdrop. Aspect ratio is 1:2.
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
