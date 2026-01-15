// event/event-install.js - FINAL FIXED VERSION
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
            <div class="event-popup-container" id="eventPopupContainer">
                <div class="event-popup-window">
                    <!-- Using <a> tags instead of <button> to avoid global button styles -->
                    <a href="javascript:void(0)" class="popup-close-x" id="popupCloseX">
                        <svg width="16" height="16" viewBox="0 0 24 24">
                            <path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                        </svg>
                    </a>
                    
                    <div class="popup-header-icon">
                        <i class="fas fa-bullhorn"></i>
                    </div>
                    
                    <h3 class="popup-main-heading">Admission Open</h3>
                    
                    <div class="popup-message-box">
                        <p class="message-title">Nursery Class Registration</p>
                        <p class="message-text">Limited seats available. Visit office for forms.</p>
                        <div class="message-time">
                            <i class="fas fa-clock"></i>
                            <span>9 AM - 12 Noon</span>
                        </div>
                    </div>
                    
                    <!-- Using <a> tags for buttons to avoid global button styles -->
                    <div class="popup-buttons-row">
                        <a href="tel:+917333574759" class="popup-action-button call-action-btn">
                            <i class="fas fa-phone"></i>
                            <span>Call Now</span>
                        </a>
                        <a href="javascript:void(0)" class="popup-action-button close-action-btn" id="popupCloseBtn">
                            <span>Close</span>
                        </a>
                    </div>
                </div>
            </div>
        `;

        addPopupStyles();
        document.body.insertAdjacentHTML('beforeend', popupHTML);

        const popup = document.getElementById('eventPopupContainer');
        const closeBtn = document.getElementById('popupCloseBtn');
        const closeX = document.getElementById('popupCloseX');

        if (popup) {
            // Show popup with animation
            setTimeout(() => {
                popup.style.opacity = '1';
                popup.style.visibility = 'visible';
            }, 50);

            // Close function
            const closePopup = () => {
                popup.style.opacity = '0';
                popup.style.visibility = 'hidden';
                setTimeout(() => {
                    if (popup.parentNode) {
                        popup.remove();
                    }
                    localStorage.setItem('eventPopupClosed', 'true');
                }, 300);
            };

            // Add click events
            if (closeBtn) {
                closeBtn.addEventListener('click', closePopup);
            }
            
            if (closeX) {
                closeX.addEventListener('click', closePopup);
            }

            // Close on overlay click
            popup.addEventListener('click', function(e) {
                if (e.target === popup) {
                    closePopup();
                }
            });

            // Close on ESC key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') closePopup();
            });
        }
    }

    function addPopupStyles() {
        if (document.getElementById('event-popup-styles')) return;

        const style = document.createElement('style');
        style.id = 'event-popup-styles';
        style.textContent = `
            /* ========== EVENT POPUP STYLES ========== */
            /* Using !important to override everything */
            
            /* Popup Container */
            .event-popup-container {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                background: rgba(0, 0, 0, 0.85) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                z-index: 999999 !important; /* Higher than everything */
                opacity: 0 !important;
                visibility: hidden !important;
                transition: opacity 0.3s ease !important;
                padding: 20px !important;
                pointer-events: auto !important; /* Make it clickable */
            }
            
            /* Popup Window */
            .event-popup-window {
                background: linear-gradient(135deg, #004aad, #0066cc) !important;
                border-radius: 15px !important;
                padding: 30px 25px 25px !important;
                width: 100% !important;
                max-width: 380px !important;
                border: 3px solid #00bf62 !important;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6) !important;
                position: relative !important;
                animation: popupSlideIn 0.4s ease !important;
                pointer-events: auto !important; /* Make it clickable */
            }
            
            @keyframes popupSlideIn {
                from {
                    transform: translateY(-30px) scale(0.95);
                    opacity: 0;
                }
                to {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                }
            }
            
            /* Circular Close Button (X) */
            .popup-close-x {
                position: absolute !important;
                top: -18px !important;
                right: -18px !important;
                width: 40px !important;
                height: 40px !important;
                border-radius: 50% !important;
                background: #ff4757 !important;
                border: 3px solid white !important;
                color: white !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
                padding: 0 !important;
                margin: 0 !important;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                z-index: 1000 !important;
                box-shadow: 0 5px 20px rgba(255, 71, 87, 0.5) !important;
                overflow: visible !important;
                text-decoration: none !important;
                pointer-events: auto !important; /* Make it clickable */
            }
            
            .popup-close-x:hover {
                background: #ff6b81 !important;
                transform: rotate(90deg) scale(1.1) !important;
                box-shadow: 0 8px 25px rgba(255, 107, 129, 0.6) !important;
            }
            
            .popup-close-x svg {
                width: 16px !important;
                height: 16px !important;
                transition: inherit !important;
            }
            
            /* Header Icon */
            .popup-header-icon {
                width: 65px !important;
                height: 65px !important;
                background: linear-gradient(135deg, #00bf62, #00d46e) !important;
                border-radius: 50% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                margin: 0 auto 18px !important;
                border: 3px solid white !important;
            }
            
            .popup-header-icon i {
                font-size: 26px !important;
                color: white !important;
            }
            
            /* Heading */
            .popup-main-heading {
                color: white !important;
                font-size: 24px !important;
                font-weight: 700 !important;
                margin: 0 0 18px 0 !important;
                text-align: center !important;
                font-family: 'Poppins', sans-serif !important;
            }
            
            /* Message Box */
            .popup-message-box {
                background: rgba(255, 255, 255, 0.12) !important;
                border-radius: 12px !important;
                padding: 20px !important;
                margin-bottom: 25px !important;
                border: 1px solid rgba(255, 255, 255, 0.25) !important;
            }
            
            .message-title {
                color: #ffb74d !important;
                font-size: 17px !important;
                font-weight: 700 !important;
                margin: 0 0 12px 0 !important;
                font-family: 'Poppins', sans-serif !important;
            }
            
            .message-text {
                color: white !important;
                font-size: 15px !important;
                line-height: 1.5 !important;
                margin: 0 0 15px 0 !important;
                font-family: 'Poppins', sans-serif !important;
            }
            
            .message-time {
                display: flex !important;
                align-items: center !important;
                gap: 10px !important;
                color: #00d46e !important;
                font-size: 14px !important;
                font-family: 'Poppins', sans-serif !important;
            }
            
            /* ========== BUTTONS ROW ========== */
            .popup-buttons-row {
                display: flex !important;
                gap: 15px !important;
                width: 100% !important;
            }
            
            /* Action Buttons (Using <a> tags) */
            .popup-action-button {
                border-radius: 10px !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                min-height: 52px !important;
                border: 2px solid transparent !important;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.25) !important;
                text-decoration: none !important;
                pointer-events: auto !important; /* Make it clickable */
                user-select: none !important;
            }
            
            .popup-action-button i,
            .popup-action-button span {
                font-weight: 700 !important;
                font-size: 16px !important;
                font-family: 'Poppins', sans-serif !important;
                pointer-events: none !important; /* Prevent double events */
            }
            
            /* Call Button - 65% width */
            .call-action-btn {
                flex: 0 0 65% !important; /* 65% width */
                background: linear-gradient(135deg, #00bf62, #00d46e) !important;
                color: white !important;
                border-color: #00bf62 !important;
                gap: 10px !important;
            }
            
            .call-action-btn:hover {
                background: linear-gradient(135deg, #00d46e, #00bf62) !important;
                transform: translateY(-3px) !important;
                box-shadow: 0 8px 20px rgba(0, 191, 98, 0.5) !important;
            }
            
            /* Close Button - 35% width */
            .close-action-btn {
                flex: 0 0 35% !important; /* 35% width */
                background: #ff4757 !important;
                color: white !important;
                border-color: #ff4757 !important;
            }
            
            .close-action-btn:hover {
                background: #ff6b81 !important;
                border-color: #ff6b81 !important;
                transform: translateY(-3px) !important;
                box-shadow: 0 8px 20px rgba(255, 107, 129, 0.5) !important;
            }
            
            /* Mobile Responsive */
            @media (max-width: 480px) {
                .event-popup-window {
                    max-width: 320px !important;
                    padding: 25px 20px 20px !important;
                    border-radius: 12px !important;
                }
                
                .popup-close-x {
                    top: -15px !important;
                    right: -15px !important;
                    width: 36px !important;
                    height: 36px !important;
                    border-width: 2.5px !important;
                }
                
                .popup-close-x svg {
                    width: 14px !important;
                    height: 14px !important;
                }
                
                .popup-header-icon {
                    width: 60px !important;
                    height: 60px !important;
                }
                
                .popup-header-icon i {
                    font-size: 24px !important;
                }
                
                .popup-main-heading {
                    font-size: 22px !important;
                }
                
                .popup-message-box {
                    padding: 18px !important;
                }
                
                .message-title {
                    font-size: 16px !important;
                }
                
                .message-text {
                    font-size: 14px !important;
                }
                
                .popup-buttons-row {
                    gap: 12px !important;
                }
                
                .popup-action-button {
                    min-height: 48px !important;
                }
                
                .popup-action-button i,
                .popup-action-button span {
                    font-size: 15px !important;
                }
            }
            
            /* Force override ALL inherited styles */
            .event-popup-container * {
                box-sizing: border-box !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            
            /* Reset any <a> tag styles */
            .popup-close-x,
            .popup-action-button {
                all: initial !important;
                font-family: 'Poppins', sans-serif !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                text-decoration: none !important;
            }
        `;

        document.head.appendChild(style);
    }
})();