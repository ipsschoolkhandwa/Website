// event/event-install.js - FIXED CLOSE BUTTON WITH CIRCLE
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
            <div class="event-popup" id="eventPopup">
                <div class="popup-card">
                    <button class="popup-close" id="popupClose" aria-label="Close popup">
                        <svg width="14" height="14" viewBox="0 0 24 24" class="close-icon">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                    
                    <div class="popup-icon">
                        <i class="fas fa-bullhorn"></i>
                    </div>
                    
                    <h3>Admission Open</h3>
                    
                    <div class="popup-content">
                        <p><strong>Nursery Class Registration</strong></p>
                        <p>Limited seats available. Visit office for forms.</p>
                        <div class="popup-note">
                            <i class="fas fa-clock"></i>
                            <span>9 AM - 12 Noon</span>
                        </div>
                    </div>
                    
                    <div class="popup-buttons">
                        <button class="popup-btn call-btn" id="popupCall">
                            <i class="fas fa-phone"></i> Call Now
                        </button>
                        <button class="popup-btn close-btn" id="popupCloseBtn">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;

        addPopupCSS();
        document.body.insertAdjacentHTML('beforeend', popupHTML);

        const popup = document.getElementById('eventPopup');
        const closeBtn = document.getElementById('popupCloseBtn');
        const xBtn = document.getElementById('popupClose');
        const callBtn = document.getElementById('popupCall');

        if (popup) {
            setTimeout(() => popup.classList.add('show'), 50);

            const closePopup = () => {
                popup.classList.remove('show');
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

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') closePopup();
            });
        }
    }

    function addPopupCSS() {
        if (document.getElementById('fixed-popup-css')) return;

        const style = document.createElement('style');
        style.id = 'fixed-popup-css';
        style.textContent = `
            /* Popup Overlay */
            .event-popup {
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
                transition: opacity 0.2s ease;
                padding: 15px;
            }
            
            .event-popup.show {
                opacity: 1;
                visibility: visible;
            }
            
            /* Popup Card - More Compact */
            .popup-card {
                background: linear-gradient(135deg, #004aad, #0066cc);
                border-radius: 12px;
                padding: 25px 20px 20px;
                width: 100%;
                max-width: 320px;
                position: relative;
                border: 2px solid #00bf62;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            }
            
            /* FIXED: Perfect Circle Close Button */
            .popup-close {
                position: absolute;
                top: -10px;
                right: -10px;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: #efa12e;
                border: 2px solid white;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                padding: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 100;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
            }
            
            .popup-close:hover {
                background: #ff8c00;
                transform: scale(1.1);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
            
            .popup-close:hover .close-icon {
                transform: rotate(90deg);
            }
            
            .close-icon {
                width: 14px;
                height: 14px;
                color: white;
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                stroke: currentColor;
            }
            
            /* Popup Icon */
            .popup-icon {
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #00bf62, #00d46e);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 12px;
                border: 2px solid white;
            }
            
            .popup-icon i {
                font-size: 20px;
                color: white;
            }
            
            /* Title */
            .popup-card h3 {
                color: white;
                font-size: 18px;
                text-align: center;
                margin: 0 0 12px 0;
                font-weight: 700;
            }
            
            /* Content - Shorter */
            .popup-content {
                background: rgba(255, 255, 255, 0.08);
                border-radius: 8px;
                padding: 12px;
                margin-bottom: 15px;
            }
            
            .popup-content p {
                color: white;
                margin: 0 0 8px 0;
                line-height: 1.4;
                font-size: 14px;
            }
            
            .popup-content p strong {
                color: #ffb74d;
                display: block;
                margin-bottom: 4px;
            }
            
            .popup-note {
                display: flex;
                align-items: center;
                gap: 6px;
                color: #00d46e;
                font-size: 12px;
                margin-top: 8px;
            }
            
            /* Buttons */
            .popup-buttons {
                display: flex;
                gap: 10px;
            }
            
            .popup-btn {
                flex: 1;
                padding: 10px;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                transition: all 0.2s ease;
            }
            
            .call-btn {
                background: linear-gradient(135deg, #00bf62, #00d46e);
                color: white;
                border: 1px solid #00bf62;
            }
            
            .call-btn:hover {
                background: linear-gradient(135deg, #00d46e, #00bf62);
            }
            
            .close-btn {
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.3);
            }
            
            .close-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            /* Mobile */
            @media (max-width: 480px) {
                .popup-card {
                    max-width: 280px;
                    padding: 20px 15px 15px;
                }
                
                .popup-close {
                    top: -8px;
                    right: -8px;
                    width: 28px;
                    height: 28px;
                    border-width: 1.5px;
                }
                
                .close-icon {
                    width: 12px;
                    height: 12px;
                }
                
                .popup-icon {
                    width: 45px;
                    height: 45px;
                }
                
                .popup-icon i {
                    font-size: 18px;
                }
                
                .popup-card h3 {
                    font-size: 16px;
                }
                
                .popup-content p {
                    font-size: 13px;
                }
                
                .popup-btn {
                    padding: 8px;
                    font-size: 13px;
                }
            }
        `;

        document.head.appendChild(style);
    }
})();