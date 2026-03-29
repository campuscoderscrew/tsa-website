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
 * @param phase     The angle to start from.
 * @returns A 2D array of equidistant positions around a circle with `numPoints`
 * number of points and a radius of `radius`. Each inner array is of the format
 * [x, y].
 */
const getRadialPoints = (
    radius: number,
    numPoints: number,
    phase: number = 0
): number[][] => {
    // The angle between each point.
    const INTERVAL = (2 * Math.PI) / numPoints;

    // Calculate the Cartesian position of each point.
    const positions = [];
    for (let i = 0; i < numPoints; i++) {
        const ANGLE = phase + INTERVAL * i;
        positions.push([radius * Math.cos(ANGLE), radius * Math.sin(ANGLE)]);
    }

    return positions;
};

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
    const LOGOS_RADIUS = 315;

    // Calculate Cartesian coordinates for the logos.
    const LOGO_POSITIONS = getRadialPoints(
        LOGOS_RADIUS,
        LOGO_DATA.length,
        (2 * Math.PI) / 4
    );

    // Use selectors...
    // useGSAP(() => {
    //     gsap.to(".logos-container", {
    //         rotation: "+=0",
    //         duration: 3,
    //         ease: "none",
    //         repeat: -1
    //     });
    // });

    useGSAP(() => {
        /*
         * Make the individual logos Loop counterclockwise at a constant speed
         * to counteract the overrall rotation.
         */
        gsap.to(".logo", {
            rotation: -360,
            duration: 5,
            ease: "none",
            repeat: -1
        });
    });

    return (
        <section
            id="connect-with-us"
            className="relative
                       w-screen h-screen
                       flex flex-col justify-center items-center
                       rounded-2xl
                       bg-neutral-800 text-center text-white"
        >
            <div className="logos-container static mt-20 flex flex-col items-center">
                <svg className="absolute m-auto" >
                    <circle
                        r={LOGOS_RADIUS}
                        cx={window.outerWidth / 5}
                        cy={window.outerHeight / 5}
                    />
                </svg>

                {LOGO_DATA.map((image, index) => {
                    const style = {
                        transform: `translate(${LOGO_POSITIONS[index][0]}px, ${LOGO_POSITIONS[index][1]}px)`
                    };

                    return (
                        <a
                            href={image.link}
                            key={image.imagePath}
                            className="logo absolute inline"
                            style={style}
                        >
                            <img
                                src={`./src/assets/connect-with-us/${image.imagePath}`}
                            />
                        </a>
                    );
                })}
            </div>

            <div
                className="static space-y-6 
                           text-center font-family-[Manrope] text-white"
            >
                <button
                    id="connect-with-us-button"
                    className="border-1 border-white rounded-sm py-2 px-4"
                >
                    Members
                </button>

                <h2 className="text-5xl font-semibold">Connect With Us</h2>
                <h4>The students behind our Mission</h4>
            </div>
        </section>
    );
};

export default ConnectWithUs;
