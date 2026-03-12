/**
 * Giuliana & La Greca - Cookie Consent GDPR
 * Gestione banner cookie, preferenze e caricamento condizionale servizi terze parti
 */

(function () {
    'use strict';

    const COOKIE_KEY = 'gl_cookie_consent';
    const COOKIE_EXPIRY_DAYS = 180; // 6 mesi

    const banner = document.getElementById('cookieBanner');
    const modalOverlay = document.getElementById('cookieModalOverlay');
    const thirdPartyToggle = document.getElementById('cookieThirdParty');

    // Buttons
    const btnAcceptAll = document.getElementById('cookieAcceptAll');
    const btnNecessary = document.getElementById('cookieNecessary');
    const btnSettings = document.getElementById('cookieSettings');
    const btnModalReject = document.getElementById('cookieModalReject');
    const btnModalSave = document.getElementById('cookieModalSave');

    /**
     * Ottieni le preferenze salvate
     */
    function getConsent() {
        try {
            const stored = localStorage.getItem(COOKIE_KEY);
            if (!stored) return null;

            const consent = JSON.parse(stored);
            // Verifica scadenza
            if (consent.expiry && Date.now() > consent.expiry) {
                localStorage.removeItem(COOKIE_KEY);
                return null;
            }
            return consent;
        } catch {
            return null;
        }
    }

    /**
     * Salva le preferenze
     */
    function saveConsent(thirdParty) {
        const consent = {
            technical: true, // Sempre attivi
            thirdParty: thirdParty,
            expiry: Date.now() + COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
    }

    /**
     * Mostra il banner
     */
    function showBanner() {
        if (banner) {
            // Piccolo delay per l'animazione
            setTimeout(function () {
                banner.classList.add('show');
            }, 1000);
        }
    }

    /**
     * Nascondi il banner
     */
    function hideBanner() {
        if (banner) {
            banner.classList.remove('show');
        }
    }

    /**
     * Mostra il modal di personalizzazione
     */
    function showModal() {
        if (modalOverlay) {
            modalOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Nascondi il modal
     */
    function hideModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    /**
     * Carica Google Maps se il consenso è dato
     */
    function loadGoogleMaps() {
        var mapContainer = document.getElementById('mapContainer');
        var mapPlaceholder = document.getElementById('mapPlaceholder');
        if (!mapContainer || !mapPlaceholder) return;

        var iframe = document.createElement('iframe');
        iframe.src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3170.0!2d13.9159!3d37.2614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1311b0c9b8b0b0b1%3A0x0!2sVia+Crispi+7%2C+92023+Campobello+di+Licata+AG!5e0!3m2!1sit!2sit!4v1700000000000!5m2!1sit!2sit';
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.style.border = 'none';
        iframe.loading = 'lazy';
        iframe.referrerPolicy = 'no-referrer-when-downgrade';
        iframe.setAttribute('allowfullscreen', '');
        iframe.title = 'Google Maps - Giuliana & La Greca, Via Crispi 7, Campobello di Licata';

        mapPlaceholder.style.display = 'none';
        mapContainer.appendChild(iframe);
    }

    /**
     * Mostra placeholder mappa (se cookie rifiutati)
     */
    function showMapPlaceholder() {
        var mapPlaceholder = document.getElementById('mapPlaceholder');
        if (mapPlaceholder) {
            mapPlaceholder.style.display = 'flex';
        }
        // Rimuovi eventuali iframe esistenti
        var mapContainer = document.getElementById('mapContainer');
        if (mapContainer) {
            var existingIframe = mapContainer.querySelector('iframe');
            if (existingIframe) {
                existingIframe.remove();
            }
        }
    }

    /**
     * Applica le preferenze (carica/rimuovi servizi terze parti)
     */
    function applyConsent(consent) {
        if (consent && consent.thirdParty) {
            loadGoogleMaps();
        } else {
            showMapPlaceholder();
        }
    }

    /**
     * Gestisci accettazione: salva, nascondi, applica
     */
    function handleAccept(thirdParty) {
        saveConsent(thirdParty);
        hideBanner();
        hideModal();
        applyConsent({ thirdParty: thirdParty });
    }

    /**
     * Inizializzazione
     */
    function init() {
        var consent = getConsent();

        if (consent) {
            // Consenso già dato, applica preferenze
            applyConsent(consent);
        } else {
            // Prima visita, mostra banner
            showBanner();
            showMapPlaceholder();
        }

        // Event Listeners - Banner
        if (btnAcceptAll) {
            btnAcceptAll.addEventListener('click', function () {
                handleAccept(true);
            });
        }

        if (btnNecessary) {
            btnNecessary.addEventListener('click', function () {
                handleAccept(false);
            });
        }

        if (btnSettings) {
            btnSettings.addEventListener('click', function () {
                // Pre-seleziona toggle in base a eventuali preferenze precedenti
                if (thirdPartyToggle) {
                    var current = getConsent();
                    thirdPartyToggle.checked = current ? current.thirdParty : false;
                }
                hideBanner();
                showModal();
            });
        }

        // Event Listeners - Modal
        if (btnModalReject) {
            btnModalReject.addEventListener('click', function () {
                handleAccept(false);
            });
        }

        if (btnModalSave) {
            btnModalSave.addEventListener('click', function () {
                var thirdParty = thirdPartyToggle ? thirdPartyToggle.checked : false;
                handleAccept(thirdParty);
            });
        }

        // Chiudi modal cliccando sull'overlay
        if (modalOverlay) {
            modalOverlay.addEventListener('click', function (e) {
                if (e.target === modalOverlay) {
                    hideModal();
                    showBanner();
                }
            });
        }

        // Chiudi modal con Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('show')) {
                hideModal();
                showBanner();
            }
        });
    }

    // Avvia quando il DOM è pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
