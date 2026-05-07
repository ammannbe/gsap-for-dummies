// !!! DON'T USE CDN IN PRODUCTION !!!
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.14.2/index.js";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.14.2/ScrollTrigger.js";
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


/**
 * Initializes a pinned horizontal scrolling animation using GSAP ScrollTrigger.
 *
 * Pins the container during vertical scrolling and translates the content
 * horizontally based on the difference between the content width and the wrapper
 * width. Optionally supports a custom draggable scrollbar/thumb that both reflects
 * scroll progress and can control the page scroll position.
 *
 * @param {HTMLElement} container - The outer wrapper that acts as the scroll trigger and pinned section.
 * @param {HTMLElement} wrapper - The visible viewport element used to calculate the available horizontal space.
 * @param {HTMLElement} content - The inner element that is translated horizontally during scrolling.
 * @param {boolean} reverse - Whether to translate the content in the opposite horizontal direction.
 * @param {Object} [options={}] - Optional custom scrollbar configuration.
 * @param {HTMLElement} [options.indicator] - The scrollbar track element.
 * @param {HTMLElement} [options.thumb] - The draggable scrollbar thumb element.
 *
 * @returns {void}
 */
export function initHorizontalScrolling(container, wrapper, content, reverse, { indicator = null, thumb = null } = {}) {
    const contentScrollWidth = content.scrollWidth;
    const wrapperClientWidth = wrapper.clientWidth;
    const position = () => Math.max(0, contentScrollWidth - wrapperClientWidth);


    const thumbMaxX = () => indicator?.clientWidth - thumb?.clientWidth;
    let isDragging = false;
    let startPointerX = 0;
    let startThumbX = 0;


    const xTween = gsap.to(content, {
        x: () => position() * (reverse ? 1 : -1),
        ease: 'none',
        scrollTrigger: {
            trigger: container,
            pin: true,
            scrub: 1,
            start: 'top top',
            end: () => '+=' + position(),
            invalidateOnRefresh: true,
            markers: true,
            onUpdate(self) {
                if (thumb && !isDragging) {
                    gsap.set(thumb, { x: self.progress * thumbMaxX() });
                }
            },
        }
    });


    if (indicator && thumb) {
        const xTweenTrigger = xTween.scrollTrigger;

        function updateScrollFromThumb(x) {
            const progress = gsap.utils.clamp(0, 1, x / thumbMaxX());
            const scrollY = xTweenTrigger.start + progress * (xTweenTrigger.end - xTweenTrigger.start);

            window.scrollTo({
                top: scrollY,
                behavior: 'auto'
            });
        }

        function toggleDragging(dragging = true) {
            isDragging = dragging;
            isDragging
                ? thumb.classList.add('dragging')
                : thumb.classList.remove('dragging');
        }

        thumb.addEventListener('pointerdown', (event) => {
            toggleDragging(true);
            startPointerX = event.clientX;
            startThumbX = gsap.getProperty(thumb, 'x');

            thumb.setPointerCapture(event.pointerId);
            event.preventDefault();
        });

        thumb.addEventListener('pointermove', (event) => {
            if (!isDragging) return;

            const deltaX = event.clientX - startPointerX;
            const nextX = gsap.utils.clamp(0, thumbMaxX(), startThumbX + deltaX);

            gsap.set(thumb, { x: nextX });
            updateScrollFromThumb(nextX);
        });

        thumb.addEventListener('pointerup', () => toggleDragging(false));
        thumb.addEventListener('pointercancel', () => toggleDragging(false));
        thumb.addEventListener('pointerleave', () => toggleDragging(false));

        indicator.addEventListener('pointerdown', (event) => {
            if (event.target === thumb) return;

            const rect = indicator.getBoundingClientRect();
            const x = event.clientX - rect.left - thumb.clientWidth / 2;
            const nextX = gsap.utils.clamp(0, thumbMaxX(), x);

            gsap.set(thumb, { x: nextX });
            updateScrollFromThumb(nextX);
        });
    }
}
