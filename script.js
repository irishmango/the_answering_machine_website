// Device detection: flag mobile vs desktop and expose helpers
(function () {
    function isMobileDevice() {
        try {
            // Chromium User-Agent Client Hints
            if (navigator.userAgentData && typeof navigator.userAgentData.mobile === 'boolean') {
                return navigator.userAgentData.mobile;
            }
        } catch (_) { /* noop */ }

        // Fallback to UA sniffing
        const ua = (navigator.userAgent || navigator.vendor || window.opera || '').toLowerCase();
        const uaMobile = /android|iphone|ipad|ipod|blackberry|bb10|silk|kindle|iemobile|opera mini|mobile/i.test(ua);

        // Touch capability & iPadOS detection (avoid deprecated navigator.platform)
        const touchPoints = (navigator.maxTouchPoints || 0);
        const hasTouchStart = 'ontouchstart' in window;
        // iPadOS Safari often reports a Macintosh-like UA; combine with touch points to detect
        const isIpadOSLike = /macintosh|mac os x/i.test(ua) && touchPoints > 1;

        // Heuristic: coarse pointer devices are often mobile/tablets
        const coarse = typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;

        // Width-based soft fallback (helps DevTools emulation without UA/touch hints)
        const vw = Math.min(window.innerWidth, window.innerHeight);
        const smallViewport = vw <= 820; // covers most tablets in portrait and all phones

        return uaMobile || isIpadOSLike || coarse || touchPoints > 0 || hasTouchStart || smallViewport;
    }

    function flagDevice() {
        const mobile = isMobileDevice();
        document.documentElement.classList.toggle('is-mobile', mobile);
        document.documentElement.classList.toggle('is-desktop', !mobile);
        document.documentElement.dataset.device = mobile ? 'mobile' : 'desktop';
        window.IS_MOBILE = mobile;
        return mobile;
    }

    // Initial flag + lightweight updates on viewport changes
    flagDevice();
    let t;
    window.addEventListener('resize', () => {
        clearTimeout(t);
        t = setTimeout(flagDevice, 150);
    });
    window.addEventListener('orientationchange', flagDevice);

    // Optional export
    window.isMobileDevice = isMobileDevice;
})();

// Back to Top Button (avoid overlapping footer)
(function () {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    const footer = document.querySelector('.site-footer');
    const BASE_BOTTOM = 20; // px
    const BASE_RIGHT = 30; // px

    function updateBackToTop() {
        // Toggle visibility
        if (window.scrollY > window.innerHeight * 0.8) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }

        // Default fixed placement
        backToTop.style.position = 'fixed';
        backToTop.style.right = BASE_RIGHT + 'px';

        // If footer is visible, push the button up so it never overlaps
        let bottom = BASE_BOTTOM;
        if (footer) {
            const rect = footer.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                const overlap = Math.max(0, window.innerHeight - rect.top);
                bottom = BASE_BOTTOM + overlap;
            }
        }
        backToTop.style.bottom = bottom + 'px';
    }

    window.addEventListener('scroll', updateBackToTop);
    window.addEventListener('resize', updateBackToTop);
    // Initial position
    updateBackToTop();

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// Mobile hamburger menu
(function () {
    const menu = document.querySelector('.menu');
    const toggleBtn = document.getElementById('menuToggle');
    const links = document.querySelectorAll('.menu-links a');
    if (!menu || !toggleBtn) return;

    const closeMenu = () => {
        menu.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
    };
    const openMenu = () => {
        menu.classList.add('open');
        toggleBtn.setAttribute('aria-expanded', 'true');
        document.body.classList.add('menu-open');
    };
    const toggleMenu = () => {
        if (menu.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close on link click
    links.forEach((a) => a.addEventListener('click', closeMenu));

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    // Close if clicking outside
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target)) closeMenu();
    });
})();
