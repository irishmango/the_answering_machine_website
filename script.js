// Back to Top Button
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight * 0.8) {
        backToTop.style.display = 'block';
    } else {
        backToTop.style.display = 'none';
    }
});
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Mobile hamburger menu
(function () {
    const menu = document.querySelector('.menu');
    const toggleBtn = document.getElementById('menuToggle');
    const links = document.querySelectorAll('.menu-links a');
    if (!menu || !toggleBtn) return;

    const closeMenu = () => {
        menu.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
    };
    const openMenu = () => {
        menu.classList.add('open');
        toggleBtn.setAttribute('aria-expanded', 'true');
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
