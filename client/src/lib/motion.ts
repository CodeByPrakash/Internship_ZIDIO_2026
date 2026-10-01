import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: 'power3.out', duration: 0.85 });

let lenisInstance: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;

export const getLenis = () => lenisInstance;

/**
 * Initializes Lenis smooth scroll and coordinates with GSAP ScrollTrigger
 */
export const initSmoothScroll = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || typeof window === 'undefined') {
        return null;
    }

    if (lenisInstance) {
        lenisInstance.destroy();
    }

    lenisInstance = new Lenis({
        lerp: 0.08,
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.5,
    });

    lenisInstance.on('scroll', ScrollTrigger.update);

    if (tickerCallback) {
        gsap.ticker.remove(tickerCallback);
    }

    tickerCallback = (time: number) => {
        lenisInstance?.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return lenisInstance;
};

/**
 * Initializes cinematic ScrollTrigger animations across elements
 */
export const initCinematicScroll = (container?: HTMLElement | Document | null) => {
    const root = container || document;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    // 1. Batched Fade-Up Cards & Elements
    const revealItems = root.querySelectorAll('[data-reveal="fade-up"], .gsap-reveal-card, [data-reveal-item]');
    if (revealItems.length > 0) {
        ScrollTrigger.batch(revealItems, {
            interval: 0.08,
            batchMax: 6,
            start: 'top 85%',
            onEnter: (batch) => {
                gsap.fromTo(
                    batch,
                    { opacity: 0, y: 32 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.85,
                        stagger: 0.08,
                        ease: 'power3.out',
                        overwrite: 'auto',
                    }
                );
            },
        });
    }

    // 2. Headings & Hero Staggered Text
    const heroTexts = root.querySelectorAll('[data-motion-text="lines"]');
    heroTexts.forEach((el) => {
        gsap.fromTo(
            el,
            { opacity: 0, y: 24, filter: 'blur(4px)' },
            {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 1.1,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    toggleActions: 'play none none none',
                },
            }
        );
    });

    // 3. Parallax Floating Elements
    const parallaxItems = root.querySelectorAll('[data-parallax="float"]');
    parallaxItems.forEach((el) => {
        gsap.to(el, {
            y: -40,
            ease: 'none',
            scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2,
            },
        });
    });

    // 4. Subtle Glow Accents Movement
    const glowBgs = root.querySelectorAll('.glow-ambient-bg');
    glowBgs.forEach((glow) => {
        gsap.to(glow, {
            y: 80,
            scale: 1.08,
            ease: 'none',
            scrollTrigger: {
                trigger: glow.parentElement || glow,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5,
            },
        });
    });

    ScrollTrigger.refresh();
};

/**
 * Initializes magnetic pull on interactive buttons
 */
export const initMagneticHover = (selector = '[data-magnetic]') => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
        const target = el as HTMLElement;

        const onMouseMove = (e: MouseEvent) => {
            const rect = target.getBoundingClientRect();
            const relX = e.clientX - rect.left - rect.width / 2;
            const relY = e.clientY - rect.top - rect.height / 2;

            gsap.to(target, {
                x: relX * 0.25,
                y: relY * 0.25,
                duration: 0.35,
                ease: 'power3.out',
            });
        };

        const onMouseLeave = () => {
            gsap.to(target, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'power3.out',
            });
        };

        target.addEventListener('mousemove', onMouseMove);
        target.addEventListener('mouseleave', onMouseLeave);
    });
};

/**
 * Destroy & Cleanup smooth scroll and ScrollTriggers
 */
export const cleanupMotion = () => {
    if (tickerCallback) {
        gsap.ticker.remove(tickerCallback);
        tickerCallback = null;
    }
    if (lenisInstance) {
        lenisInstance.destroy();
        lenisInstance = null;
    }
    ScrollTrigger.getAll().forEach((t) => t.kill());
};
