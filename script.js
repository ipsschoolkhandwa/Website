document.addEventListener('DOMContentLoaded', function() {
    // Performance tracking
    const startTime = performance.now();

    // Elements
    const callBtn = document.getElementById('callBtn');
    const copyBtn = document.getElementById('copyBtn');
    const phone = document.querySelector('.phone');
    const toast = document.getElementById('toast');
    const warning = document.getElementById('officeHours');
    const logo = document.querySelector('.logo');
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

    // 6. Logo animation
    logo.addEventListener('click', function() {
        this.style.transform = 'scale(1.05) rotate(360deg)';
        this.style.transition = 'transform 0.6s';

        createColorBurst();

        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 600);
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
        initAppDownloadAlert();
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
            
            /* App Alert Styles */
            .app-download-alert {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .app-download-alert.show {
                opacity: 1;
                visibility: visible;
            }
            
            .app-alert-content {
                background: linear-gradient(135deg, #004aad, #0066cc);
                border-radius: 20px;
                padding: 25px;
                max-width: 380px;
                width: 90%;
                text-align: center;
                position: relative;
                border: 3px solid #00bf62;
                box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
                animation: alertPop 0.4s ease-out;
            }
            
            @keyframes alertPop {
                0% { transform: scale(0.9); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
            
            .app-alert-close {
                position: absolute;
                top: 10px;
                right: 15px;
                background: none;
                border: none;
                color: white;
                font-size: 28px;
                cursor: pointer;
                line-height: 1;
                padding: 5px;
            }
            
            .app-alert-icon {
                font-size: 50px;
                color: #00bf62;
                margin-bottom: 10px;
            }
            
            .app-alert-content h3 {
                color: white;
                margin-bottom: 10px;
                font-size: 22px;
            }
            
            .app-alert-content p {
                color: #e0e0e0;
                margin-bottom: 20px;
                line-height: 1.5;
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

    function createColorBurst() {
        const colors = ['#efa12e', '#00bf62', '#004aad', '#ffffff'];

        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const burst = document.createElement('div');
                burst.style.position = 'fixed';
                burst.style.width = '8px';
                burst.style.height = '8px';
                burst.style.borderRadius = '50%';
                burst.style.background = colors[i % colors.length];
                burst.style.top = '50%';
                burst.style.left = '50%';
                burst.style.zIndex = '9999';
                burst.style.pointerEvents = 'none';
                burst.style.opacity = '0.7';
                burst.style.transform = 'translate(-50%, -50%)';

                document.body.appendChild(burst);

                const angle = Math.random() * Math.PI * 2;
                const distance = 40 + Math.random() * 60;

                burst.animate([
                    { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.7 },
                    { transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(0)`, opacity: 0 }
                ], {
                    duration: 500,
                    easing: 'ease-out'
                });

                setTimeout(() => burst.remove(), 500);
            }, i * 80);
        }
    }

    function optimizeScrolling() {
        // Force GPU acceleration for smoother scrolling
        const elements = document.querySelectorAll('.header-content, .admission-box, .contact-box, .info-box, .youtube-box, .footer');
        elements.forEach(el => {
            el.style.transform = 'translateZ(0)';
            el.style.backfaceVisibility = 'hidden';
        });
    }

    function initAppDownloadAlert() {
        // Only show if not already installed and not shown before
        if (localStorage.getItem('appInstalled') === 'true' || localStorage.getItem('appAlertShown')) {
            return;
        }

        // Check if user is on mobile
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (!isMobile) return;

        const appAlertHTML = `
            <div class="app-download-alert" id="appDownloadAlert">
                <div class="app-alert-content">
                    <button class="app-alert-close" id="appAlertClose">&times;</button>
                    <div class="app-alert-icon">
                        <i class="fas fa-mobile-alt"></i>
                    </div>
                    <h3>Install School App</h3>
                    <p>Get quick access to school information, admission updates, and contact details right from your home screen!</p>
                    <button class="install-btn" id="appInstallPrompt">
                        <i class="fas fa-download"></i> Install Now
                    </button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', appAlertHTML);

        const appAlert = document.getElementById('appDownloadAlert');
        const closeBtn = document.getElementById('appAlertClose');
        const installPromptBtn = document.getElementById('appInstallPrompt');

        // Show alert
        setTimeout(() => {
            appAlert.classList.add('show');
            localStorage.setItem('appAlertShown', 'true');
        }, 3000);

        // Close button
        const closeAlert = () => {
            appAlert.classList.remove('show');
            setTimeout(() => {
                if (appAlert.parentNode) {
                    appAlert.remove();
                }
            }, 300);
        };

        if (closeBtn) {
            closeBtn.addEventListener('click', closeAlert);
        }

        // Install button
        if (installPromptBtn) {
            installPromptBtn.addEventListener('click', () => {
                // Trigger PWA install prompt
                const installEvent = new Event('beforeinstallprompt');
                window.dispatchEvent(installEvent);

                // Show instructions
                const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
                const isAndroid = /Android/i.test(navigator.userAgent);

                if (isIOS) {
                    showToast('For iOS: Tap Share → Add to Home Screen');
                } else if (isAndroid) {
                    showToast('For Android: Tap Menu (⋮) → Install App');
                } else {
                    showToast('Check browser menu (⋮ or ⋯) → "Install App"');
                }
                closeAlert();
            });
        }

        // Listen for successful installation
        window.addEventListener('appinstalled', () => {
            console.log('PWA successfully installed');
            localStorage.setItem('appInstalled', 'true');
            localStorage.setItem('installTime', new Date().toISOString());
        });

        // Auto-close after 15 seconds
        setTimeout(() => {
            if (appAlert.parentNode) {
                closeAlert();
            }
        }, 15000);
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