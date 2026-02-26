'use client';

import { useEffect } from 'react';

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

export default function XfolioScripts() {
    useEffect(() => {
        const scripts = [
            '/assets/js/jquery-3.7.1.min.js',
            '/assets/js/bootstrap.bundle.min.js',
            '/assets/js/jquery.nice-select.min.js',
            '/assets/js/jquery.magnific-popup.min.js',
            '/assets/js/swiper-bundle.min.js',
            '/assets/js/viewport.jquery.js',
            '/assets/js/odometer.min.js',
            '/assets/js/vanilla-tilt.min.js',
            '/assets/js/phosphor-icon.js',
            '/assets/js/ScrollTrigger.min.js',
            '/assets/js/SplitText.min.js',
            '/assets/js/ScrollToPlugin.min.js',
            '/assets/js/gsap.min.js',
            '/assets/js/chroma.min.js',
            '/assets/js/main.js',
        ];

        let cancelled = false;

        (async () => {
            for (const src of scripts) {
                if (cancelled) break;
                try {
                    await loadScript(src);
                } catch (e) {
                    console.warn('Failed to load script:', src, e);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    return null;
}
