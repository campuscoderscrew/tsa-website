import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ReactNode } from "react";

// Register the hook to avoid React version discrepancies.
gsap.registerPlugin(useGSAP);

/**
 * Calculate an array of equidistant positions around a circle with a center at
 * `center`, a radius of `radius`, and `numPoints` number of points.
 *
 * @param radius    The radius of the circle.
 * @param numPoints The number of points around the circle.
 * @param phase     The angle to start from. By default 0.
 * @param translate How much to translate the entire circle by.
 *                  By default `[0, 0]`.
 * @returns A 2D array of equidistant positions around a circle with `numPoints`
 * number of points and a radius of `radius`. Each inner array is of the format
 * [x, y].
 */
const getRadialPoints = (
    radius: number,
    numPoints: number,
    phase: number = 0,
    translate: number[] = [0, 0]
): number[][] => {
    // The angle between each point.
    const INTERVAL = (2 * Math.PI) / numPoints;

    // Calculate the Cartesian position of each point based on the angle.
    const positions = [];
    for (let i = 0; i < numPoints; i++) {
        const ANGLE = phase + INTERVAL * i;
        const x = translate[0] + radius * Math.cos(ANGLE);
        const y = translate[1] + radius * Math.sin(ANGLE);
        positions.push([x, y]);
    }

    return positions;
};

/**
 * Create a 2D array of x, y values, arranging them into two rows seperated by
 * distance `distance` and each of width `width`.
 * @param distance  The distance between the two rows.
 * @param width     The total width of the rows.
 * @param numPoints The number of points in each row.
 * @param translate A translation for every point.
 * @returns A 2D array of x, y values, with one row above and one row below.
 */
const getLinearPoints = (
    distance: number,
    width: number,
    numPoints: number,
    translate: number[] = [0, 0]
): number[][] => {
    const positions = [];

    /*
     * If the number of points we are working with is odd,
     * assume a dummy at the end to make thing even.
     */
    numPoints = numPoints % 2 == 1 ? numPoints + 1 : numPoints;

    // Interval between points.
    const interval = width / (numPoints / 2);

    // Splits the elements into two rows, one above and one below.
    for (let y = -distance / 2; y <= distance / 2; y += distance) {
        /*
         * The -1 prevents cases where the last element is perfectly on the
         * threshold for the first row.
         */
        for (let x = -width / 2; x < width / 2 - 1; x += interval) {
            positions.push([x + translate[0], y + translate[1]]);
        }
    }

    return positions;
};

/**
 * Create the Connect With Us section.
 *
 * @returns A `ReactNode` containing the entire Connect With Us section.
 */
const ConnectWithUs = (): ReactNode => {
    /**
     * Stores the images paths of all the SVG logos to be displayed.
     */
    const LOGO_DATA = [
        { imagePath: "discord.svg", link: "https://www.discord.com" },
        { imagePath: "facebook.svg", link: "https://www.facebook.com/umcptsa" },
        { imagePath: "gmail.svg", link: "https://mail.google.com" },
        {
            imagePath: "instagram.svg",
            link: "https://www.instagram.com/umdtsa"
        },
        { imagePath: "linkedin.svg", link: "https://www.linkedin.com" },
        { imagePath: "youtube.svg", link: "https://www.youtube.com" }
    ];

    // Radius of the logos around the center.
    const LOGOS_RADIUS = Math.min(innerWidth, innerHeight) / 2.5;

    /*
     * We need a transform of the center because the positions of images are
     * measured from their tops, not their centers, which causes it to be off-center.
     */
    const translate = [0, -32];
    /*
     * If the screen is less than medium, show the logos in two rows rather than
     * a circle.
     */
    const LOGO_POSITIONS =
        innerWidth >= 768
            ? // Calculate Cartesian coordinates for the logos.
              getRadialPoints(
                  LOGOS_RADIUS,
                  LOGO_DATA.length,
                  (2 * Math.PI) / 4,
                  translate
              )
            : getLinearPoints(
                  LOGOS_RADIUS * 3,
                  LOGOS_RADIUS * 1.8,
                  LOGO_DATA.length,
                  [48, -32]
              );

    // Animate the logos popping outward from the center.
    useGSAP(() => {
        gsap.fromTo(
            ".logo",
            { x: 0, y: 0 },
            {
                x: (index) => {
                    return LOGO_POSITIONS[index][0];
                },
                y: (index) => {
                    return LOGO_POSITIONS[index][1];
                },
                duration: 1.5,
                ease: "back.out(0.75)"
            }
        );
    });

    return (
        <section
            id="connect-with-us"
            className="relative
                       w-49/50 h-screen
                       place-self-center
                       flex flex-col justify-center items-center
                       rounded-2xl
                       bg-neutral-800 text-center text-white"
        >
            <div className="logos-container static flex flex-col items-center">
                {LOGO_DATA.map((image) => {
                    return (
                        <a
                            href={image.link}
                            className="logo absolute inline"
                            id={image.imagePath}
                            key={image.imagePath}
                        >
                            <img
                                src={`./src/assets/connect-with-us/${image.imagePath}`}
                            />
                        </a>
                    );
                })}
            </div>

            <div
                className="absolute space-y-6 
                           text-center font-family-[Manrope] text-white"
            >
                <button
                    id="connect-with-us-button"
                    className="border-1 border-white rounded-sm py-2 px-4"
                >
                    Members
                </button>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold">
                    Connect With Us
                </h2>
                <h4>The students behind our Mission</h4>
            </div>
        </section>
    );
};

export default ConnectWithUs;
