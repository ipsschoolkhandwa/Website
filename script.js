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
        fixAdmissionOverflow(); // NEW: Fix admission box
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
                right: 10px !important; /* Changed from -25px */
                background: #efa12e;
                color: #004aad;
                padding: 8px 20px !important; /* Reduced padding */
                transform: rotate(0deg) !important; /* No rotation */
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
            
            .app-alert-buttons {
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
            }
            
            .app-install-btn, .app-later-btn {
                flex: 1;
                padding: 12px;
                border: none;
                border-radius: 10px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .app-install-btn {
                background: linear-gradient(135deg, #00bf62, #00d46e);
                color: white;
            }
            
            .app-later-btn {
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: 2px solid rgba(255, 255, 255, 0.3);
            }
            
            .app-install-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 191, 98, 0.3);
            }
            
            .app-later-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .app-alert-note {
                color: #90caf9;
                font-size: 12px;
                margin-top: 10px;
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
        // Force GPU acceleration
        const elements = [
            '.header-content',
            '.admission-box', 
            '.contact-box',
            '.info-box',
            '.youtube-box',
            '.footer'
        ];
        elements.forEach(selector => {
            const el = document.querySelector(selector);
            if (el) {
                el.style.transform = 'translateZ(0)';
            }
        });

        // Debounce scroll
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // App Download Alert
    function initAppDownloadAlert() {
        const hasSeenAlert = localStorage.getItem('hasSeenAppAlert');

        if (!hasSeenAlert) {
            setTimeout(() => {
                createAppAlert();
            }, 1500);
        }
    }

   function createAppAlert() {
    const appAlert = document.createElement('div');
    appAlert.className = 'app-download-alert';
    appAlert.innerHTML = `
        <div class="app-alert-content">
            <button class="app-alert-close">&times;</button>
            <div class="app-alert-icon">
                <i class="fas fa-mobile-alt"></i>
            </div>
            <h3>📱 Install School App</h3>
            <p>Add to home screen for instant access & offline use</p>
            <div class="app-alert-buttons">
                <button class="app-install-btn" id="installAppBtn">
                    <i class="fas fa-plus-circle"></i> Add to Home Screen
                </button>
                <button class="app-later-btn" id="laterBtn">
                    Cancel
                </button>
            </div>
            <div class="app-alert-note">
                <small><i class="fas fa-info-circle"></i> Works offline • No downloads needed</small>
            </div>
        </div>
    `;
    
    document.body.appendChild(appAlert);
    
    // Add CSS for button sizes
    const styleFix = document.createElement('style');
    styleFix.textContent = `
        /* Button size fix - Install 80%, Cancel 20% */
        .app-alert-buttons {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .app-install-btn {
            flex: 4; /* 80% width */
            min-width: 0;
            padding: 14px;
            border: none;
            border-radius: 10px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            background: linear-gradient(135deg, #00bf62, #00d46e);
            color: white;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .app-later-btn {
            flex: 1; /* 20% width */
            min-width: 70px;
            padding: 14px 10px;
            border: none;
            border-radius: 10px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.3);
            font-size: 14px;
        }
        
        /* Hover effects */
        .app-install-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 191, 98, 0.4);
            background: linear-gradient(135deg, #00d46e, #00bf62);
        }
        
        .app-later-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
        }
        
        @media (max-width: 480px) {
            .app-install-btn {
                font-size: 14px;
                padding: 12px;
            }
            
            .app-later-btn {
                font-size: 13px;
                padding: 12px 8px;
                min-width: 60px;
            }
        }
    `;
    document.head.appendChild(styleFix);
    
    setTimeout(() => {
        appAlert.classList.add('show');
    }, 100);
    
    const closeBtn = appAlert.querySelector('.app-alert-close');
    const laterBtn = appAlert.querySelector('#laterBtn');
    const installBtn = appAlert.querySelector('#installAppBtn');
    
    const closeAlert = () => {
        appAlert.classList.remove('show');
        localStorage.setItem('hasSeenAppAlert', 'true');
        setTimeout(() => {
            if (appAlert.parentNode) {
                appAlert.remove();
            }
        }, 300);
    };
    
    closeBtn.addEventListener('click', closeAlert);
    laterBtn.addEventListener('click', closeAlert);
    
    // PWA Installation Logic
    let deferredPrompt;
    
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        
        console.log('PWA install prompt available');
        
        // Update button text to indicate PWA is available
        installBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Install App';
    });
    
    // Handle Install button click
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            // Show the install prompt
            deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;
            
            // Log the outcome
            console.log(`User ${outcome}ed the PWA installation`);
            
            if (outcome === 'accepted') {
                showToast('🎉 School app installing... Check your home screen!');
                localStorage.setItem('appInstalled', 'true');
                localStorage.setItem('installTime', new Date().toISOString());
                
                // Track installation
                trackEvent('pwa_installed');
            } else {
                showToast('Installation cancelled. You can install later from browser menu.');
                localStorage.setItem('installCancelled', 'true');
            }
            
            // We've used the prompt, and can't use it again, so discard it
            deferredPrompt = null;
            
            closeAlert();
        } else {
            // PWA install prompt not available
            showToast('📱 Check browser menu (⋮ or ⋯) → "Install" or "Add to Home Screen"');
            
            // Provide manual installation instructions
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const isAndroid = /Android/.test(navigator.userAgent);
            
            if (isIOS) {
                showToast('For iOS: Tap Share → Add to Home Screen');
            } else if (isAndroid) {
                showToast('For Android: Tap Menu (⋮) → Install App');
            }
            
            closeAlert();
        }
    });
    
    // Also listen for app installed event
    window.addEventListener('appinstalled', () => {
        console.log('PWA was successfully installed');
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

// Add this helper function for tracking
function trackEvent(eventName) {
    try {
        const cacheData = JSON.parse(localStorage.getItem('ips_cache_v2') || '{}');
        cacheData.events = cacheData.events || [];
        cacheData.events.push({
            name: eventName,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('ips_cache_v2', JSON.stringify(cacheData));
    } catch (e) {
        // Silent fail
    }
} 
    // Service Worker Registration
    function initServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('service-worker.js?v=2.0')
                .then(registration => {
                    console.log('Service Worker v2.0 registered');

                    // Check for updates every hour
                    setInterval(() => {
                        registration.update();
                    }, 60 * 60 * 1000);
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