// !!! DON'T USE CDN IN PRODUCTION !!!
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.14.2/index.js";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.14.2/ScrollTrigger.js";
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


/**
 * Initializes a scroll-driven sticky animation using GSAP ScrollTrigger.
 *
 * Pins a container during scroll and progressively reveals items, images,
 * and optional hidden sub-elements while translating the content vertically.
 *
 * @param {HTMLElement} container - The outer wrapper that acts as the scroll trigger and pinned section.
 * @param {HTMLElement} content - The inner element that is translated vertically during scrolling.
 * @param {HTMLElement[]} items - List of content items that are revealed step-by-step.
 * @param {HTMLElement[]} images - List of images corresponding to each item, faded in on activation.
 * @param {string} hiddenItemSelector - Selector for a nested element inside each item that expands/collapses.
 * @param {Object} [options={}] - Optional sticky scroll configuration.
 * @param {number} [options.scrollMultiplier=2] - Multiplier defining the total scroll distance based on content height.
 * @param {number} [options.keepActive=1] - Number of previous items that remain active before scrolling out of view.
 *
 * @returns {void}
 */
export function initStickyScroll(container, content, items, images, hiddenItemSelector, { scrollMultiplier = 2, keepActive = 1 }) {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: () => '+=' + Math.max(content.offsetHeight * scrollMultiplier, (window.innerHeight * 0.8)),
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            markers: true,
        }
    });

    function getMoveY(index) {
        const gap = parseFloat(getComputedStyle(content).gap) || 0;
        let y = 0;

        for (let i = 0; i <= index - keepActive; i++) {
            const item = items[i] ?? false;

            if (! item) {
                continue;
            }

            const hiddenHeight = item?.querySelector(hiddenItemSelector)?.offsetHeight || 0;
            const itemHeight = (item?.offsetHeight || 0) - hiddenHeight;

            y += itemHeight + gap;
        }

        return y * -1;
    }

    const STEP_DURATION = 0.4;
    items.forEach((item, index) => {
        const position = index;
        const gap = parseFloat(getComputedStyle(content).gap) || 0;

        tl.to(content, {
            y: () => getMoveY(index),
            duration: 0,
            ease: 'none',
        }, index);

        tl.to(item, {
            opacity: item.dataset.opacity ?? 1,
            color: item.dataset.color ?? '',
            duration: 0,
        }, index);

        if (images[index]) {
            tl.to(images[index], {
                opacity: 1,
                duration: STEP_DURATION,
            }, index);
        } else {
            // Keeps every step occupying the same timeline space
            tl.to({}, { duration: STEP_DURATION }, position);
        }

        const hiddenItem = item.querySelector(hiddenItemSelector);
        const hiddenItemHeight = hiddenItem?.scrollHeight || 0;

        if (hiddenItem) {
            gsap.set(hiddenItem, { height: 0 });

            tl.to(hiddenItem, {
                opacity: 1,
                height: hiddenItemHeight,
                duration: 0,
            }, index);
        }

        const prevItem = items[index - 1] || null;

        if (prevItem) {
            tl.to(prevItem ?? {}, {
                opacity: '',
                color: '',
                duration: 0,
            }, index);
        }

        const hiddenPrevItem = prevItem?.querySelector(hiddenItemSelector);
        if (hiddenPrevItem) {
            tl.to(hiddenPrevItem ?? {}, {
                opacity: 0,
                height: 0,
                duration: 0,
            }, index);
        }
    });
}
