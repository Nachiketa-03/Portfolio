/* ============================================================
   NACHIKETA KUMAR — PORTFOLIO SCRIPTS (Enhanced)
   ============================================================ */

(() => {
    'use strict';

    // ── CURSOR GLOW (smooth lerp) ─────────────────────────────
    const glow = document.getElementById('cursorGlow');
    let mx = 0, my = 0, gx = 0, gy = 0;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    (function animGlow() {
        gx += (mx - gx) * 0.08;
        gy += (my - gy) * 0.08;
        glow.style.left = gx + 'px';
        glow.style.top = gy + 'px';
        requestAnimationFrame(animGlow);
    })();

    if ('ontouchstart' in window) glow.style.display = 'none';

    // ── PARTICLES ─────────────────────────────────────────────
    const pCon = document.getElementById('particles');
    const colors = ['#D4A843', '#F0CA5A', '#5B9BD5', '#7BB8F0', '#A0AAC0'];

    for (let i = 0; i < 35; i++) {
        const d = document.createElement('div');
        d.classList.add('particle');
        const sz = Math.random() * 4 + 1.5;
        d.style.width  = sz + 'px';
        d.style.height = sz + 'px';
        d.style.left   = Math.random() * 100 + '%';
        d.style.background = colors[Math.floor(Math.random() * colors.length)];
        d.style.animationDuration = (Math.random() * 28 + 14) + 's';
        d.style.animationDelay    = (Math.random() * 28) + 's';
        pCon.appendChild(d);
    }

    // ── NAVBAR ─────────────────────────────────────────────────
    const navbar    = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // ── ACTIVE NAV HIGHLIGHT ──────────────────────────────────
    const sections = document.querySelectorAll('section[id]');

    // ── SCROLL PROGRESS BAR ───────────────────────────────────
    const scrollProgress = document.getElementById('scrollProgress');

    // ── HERO PARALLAX ─────────────────────────────────────────
    const heroBg = document.querySelector('.hero-bg');
    const heroContent = document.querySelector('.hero-content');

    // ── SCROLL TO TOP BUTTON ──────────────────────────────────
    const scrollBtn = document.getElementById('scrollTop');

    // ── COMBINED SCROLL HANDLER (single rAF for all scroll effects) ──
    let scrollTicking = false;

    function onScroll() {
        if (scrollTicking) return;
        scrollTicking = true;
        requestAnimationFrame(() => {
            const sy = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;

            // Navbar shrink
            navbar.classList.toggle('scrolled', sy > 50);

            // Scroll progress bar
            if (scrollProgress && docHeight > 0) {
                const progress = Math.min(sy / docHeight, 1);
                scrollProgress.style.transform = `scaleX(${progress})`;
            }

            // Hero parallax
            if (heroBg && sy < window.innerHeight * 1.2) {
                heroBg.style.transform = `scale(${1 + sy * 0.00008}) translateY(${sy * 0.25}px)`;
                if (heroContent) {
                    heroContent.style.opacity = Math.max(1 - sy / (window.innerHeight * 0.6), 0);
                    heroContent.style.transform = `translateY(${sy * 0.35}px)`;
                }
            }

            // Active nav highlight
            const scrollPos = sy + 150;
            sections.forEach(s => {
                const link = document.querySelector(`.nav-links a[href="#${s.id}"]`);
                if (link) {
                    link.classList.toggle('active',
                        scrollPos >= s.offsetTop && scrollPos < s.offsetTop + s.offsetHeight);
                }
            });

            // Scroll-to-top button
            if (scrollBtn) {
                scrollBtn.classList.toggle('visible', sy > 500);
            }

            scrollTicking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // ── TYPING EFFECT ─────────────────────────────────────────
    const phrases = [
        'AWS Certified Cloud Practitioner ☁️',
        'AWS Solutions Architect Associate 🏗️',
        'Full-Stack Web Developer 🚀',
        'Machine Learning Engineer 🧠',
        'National Volleyball Player 🏐'
    ];
    const typedEl = document.getElementById('typedText');
    let phraseIdx = 0, charIdx = 0, deleting = false;

    (function type() {
        const current = phrases[phraseIdx];
        typedEl.innerHTML = current.substring(0, charIdx) +
            '<span class="cursor-blink"></span>';

        if (!deleting) {
            charIdx++;
            if (charIdx > current.length) {
                deleting = true;
                setTimeout(type, 2400);
                return;
            }
        } else {
            charIdx--;
            if (charIdx < 0) {
                deleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                charIdx = 0;
                setTimeout(type, 500);
                return;
            }
        }
        setTimeout(type, deleting ? 22 : 50);
    })();

    // ── SCROLL REVEAL (enhanced with rootMargin & blur) ───────
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('active');
                // Once revealed, stop observing for performance
                revealObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.06, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
        .forEach(el => revealObserver.observe(el));

    // ── COUNT UP (smooth easeOutExpo) ─────────────────────────
    const countObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting && !e.target.dataset.done) {
                e.target.dataset.done = '1';
                const target   = parseFloat(e.target.dataset.target);
                const decimal  = e.target.dataset.decimal === 'true';
                const suffix   = e.target.dataset.suffix || '';
                const duration = 2200;
                const start    = performance.now();

                (function update(now) {
                    const progress = Math.min((now - start) / duration, 1);
                    // easeOutExpo for snappy start, smooth finish
                    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    e.target.textContent = (decimal
                        ? (eased * target).toFixed(1)
                        : Math.floor(eased * target)) + suffix;
                    if (progress < 1) requestAnimationFrame(update);
                })(start);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.count-up').forEach(el => countObserver.observe(el));

    // ── 3D TILT (smoother with rAF) ───────────────────────────
    document.querySelectorAll('.tilt').forEach(card => {
        let tiltRAF = null;
        card.addEventListener('mousemove', e => {
            if (tiltRAF) cancelAnimationFrame(tiltRAF);
            tiltRAF = requestAnimationFrame(() => {
                const r  = card.getBoundingClientRect();
                const rx = ((e.clientY - r.top)  - r.height / 2) / (r.height / 2) * -5;
                const ry = ((e.clientX - r.left) - r.width  / 2) / (r.width  / 2) *  5;
                card.style.transition = 'transform 0.15s ease-out';
                card.style.transform =
                    `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
            });
        });
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.3, 0.64, 1)';
            card.style.transform = '';
        });
    });

    // ── SMOOTH SCROLL (custom easeInOutCubic) ─────────────────
    function smoothScrollTo(targetEl) {
        const targetY = targetEl.getBoundingClientRect().top + window.scrollY - 80;
        const startY  = window.scrollY;
        const diff    = targetY - startY;
        const duration = Math.min(Math.max(Math.abs(diff) * 0.6, 400), 1200);
        const start   = performance.now();

        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        (function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeInOutCubic(progress);
            window.scrollTo(0, startY + diff * eased);
            if (progress < 1) requestAnimationFrame(step);
        })(start);
    }

    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) smoothScrollTo(target);
        });
    });

    // ── SCROLL TO TOP ─────────────────────────────────────────
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            const startY  = window.scrollY;
            const duration = Math.min(startY * 0.5, 1000);
            const start   = performance.now();

            function easeOutExpo(t) {
                return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            }

            (function step(now) {
                const progress = Math.min((now - start) / duration, 1);
                window.scrollTo(0, startY * (1 - easeOutExpo(progress)));
                if (progress < 1) requestAnimationFrame(step);
            })(start);
        });
    }

    // ── BUTTON HOVER LIGHT TRACKING ───────────────────────────
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            btn.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
            btn.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
        });
    });

})();
