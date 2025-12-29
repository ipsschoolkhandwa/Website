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
        
        // Add CSS for button sizes (80% Install, 20% Cancel)
        const styleFix = document.createElement('style');
        styleFix.textContent = `
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
        
        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            console.log('PWA install prompt available');
            installBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Install App';
        });
        
        // Handle Install button click
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                // Show the install prompt
                deferredPrompt.prompt();
                
                // Wait for user response
                const { outcome } = await deferredPrompt.userChoice;
                
                if (outcome === 'accepted') {
                    showToast('🎉 School app installing... Check home screen!');
                    localStorage.setItem('appInstalled', 'true');
                    localStorage.setItem('installTime', new Date().toISOString());
                } else {
                    showToast('Installation cancelled. Install later from browser menu.');
                    localStorage.setItem('installCancelled', 'true');
                }
                
                deferredPrompt = null;
                closeAlert();
            } else {
                // Manual installation instructions
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                const isAndroid = /Android/.test(navigator.userAgent);
                
                if (isIOS) {
                    showToast('For iOS: Tap Share → Add to Home Screen');
                } else if (isAndroid) {
                    showToast('For Android: Tap Menu (⋮) → Install App');
                } else {
                    showToast('Check browser menu (⋮ or ⋯) → "Install App"');
                }
                closeAlert();
            }
        });
        
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




// ========== PUSH NOTIFICATION SYSTEM ==========
// Add this code after your existing event listeners (around line 200)

// Generate VAPID keys: https://web-push-codelab.glitch.me/
const VAPID_PUBLIC_KEY = 'BCqyvwEdH6jLlMn5j_HNrcXhU1zX1v1v-Q4YV2ScH2DTSm71qz_mgQh8Uq3Pm4BItGjhNp3c0nSlVJq8NnGgDGs';

// Convert VAPID key for browser
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// Subscribe to push notifications
async function subscribeToPush() {
    if (!('serviceWorker' in navigator)) {
        showToast('Push notifications not supported in your browser.');
        return false;
    }

    try {
        // Get service worker registration
        const registration = await navigator.serviceWorker.ready;
        
        // Check existing subscription
        let subscription = await registration.pushManager.getSubscription();
        
        if (subscription) {
            showToast('✓ You are already subscribed to updates!');
            updateSubscribeButton(true);
            return subscription;
        }
        
        // Request permission
        const permission = await Notification.requestPermission();
        
        if (permission !== 'granted') {
            showToast('Please allow notifications to receive school updates.');
            return false;
        }
        
        // Subscribe with VAPID key
        subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });
        
        // Display success
        showToast('✅ Successfully subscribed! You will now receive school updates.');
        updateSubscribeButton(true);
        
        // Log subscription (for now - later send to backend)
        console.log('Push Subscription:', JSON.stringify(subscription));
        saveSubscriptionLocal(subscription);
        
        return subscription;
        
    } catch (error) {
        console.error('Push subscription error:', error);
        showToast('Failed to subscribe: ' + error.message);
        return false;
    }
}

// Save subscription locally
function saveSubscriptionLocal(subscription) {
    try {
        localStorage.setItem('pushSubscription', JSON.stringify(subscription));
        localStorage.setItem('pushSubscribedAt', new Date().toISOString());
    } catch (e) {
        console.log('Local save failed:', e);
    }
}

// Update button state
function updateSubscribeButton(isSubscribed) {
    const btn = document.getElementById('subscribeNotifications');
    if (!btn) return;
    
    if (isSubscribed) {
        btn.innerHTML = '<i class="fas fa-bell-slash"></i> Unsubscribe';
        btn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        btn.onclick = unsubscribeFromPush;
    } else {
        btn.innerHTML = '<i class="fas fa-bell"></i> Get School Updates';
        btn.style.background = 'linear-gradient(135deg, #efa12e, #ff9800)';
        btn.onclick = subscribeToPush;
    }
}

// Unsubscribe from push
async function unsubscribeFromPush() {
    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        
        if (subscription) {
            await subscription.unsubscribe();
            localStorage.removeItem('pushSubscription');
            localStorage.removeItem('pushSubscribedAt');
            
            showToast('Unsubscribed from notifications.');
            updateSubscribeButton(false);
        }
    } catch (error) {
        console.error('Unsubscribe error:', error);
        showToast('Failed to unsubscribe.');
    }
}

// Check subscription status on load
async function checkPushSubscription() {
    if (!('serviceWorker' in navigator) || !Notification.permission) return;
    
    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        
        if (subscription && Notification.permission === 'granted') {
            updateSubscribeButton(true);
        } else {
            updateSubscribeButton(false);
        }
    } catch (error) {
        console.log('Subscription check failed:', error);
    }
}

// Initialize push notifications
function initPushNotifications() {
    const subscribeBtn = document.getElementById('subscribeNotifications');
    
    if (!subscribeBtn) return;
    
    // Set initial button state
    if (Notification.permission === 'granted') {
        checkPushSubscription();
    } else if (Notification.permission === 'denied') {
        subscribeBtn.disabled = true;
        subscribeBtn.innerHTML = '<i class="fas fa-bell-slash"></i> Notifications Blocked';
        subscribeBtn.style.background = '#cccccc';
    }
    
    // Add click handler
    subscribeBtn.addEventListener('click', subscribeToPush);
    
    // Listen for permission changes
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            checkPushSubscription();
        } else if (permission === 'denied') {
            subscribeBtn.disabled = true;
            subscribeBtn.innerHTML = '<i class="fas fa-bell-slash"></i> Notifications Blocked';
            subscribeBtn.style.background = '#cccccc';
        }
    });
}

// ========== TEST NOTIFICATION FUNCTION ==========
// Add this function to test notifications manually
function testNotificationManually() {
    if (Notification.permission === 'granted') {
        new Notification('IPS Khandwa Test', {
            body: '✅ School update notification is working!',
            icon: './logo.png',
            badge: './logo.png',
            vibrate: [100, 50, 100]
        });
    } else {
        showToast('Please allow notifications first.');
    }
}

// Add to your initAll() function
// Find the initAll() function in your script.js and add:
function initAll() {
    // ... your existing code ...
    
    // Add this line:
    initPushNotifications();
    
    // ... rest of your code ...
}