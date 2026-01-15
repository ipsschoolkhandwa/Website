document.addEventListener('DOMContentLoaded', function() {
    // Performance tracking
    const startTime = performance.now();

    // Elements
    const callBtn = document.getElementById('callBtn');
    const copyBtn = document.getElementById('copyBtn');
    const phone = document.querySelector('.phone');
    const toast = document.getElementById('toast');
    const warning = document.getElementById('officeHours');
    const youtubeLink = document.getElementById('youtubeLink');

    const phoneNumber = '+91 7333574759';
    const CACHE_KEY = 'ips_cache_v2';

    // 1. Initialize everything
    initAll();

    // 2. Call Button
    callBtn.addEventListener('click', function() {
        window.location.href = 'tel:+917333574759';

        setTimeout(() => {
            showToast('If call not started, dial: ' + phoneNumber);
        }, 1000);
    });

    // 3. Copy Button
    copyBtn.addEventListener('click', function() {
        copyToClipboard(phoneNumber);
    });

    // 4. Phone number click to copy
    phone.addEventListener('click', function() {
        copyToClipboard(phoneNumber);
    });

    // 5. Warning click
    warning.addEventListener('click', function() {
        showToast('Office hours: 9 AM to 12 Noon only');
    });

    // 7. YouTube link confirmation
    youtubeLink.addEventListener('click', function(e) {
        if (!confirm('Opening YouTube channel in new tab. Continue?')) {
            e.preventDefault();
        }
    });

    // Initialize all functions
    function initAll() {
        autoOptimize();
        optimizeScrolling();
        fixAdmissionOverflow();
        initServiceWorker();
        checkOfficeHours();

        // Add floating animation to school name
        const schoolNameWords = document.querySelectorAll('.indian, .public, .school-text');
        schoolNameWords.forEach((word, index) => {
            word.style.animation = `floatWord ${3 + index * 0.5}s ease-in-out infinite`;
        });

        // Add CSS for animations and fixes
        const style = document.createElement('style');
        style.textContent = `
            /* Fix Admission Box Overflow */
            .admission-box {
                position: relative;
                overflow: visible !important;
            }
            
            .badge {
                position: absolute;
                top: 15px;
                right: 10px !important;
                background: #efa12e;
                color: #004aad;
                padding: 8px 20px !important;
                transform: rotate(0deg) !important;
                font-weight: bold;
                font-size: 13px;
                border-radius: 20px;
                border: 2px solid white;
                z-index: 10;
                white-space: nowrap;
                box-shadow: 0 3px 10px rgba(239, 161, 46, 0.4);
            }
            
            /* Responsive badge fix */
            @media (max-width: 768px) {
                .badge {
                    position: relative !important;
                    top: auto !important;
                    right: auto !important;
                    display: inline-block;
                    margin-bottom: 10px;
                    transform: none !important;
                }
            }
            
            @keyframes floatWord {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-3px); }
            }
            
            /* Performance optimizations */
            .header-content,
            .admission-box,
            .contact-box,
            .info-box,
            .youtube-box,
            .footer {
                transform: translateZ(0);
                backface-visibility: hidden;
            }
        `;
        document.head.appendChild(style);
    }

    // NEW: Fix admission overflow
    function fixAdmissionOverflow() {
        const badge = document.querySelector('.badge');
        if (badge) {
            // Remove rotation and fix position
            badge.style.transform = 'rotate(0deg)';
            badge.style.right = '10px';
            badge.style.top = '15px';
            badge.style.padding = '8px 20px';
            badge.style.borderRadius = '20px';

            // Make it responsive
            if (window.innerWidth < 768) {
                badge.style.position = 'relative';
                badge.style.top = 'auto';
                badge.style.right = 'auto';
                badge.style.display = 'inline-block';
                badge.style.marginBottom = '10px';
            }
        }
    }

    // Auto-optimization
    function autoOptimize() {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const cacheData = JSON.parse(cached);
            const age = Date.now() - cacheData.timestamp;

            if (age < 60 * 60 * 1000) {
                console.log('Loaded from cache');
                if (cacheData.officeStatus) {
                    updateOfficeDisplay(cacheData.officeStatus);
                }
                setTimeout(refreshCache, 3000);
                return;
            }
        }

        refreshCache();
    }

    function refreshCache() {
        const cacheData = {
            timestamp: Date.now(),
            loadTime: Math.round(performance.now() - startTime),
            officeStatus: checkOfficeHours(true)
        };

        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        } catch (e) {
            console.log('Cache update failed');
        }
    }

    function checkOfficeHours(returnStatus = false) {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const isOpen = hours >= 9 && (hours < 12 || (hours === 12 && minutes === 0));

        if (warning) {
            if (isOpen) {
                warning.innerHTML = '<i class="fas fa-check-circle"></i><p>Office is OPEN - Call Now!</p>';
                warning.style.background = 'linear-gradient(135deg, #d4edda, #c3e6cb)';
                warning.style.borderLeftColor = '#28a745';
                warning.style.color = '#155724';
            } else {
                warning.innerHTML = '<i class="fas fa-exclamation-triangle"></i><p>Office is CLOSED (9 AM - 12 Noon)</p>';
                warning.style.background = 'linear-gradient(135deg, #fff8e1, #ffecb3)';
                warning.style.borderLeftColor = '#efa12e';
                warning.style.color = '#e65100';
            }
        }

        if (returnStatus) {
            return { isOpen, checkedAt: now.toISOString() };
        }

        return isOpen;
    }

    function updateOfficeDisplay(status) {
        if (!warning || !status) return;

        if (status.isOpen) {
            warning.innerHTML = '<i class="fas fa-check-circle"></i><p>Office is OPEN - Call Now!</p>';
            warning.style.background = 'linear-gradient(135deg, #d4edda, #c3e6cb)';
            warning.style.borderLeftColor = '#28a745';
            warning.style.color = '#155724';
        } else {
            warning.innerHTML = '<i class="fas fa-exclamation-triangle"></i><p>Office is CLOSED (9 AM - 12 Noon)</p>';
            warning.style.background = 'linear-gradient(135deg, #fff8e1, #ffecb3)';
            warning.style.borderLeftColor = '#efa12e';
            warning.style.color = '#e65100';
        }
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                showToast('Phone number copied!');

                if (phone) {
                    phone.style.background = 'linear-gradient(135deg, #00bf62, #00d46e)';
                    phone.style.color = 'white';
                    phone.style.borderColor = '#efa12e';
                    setTimeout(() => {
                        phone.style.background = '';
                        phone.style.color = '';
                        phone.style.borderColor = '';
                    }, 400);
                }

                if (copyBtn) {
                    const originalHTML = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => {
                        copyBtn.innerHTML = originalHTML;
                    }, 1500);
                }
            })
            .catch(() => {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showToast('Number copied to clipboard!');
            });
    }

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    function optimizeScrolling() {
        // Force GPU acceleration for smoother scrolling
        const elements = document.querySelectorAll('.header-content, .admission-box, .contact-box, .info-box, .youtube-box, .footer');
        elements.forEach(el => {
            el.style.transform = 'translateZ(0)';
            el.style.backfaceVisibility = 'hidden';
        });
    }

    // Service Worker Registration
    function initServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('service-worker.js', {
                scope: './',
                updateViaCache: 'none'
            })
            .then(registration => {
                console.log('Service Worker v2.0 registered');

                // Check for updates periodically
                setInterval(() => {
                    registration.update();
                }, 2 * 60 * 60 * 1000);

                // Listen for updates
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    console.log('New Service Worker activated!');
                });
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
        }
    }

    // Make badge responsive on window resize
    window.addEventListener('resize', fixAdmissionOverflow);

    // Schedule regular updates
    setInterval(() => {
        const status = checkOfficeHours(true);
        const cacheData = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
        cacheData.officeStatus = status;
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    }, 5 * 60 * 1000);

    // Auto-refresh cache every hour
    setInterval(refreshCache, 60 * 60 * 1000);

    // Clean old cache
    function cleanOldCache() {
        const cacheKeys = Object.keys(localStorage);
        cacheKeys.forEach(key => {
            if (key.startsWith('ips_cache_') && key !== CACHE_KEY) {
                localStorage.removeItem(key);
            }
        });
    }

    cleanOldCache();
});