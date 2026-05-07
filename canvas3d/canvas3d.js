// !!! DON'T USE CDN IN PRODUCTION !!!
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.14.2/index.js";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.14.2/ScrollTrigger.js";
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


/**
 * Initializes a scroll-driven canvas image-sequence animation using GSAP ScrollTrigger.
 *
 * Preloads a sequence of images, sizes the canvas to match the loaded frame,
 * and updates the rendered canvas frame as the user scrolls through the container.
 *
 * The `url` option must include a `{frame}` placeholder, which will be replaced
 * with the current frame number padded to `framelength`. Example:
 * - /frames/frame-0001.jpg
 * - /frames/frame-0002.jpg
 * - /frames/frame-0003.jpg
 *
 * @param {HTMLElement} container - The outer wrapper that acts as the scroll trigger.
 * @param {HTMLElement} content - The content element whose height is used to calculate the scroll distance.
 * @param {HTMLCanvasElement} canvas - The canvas element used to render the image sequence.
 * @param {Object} options - Canvas image-sequence configuration.
 * @param {string} options.url - Image URL pattern containing a `{frame}` placeholder.
 * @param {number} options.framecount - Total number of frames/images in the sequence.
 * @param {number} options.framelength - Number of digits used to pad the frame number.
 * @param {number} [options.animationLength=1] - Multiplier applied to the content height to define the scroll distance.
 *
 * @returns {void}
 */
export function initCanvas3d(container, content, canvas, { url, framecount = 100, framelength = 4, animationLength = 1 }) {
    const context = canvas.getContext('2d');
    const contentOffsetHeight = content.offsetHeight * animationLength;

    function render(context, canvas, image) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0);
    }

    function initload(img) {
        // Set canvas context size based on the specified image
        canvas.width = img.width;
        canvas.height = img.height;

        gsap.to(frames, {
            frame: framecount - 1,
            snap: 'frame',
            scrollTrigger: {
                trigger: container,
                start: 'top top',
                end: '+=' + contentOffsetHeight,
                scrub: 1,
                invalidateOnRefresh: true,
                markers: true,
            },
            onUpdate: () => render(context, canvas, images[frames.frame]),
        });
    }


    const images = []
    const frames = { frame: 0 };

    for (let i = 0; i < framecount; i++) {
        const img = new Image();

        if (i === (framecount - 1)) {
            img.onload = () => initload(img);
        }

        img.src = url.replace('{frame}', (i + 1).toString().padStart(framelength, '0'));
        images.push(img);
    }
}
