// event/event-install.js - FIXED WITH UNIQUE CLASSES
(function() {
    'use strict';

    window.addEventListener('load', function() {
        setTimeout(checkAndAddEvents, 1000);
    });

    async function checkAndAddEvents() {
        try {
            const response = await fetch('event/event.js');
            if (!response.ok) return;

            const content = await response.text();
            if (!content.includes('const events') || 
                content.includes('const events = []') ||
                content.includes('const events=[]')) {
                return;
            }

            showPopup();

        } catch (error) {
            console.log('Popup error:', error.message);
        }
    }

    function showPopup() {
        if (localStorage.getItem('eventPopupClosed')) return;

        const popupHTML = `
            <div class="ips-event-popup-overlay" id="ipsEventPopup">
                <div class="ips-popup-card">
                    <div class="ips-popup-close-btn" id="ipsPopupClose">
                        <svg width="14" height="14" viewBox="0 0 24 24">
                            <path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                        </svg>
                    </div>
                    
                    <div class="ips-popup-icon">
                        <i class="fas fa-bullhorn"></i>
                    </div>
                    
                    <h3 class="ips-popup-title">Admission Open</h3>
                    
                    <div class="ips-popup-content">
                        <p><strong>Nursery Class Registration</strong></p>
                        <p>Limited seats available. Visit office for forms.</p>
                        <div class="ips-popup-note">
                            <i class="fas fa-clock"></i>
                            <span>9 AM - 12 Noon</span>
                        </div>
                    </div>
                    
                    <div class="ips-popup-actions">
                        <div class="ips-popup-action-btn ips-call-btn" id="ipsPopupCall">
                            <i class="fas fa-phone"></i> Call Now
                        </div>
                        <div class="ips-popup-action-btn ips-close-btn" id="ipsPopupCloseBtn">
                            Close
                        </div>
                    </div>
                </div>
            </div>
        `;

        addPopupCSS();
        document.body.insertAdjacentHTML('beforeend', popupHTML);

        const popup = document.getElementById('ipsEventPopup');
        const closeBtn = document.getElementById('ipsPopupCloseBtn');
        const xBtn = document.getElementById('ipsPopupClose');
        const callBtn = document.getElementById('ipsPopupCall');

        if (popup) {
            setTimeout(() => popup.classList.add('ips-show'), 50);

            const closePopup = () => {
                popup.classList.remove('ips-show');
                setTimeout(() => {
                    popup.remove();
                    localStorage.setItem('eventPopupClosed', 'true');
                }, 200);
            };

            if (closeBtn) closeBtn.addEventListener('click', closePopup);
            if (xBtn) xBtn.addEventListener('click', closePopup);

            if (callBtn) {
                callBtn.addEventListener('click', function() {
                    window.location.href = 'tel:+917333574759';
                });
            }

            // Close on overlay click
            popup.addEventListener('click', function(e) {
                if (e.target === popup) {
                    closePopup();
                }
            });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') closePopup();
            });
        }
    }

    function addPopupCSS() {
        if (document.getElementById('ips-popup-css')) return;

        const style = document.createElement('style');
        style.id = 'ips-popup-css';
        style.textContent = `
            /* ========== COMPLETELY NEW UNIQUE CLASSES ========== */
            /* Your global button styles CANNOT affect these */
            
            /* Popup Overlay */
            .ips-event-popup-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.75);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease;
                padding: 15px;
            }
            
            .ips-event-popup-overlay.ips-show {
                opacity: 1;
                visibility: visible;
            }
            
            /* Popup Card */
            .ips-popup-card {
                background: linear-gradient(135deg, #004aad, #0066cc);
                border-radius: 15px;
                padding: 30px 25px 25px;
                width: 100%;
                max-width: 350px;
                position: relative;
                border: 3px solid #00bf62;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
            }
            
            /* ========== PERFECT CIRCLE CLOSE BUTTON ========== */
            /* Using DIV instead of BUTTON to avoid your global styles */
            .ips-popup-close-btn {
                position: absolute;
                top: -15px;
                right: -15px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: #ff6b6b;
                border: 3px solid white;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                padding: 0;
                margin: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 1000;
                box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
                overflow: visible;
            }
            
            .ips-popup-close-btn:hover {
                background: #ff4757;
                transform: rotate(90deg) scale(1.1);
                box-shadow: 0 8px 20px rgba(255, 71, 87, 0.5);
            }
            
            .ips-popup-close-btn svg {
                width: 16px;
                height: 16px;
                transition: inherit;
            }
            
            /* Popup Icon */
            .ips-popup-icon {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #00bf62, #00d46e);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 15px;
                border: 3px solid white;
            }
            
            .ips-popup-icon i {
                font-size: 24px;
                color: white;
            }
            
            /* Title */
            .ips-popup-title {
                color: white;
                font-size: 22px;
                text-align: center;
                margin: 0 0 15px 0;
                font-weight: 700;
                font-family: 'Poppins', sans-serif;
            }
            
            /* Content */
            .ips-popup-content {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                padding: 15px;
                margin-bottom: 20px;
            }
            
            .ips-popup-content p {
                color: white;
                margin: 0 0 10px 0;
                line-height: 1.5;
                font-size: 15px;
                font-family: 'Poppins', sans-serif;
            }
            
            .ips-popup-content p strong {
                color: #ffb74d;
                display: block;
                margin-bottom: 5px;
                font-weight: 700;
            }
            
            .ips-popup-note {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #00d46e;
                font-size: 14px;
                margin-top: 10px;
                font-family: 'Poppins', sans-serif;
            }
            
            /* Popup Actions - Using DIV instead of BUTTON */
            .ips-popup-actions {
                display: flex;
                gap: 12px;
            }
            
            .ips-popup-action-btn {
                flex: 1;
                padding: 12px;
                border-radius: 10px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: all 0.2s ease;
                font-family: 'Poppins', sans-serif;
                text-align: center;
                user-select: none;
            }
            
            .ips-call-btn {
                background: linear-gradient(135deg, #00bf62, #00d46e);
                color: white;
                border: 2px solid #00bf62;
            }
            
            .ips-call-btn:hover {
                background: linear-gradient(135deg, #00d46e, #00bf62);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 191, 98, 0.3);
            }
            
            .ips-close-btn {
                background: rgba(255, 255, 255, 0.15);
                color: white;
                border: 2px solid rgba(255, 255, 255, 0.3);
            }
            
            .ips-close-btn:hover {
                background: rgba(255, 255, 255, 0.25);
            }
            
            /* Mobile Responsive */
            @media (max-width: 480px) {
                .ips-popup-card {
                    max-width: 300px;
                    padding: 25px 20px 20px;
                    border-radius: 12px;
                }
                
                .ips-popup-close-btn {
                    top: -12px;
                    right: -12px;
                    width: 36px;
                    height: 36px;
                    border-width: 2.5px;
                }
                
                .ips-popup-close-btn svg {
                    width: 14px;
                    height: 14px;
                }
                
                .ips-popup-icon {
                    width: 55px;
                    height: 55px;
                }
                
                .ips-popup-icon i {
                    font-size: 22px;
                }
                
                .ips-popup-title {
                    font-size: 20px;
                }
                
                .ips-popup-content p {
                    font-size: 14px;
                }
                
                .ips-popup-action-btn {
                    padding: 10px;
                    font-size: 14px;
                }
            }
            
            /* Force override any potential conflicts */
            .ips-popup-close-btn,
            .ips-popup-action-btn {
                all: initial;
                font-family: inherit;
            }
            
            .ips-popup-close-btn *,
            .ips-popup-action-btn * {
                all: unset;
            }
        `;

        document.head.appendChild(style);
    }
})();