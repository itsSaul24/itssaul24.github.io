document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (!menuToggle || !mobileNav) return;

    function closeMenu() {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    function openMenu() {
        menuToggle.classList.add('active');
        mobileNav.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
    }

    menuToggle.addEventListener('click', function() {
        const isOpen = mobileNav.classList.toggle('active');
        menuToggle.classList.toggle('active', isOpen);
        menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('nav')) {
            closeMenu();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });
});
