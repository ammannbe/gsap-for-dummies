// !!! DON'T USE CDN IN PRODUCTION !!!
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.14.2/index.js";
// import { gsap } from 'gsap';

import { initCanvas3d } from './canvas3d/canvas3d.js';
import { initHorizontalScrolling } from './horizontal-scrolling/horizontal-scrolling.js';
import { resetStickyScroll, initStickyScroll } from './sticky-scroll/sticky-scroll.js';
import { initSlideinStagger } from './slidein-stagger/slidein-stagger.js';



(function () {
    document.querySelectorAll('[data-gsap]').forEach((container, i) => {
        if (container.dataset.gsap === 'x-scroll') {
            const wrapper = container.querySelector('[data-gsap-x-scroll="wrapper"]');
            const content = container.querySelector('[data-gsap-x-scroll="content"]');
            const reverse = container.dataset.gsapXScrollReverse !== undefined;

            const indicator = container.querySelector('[data-gsap-x-scroll="indicator"]');
            const thumb = container.querySelector('[data-gsap-x-scroll="thumb"]');

            initHorizontalScrolling(container, wrapper, content, reverse, { indicator, thumb });
        } else if (container.dataset.gsap === 'sticky-scroll') {
            const content = container.querySelector('[data-gsap-sticky-scroll="content"]');


            const canvas = container.querySelector('[data-gsap-canvas3d="canvas"]');
            if (canvas) {
                const options = JSON.parse(container.dataset.gsapCanvas3dOptions ?? '{}');

                initCanvas3d(container, content, canvas, options);
            }


            const items = content.querySelectorAll('[data-gsap-sticky-scroll="content"] > *');
            const images = container.querySelectorAll('[data-gsap-sticky-scroll="images"] > *');
            const hiddenItemSelector = '[data-gsap-sticky-scroll="hidden"]';
            const options = JSON.parse(container.dataset.gsapStickyScrollOptions ?? '{}');

            const mm = gsap.matchMedia();

            // Only enable on screens larger than 1000px
            mm.add('(min-width: 1001px)', () => {
                initStickyScroll(container, content, items, images, hiddenItemSelector, options);

                return () => resetStickyScroll(container, content, items, images, hiddenItemSelector);
            });
        } else if (container.dataset.gsap === 'canvas3d') {
            const container = document.querySelector('[data-gsap="canvas3d"]');
            const content = container.querySelector('[data-gsap-canvas3d="content"]');
            const canvas = container.querySelector('[data-gsap-canvas3d="canvas"]');
            const options = JSON.parse(container.dataset.gsapCanvas3dOptions ?? '{}');

            initCanvas3d(container, content, canvas, options);
        } else if (container.dataset.gsap === 'slidein') {
            const items = container.querySelectorAll('[data-gsap-slidein="content"] > *');
            const options = JSON.parse(container.dataset.gsapSlideinOptions ?? '{}');

            initSlideinStagger(container, items, options);
        } else if (container.dataset.gsap === 'pagetransition') {
            initPagetransition(container);
        }
    });
})();
