// FediMTL - Main JavaScript

(function() {
    'use strict';

    // ===== Development Overlay =====
    const devOverlay = document.getElementById('dev-overlay');
    const acceptButton = document.getElementById('accept-overlay');

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function setCookie(name, value, hours) {
        const date = new Date();
        date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
        document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
    }

    if (devOverlay) {
        // Check if user has already accepted within the last 24 hours
        if (getCookie('fedimtl-dev-accepted')) {
            devOverlay.classList.add('hidden');
        }

        if (acceptButton) {
            acceptButton.addEventListener('click', function() {
                devOverlay.classList.add('hidden');
                setCookie('fedimtl-dev-accepted', 'true', 24);
            });
        }
    }

    // ===== Language Toggle =====
    const html = document.documentElement;
    const langToggle = document.getElementById('lang-toggle');

    // Get saved language preference or detect browser language
    function getInitialLanguage() {
        // Check localStorage first
        const savedLang = localStorage.getItem('fedimtl-lang');
        if (savedLang) {
            return savedLang;
        }

        // Detect browser language
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('fr')) {
            return 'fr';
        }

        return 'en'; // Default to English
    }

    // Set initial language
    const initialLang = getInitialLanguage();
    html.setAttribute('lang', initialLang);

    // Language toggle click handler
    if (langToggle) {
        langToggle.addEventListener('click', function() {
            const currentLang = html.getAttribute('lang');
            const newLang = currentLang === 'en' ? 'fr' : 'en';

            html.setAttribute('lang', newLang);
            localStorage.setItem('fedimtl-lang', newLang);

            // Announce to screen readers
            const announcement = newLang === 'en' ? 'Language changed to English' : 'Langue changée en français';
            announceToScreenReader(announcement);
        });
    }

    // ===== Smooth Scroll =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#" (register button placeholder)
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();

                // Get header height for offset
                const header = document.querySelector('.site-header');
                const headerHeight = header ? header.offsetHeight : 0;

                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL hash to trigger :target CSS selector
                history.pushState(null, null, href);

                // Apply targeting behavior only to schedule and speaker links
                if (href.startsWith('#schedule-') || href.startsWith('#speaker-')) {
                    target.classList.add('targeted');
                    setTimeout(() => {
                        target.classList.remove('targeted');
                        // Clear the hash to remove :target styling
                        const scrollPos = window.scrollY;
                        window.location.hash = '';
                        window.scrollTo(0, scrollPos);
                    }, 3000);
                }
            }
        });
    });

    // ===== Handle Direct Hash Links =====
    // If page loads with a schedule or speaker hash, clear it after 3 seconds
    function clearTargetedElement() {
        const hash = window.location.hash;
        if (hash && (hash.startsWith('#schedule-') || hash.startsWith('#speaker-'))) {
            const target = document.querySelector(hash);
            if (target) {
                target.classList.add('targeted');
                setTimeout(() => {
                    target.classList.remove('targeted');
                    // Remove hash and force :target to clear
                    const scrollPos = window.scrollY;
                    window.location.hash = '';
                    window.scrollTo(0, scrollPos);
                }, 3000);
            }
        }
    }
    clearTargetedElement();

    // ===== Clickable Speaker Cards =====
    document.querySelectorAll('.speaker-card').forEach(card => {
        const link = card.querySelector('.speaker-name a');
        if (link) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function(e) {
                // Don't trigger if clicking the link itself (let it handle naturally)
                if (e.target.tagName === 'A' || e.target.closest('a')) {
                    return;
                }
                link.click();
            });
        }
    });

    // ===== Mobile Menu Toggle (if needed in future) =====
    // Placeholder for mobile menu functionality

    // ===== Scroll Effects =====
    let lastScrollTop = 0;
    const header = document.querySelector('.site-header');

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add shadow to header when scrolled
        if (scrollTop > 10) {
            header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }

        lastScrollTop = scrollTop;
    });

    // ===== Form Handling (for future use) =====
    // Placeholder for contact form or newsletter signup

    // ===== Accessibility Helper =====
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = message;

        document.body.appendChild(announcement);

        // Remove after announcement
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Add sr-only class to CSS if not already present
    if (!document.querySelector('.sr-only')) {
        const style = document.createElement('style');
        style.textContent = `
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border-width: 0;
            }
        `;
        document.head.appendChild(style);
    }

    // ===== Analytics (placeholder) =====
    // Add your analytics code here

    // ===== Console Message =====
    console.log('%c FediMTL ', 'background: #667eea; color: white; padding: 10px; font-size: 16px; font-weight: bold;');
    console.log('Building connections in the decentralized web');
    console.log('Current language:', html.getAttribute('lang'));

})();
