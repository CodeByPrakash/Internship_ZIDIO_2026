import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initSmoothScroll, initCinematicScroll, initMagneticHover, cleanupMotion } from '../../lib/motion';

interface MotionProviderProps {
    children: React.ReactNode;
}

export const MotionProvider: React.FC<MotionProviderProps> = ({ children }) => {
    const location = useLocation();

    useEffect(() => {
        // 1. Initialize Lenis Smooth Scroll
        initSmoothScroll();

        // 2. Initialize Cinematic ScrollTriggers
        const timer = setTimeout(() => {
            initCinematicScroll();
            initMagneticHover();
        }, 120);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    // Re-run triggers and scroll to top on route changes
    useEffect(() => {
        window.scrollTo(0, 0);
        const timer = setTimeout(() => {
            initCinematicScroll();
            initMagneticHover();
        }, 150);

        return () => {
            clearTimeout(timer);
        };
    }, [location.pathname]);

    useEffect(() => {
        return () => {
            cleanupMotion();
        };
    }, []);

    return <>{children}</>;
};
