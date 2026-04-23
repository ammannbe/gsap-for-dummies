document.addEventListener('DOMContentLoaded', () => {
    barba.init({
        prevent({ el }) {
            if (el.target === '_blank') return true;
            if (el.hasAttribute('data-fancybox')) return true;

            const href = el.getAttribute('href') || '';
            if (href.startsWith('tel:')) return true;
            if (href.startsWith('mailto:')) return true;

            return false;
        },
        transitions: [{
            // lifecycle https://barba.js.org/docs/getstarted/lifecycle/
            // before -> beforeLeave -> leave -> afterLeave | beforeEnter -> enter -> afterEnter | after
            name: 'base',
            beforeLeave(data) {
                console.log('1. beforeLeave')
                return gsap.to('[data-barba-transition]', {
                    top: data.event.clientY,
                    left: data.event.clientX,
                });
            },
            leave(data) {
                console.log('2. leave')
                return gsap.to('[data-barba-transition]', {
                    scale: 1,
                    duration: 1,
                    ease: "power3.inOut",
                });
            },
            afterEnter(data) {
                console.log('3. afterEnter')
                window.scrollTo(0, 0);
                document.body.removeAttribute('data-overflow');
                document.body.style.removeProperty('overflow');
            },
            after(data) {
                console.log('4. after')
                return gsap.to('[data-barba-transition]', {
                    scale: 0,
                    duration: 1,
                    ease: "power3.inOut",
                });
            },
        }]
    });



    barba.hooks.after(() => {
        console.log('after: ' + window.location.pathname);
    });
});
