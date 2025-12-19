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
    const CACHE_KEY = 'ips_cache_v1';
    
    // 1. Auto-optimize on load
    autoOptimize();
    
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
        this.style.transform = 'scale(1.1) rotate(360deg)';
        this.style.transition = 'transform 0.8s';
        
        createColorBurst();
        
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 800);
    });
    
    // 7. YouTube link confirmation
    youtubeLink.addEventListener('click', function(e) {
        if (!confirm('Opening YouTube channel in new tab. Continue?')) {
            e.preventDefault();
        }
    });
    
    // Functions
    function autoOptimize() {
        // 1. Check and load from cache
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const cacheData = JSON.parse(cached);
            const age = Date.now() - cacheData.timestamp;
            
            // Use cache if less than 1 hour old
            if (age < 60 * 60 * 1000) {
                console.log('Loaded from cache (age:', Math.floor(age/1000), 'seconds)');
                
                // Update office hours from cache if available
                if (cacheData.officeStatus) {
                    updateOfficeDisplay(cacheData.officeStatus);
                }
                
                // Schedule background refresh
                setTimeout(refreshCache, 5000);
                return;
            }
        }
        
        // 2. Fresh load - cache in background
        console.log('Fresh load - caching in background');
        refreshCache();
        
        // 3. Check current office hours
        checkOfficeHours();
    }
    
    function refreshCache() {
        const cacheData = {
            timestamp: Date.now(),
            loadTime: Math.round(performance.now() - startTime),
            officeStatus: checkOfficeHours(true)
        };
        
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
            console.log('Cache updated at:', new Date().toLocaleTimeString());
        } catch (e) {
            console.log('Cache update failed:', e.message);
        }
        
        // Preload resources for next visit
        preloadResources();
    }
    
    function preloadResources() {
        // Preload critical resources in background
        const resources = [
            'logo.jpg',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
            'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Montserrat:wght@800;900&display=swap'
        ];
        
        resources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = resource.endsWith('.css') ? 'style' : resource.endsWith('.jpg') ? 'image' : 'font';
            link.href = resource;
            document.head.appendChild(link);
            
            // Remove after preload
            setTimeout(() => link.remove(), 3000);
        });
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
            return {
                isOpen: isOpen,
                checkedAt: now.toISOString(),
                nextCheck: isOpen ? (12 * 60 - (hours * 60 + minutes)) : 
                                    (9 * 60 + 24 * 60 - (hours * 60 + minutes))
            };
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
                
                // Visual feedback
                if (phone) {
                    phone.style.background = 'linear-gradient(135deg, #00bf62, #00d46e)';
                    phone.style.color = 'white';
                    phone.style.borderColor = '#efa12e';
                    setTimeout(() => {
                        phone.style.background = '';
                        phone.style.color = '';
                        phone.style.borderColor = '';
                    }, 500);
                }
                
                // Button feedback
                if (copyBtn) {
                    const originalHTML = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => {
                        copyBtn.innerHTML = originalHTML;
                    }, 2000);
                }
            })
            .catch(() => {
                // Fallback
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
        }, 3000);
    }
    
    function createColorBurst() {
        const colors = ['#efa12e', '#00bf62', '#004aad', '#ffffff'];
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const burst = document.createElement('div');
                burst.style.position = 'fixed';
                burst.style.width = '10px';
                burst.style.height = '10px';
                burst.style.borderRadius = '50%';
                burst.style.background = colors[i % colors.length];
                burst.style.top = '50%';
                burst.style.left = '50%';
                burst.style.zIndex = '9999';
                burst.style.pointerEvents = 'none';
                burst.style.opacity = '0.8';
                burst.style.transform = 'translate(-50%, -50%)';
                
                document.body.appendChild(burst);
                
                const angle = Math.random() * Math.PI * 2;
                const distance = 50 + Math.random() * 100;
                
                burst.animate([
                    { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.8 },
                    { transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(0)`, opacity: 0 }
                ], {
                    duration: 600,
                    easing: 'ease-out'
                });
                
                setTimeout(() => burst.remove(), 600);
            }, i * 50);
        }
    }
    
    // Auto-refresh cache every 30 minutes
    setInterval(refreshCache, 30 * 60 * 1000);
    
    // Check office hours every minute
    setInterval(() => {
        const status = checkOfficeHours(true);
        const cacheData = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
        cacheData.officeStatus = status;
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    }, 60 * 1000);
    
    // Clean old cache on startup
    function cleanOldCache() {
        const cacheKeys = Object.keys(localStorage);
        cacheKeys.forEach(key => {
            if (key.startsWith('ips_cache_') && key !== CACHE_KEY) {
                localStorage.removeItem(key);
            }
        });
    }
    
    cleanOldCache();
    
    // Add floating animation to school name
    const schoolNameWords = document.querySelectorAll('.indian, .public, .school-text');
    schoolNameWords.forEach((word, index) => {
        word.style.animation = `floatWord ${3 + index * 0.5}s ease-in-out infinite`;
    });
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatWord {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
    `;
    document.head.appendChild(style);
});
