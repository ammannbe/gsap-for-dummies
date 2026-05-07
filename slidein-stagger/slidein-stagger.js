// !!! DON'T USE CDN IN PRODUCTION !!!
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.14.2/index.js";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.14.2/ScrollTrigger.js";
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


/**
 * Initializes a staggered slide-in animation using GSAP ScrollTrigger.
 *
 * Animates items into view from alternating horizontal directions. Each item starts
 * outside the viewport with reduced opacity and blur, then slides into a staggered
 * final position when the container enters the scroll trigger.
 *
 * @param {HTMLElement} container - The element used as the ScrollTrigger trigger.
 * @param {HTMLElement[]} items - List of elements to animate in a staggered sequence.
 * @param {Object} [options={}] - Optional slide-in configuration.
 * @param {boolean} [options.reverse=false] - Whether to reverse the final staggered offset order.
 *
 * @returns {void}
 */
export function initSlideinStagger(container, items, { reverse = false } = {}) {
    function from(i) {
        let multiplier = (i % 2 === 0 ? 1 : -1);
        let distance = (items[i].clientWidth / 2) + (window.innerWidth / 2);

        return distance * multiplier;
    }

    gsap.fromTo(items, {
        x: (i) => from(i),
        opacity: 0,
        filter: 'blur(15px)',
        stagger: 0.15,
        ease: "power4.out",
        duration: 2,
    }, {
        x: 0,
        opacity: 1,
        filter: 'blur(0px)',
        scrollTrigger: container,
    });
}
