/**
 * Giuliana & La Greca - Main JavaScript
 * Smooth scroll, navbar, animazioni IntersectionObserver, mobile menu, form validation
 */

(function () {
    'use strict';

    // ========== NAVBAR SCROLL BEHAVIOR ==========

    var header = document.getElementById('header');
    var scrollThreshold = 80;

    function handleNavbarScroll() {
        if (!header) return;
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll(); // Stato iniziale

    // ========== MOBILE MENU ==========

    var hamburger = document.getElementById('hamburger');
    var navLinks = document.getElementById('navLinks');

    function toggleMobileMenu() {
        if (!hamburger || !navLinks) return;
        var isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMobileMenu() {
        if (!hamburger || !navLinks) return;
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Chiudi menu quando si clicca un link
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // Chiudi menu con Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
            closeMobileMenu();
        }
    });

    // ========== SMOOTH SCROLL ==========

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            var navHeight = header ? header.offsetHeight : 0;
            var targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // ========== ACTIVE LINK HIGHLIGHT ==========

    var sections = document.querySelectorAll('section[id]');
    var navLinkElements = document.querySelectorAll('.nav-links a[href^="#"]');

    function updateActiveLink() {
        var scrollPosition = window.scrollY + 150;

        sections.forEach(function (section) {
            var sectionTop = section.offsetTop;
            var sectionHeight = section.offsetHeight;
            var sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinkElements.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();

    // ========== INTERSECTION OBSERVER - FADE IN ANIMATIONS ==========

    var animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        animatedElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        // Fallback: mostra tutto subito
        animatedElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    // ========== CONTACT FORM VALIDATION ==========

    var contactForm = document.getElementById('contactForm');
    var formSuccess = document.getElementById('formSuccess');

    function validateEmail(email) {
        if (!email) return true; // Email è opzionale
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone) {
        // Accetta formati comuni italiani
        return /^[\d\s\+\-()]{6,20}$/.test(phone.trim());
    }

    function showFieldError(fieldId, show) {
        var group = document.getElementById(fieldId);
        if (!group) return;
        var formGroup = group.closest('.form-group');
        if (formGroup) {
            if (show) {
                formGroup.classList.add('error');
            } else {
                formGroup.classList.remove('error');
            }
        }
    }

    function showCheckboxError(show) {
        var checkbox = document.getElementById('privacyCheckbox');
        if (checkbox) {
            if (show) {
                checkbox.classList.add('error');
            } else {
                checkbox.classList.remove('error');
            }
        }
    }

    if (contactForm) {
        // Rimuovi errore al focus
        contactForm.querySelectorAll('input, textarea').forEach(function (field) {
            field.addEventListener('focus', function () {
                var formGroup = this.closest('.form-group');
                if (formGroup) formGroup.classList.remove('error');
            });
        });

        var privacyCheckbox = document.getElementById('privacy');
        if (privacyCheckbox) {
            privacyCheckbox.addEventListener('change', function () {
                showCheckboxError(false);
            });
        }

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var nome = document.getElementById('nome');
            var telefono = document.getElementById('telefono');
            var email = document.getElementById('email');
            var messaggio = document.getElementById('messaggio');
            var privacy = document.getElementById('privacy');

            var isValid = true;

            // Valida nome
            if (!nome.value.trim()) {
                showFieldError('nome', true);
                isValid = false;
            } else {
                showFieldError('nome', false);
            }

            // Valida telefono
            if (!telefono.value.trim() || !validatePhone(telefono.value)) {
                showFieldError('telefono', true);
                isValid = false;
            } else {
                showFieldError('telefono', false);
            }

            // Valida email (opzionale ma se inserita deve essere valida)
            if (email.value.trim() && !validateEmail(email.value.trim())) {
                showFieldError('email', true);
                isValid = false;
            } else {
                showFieldError('email', false);
            }

            // Valida messaggio
            if (!messaggio.value.trim()) {
                showFieldError('messaggio', true);
                isValid = false;
            } else {
                showFieldError('messaggio', false);
            }

            // Valida privacy
            if (!privacy.checked) {
                showCheckboxError(true);
                isValid = false;
            } else {
                showCheckboxError(false);
            }

            if (!isValid) return;

            // Form valido - apri client email con i dati compilati
            var subject = encodeURIComponent('Richiesta dal sito web - ' + nome.value.trim());
            var body = encodeURIComponent(
                'Nome: ' + nome.value.trim() + '\n' +
                'Telefono: ' + telefono.value.trim() + '\n' +
                'Email: ' + (email.value.trim() || 'Non specificata') + '\n\n' +
                'Messaggio:\n' + messaggio.value.trim()
            );

            window.location.href = 'mailto:info@giulianalagreca.it?subject=' + subject + '&body=' + body;

            // Mostra messaggio di successo
            contactForm.style.display = 'none';
            if (formSuccess) formSuccess.style.display = 'block';

            // Reset dopo 5 secondi
            setTimeout(function () {
                contactForm.reset();
                contactForm.style.display = 'block';
                if (formSuccess) formSuccess.style.display = 'none';
            }, 5000);
        });
    }

})();
