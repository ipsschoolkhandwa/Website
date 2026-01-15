// event/event-install.js - WORKING VERSION
(function() {
    'use strict';

    // Debug: Check if script is loading
    console.log('✅ Event popup script loading...');

    window.addEventListener('load', function() {
        console.log('✅ Page loaded, checking events...');
        setTimeout(checkAndAddEvents, 1500);
    });

    async function checkAndAddEvents() {
        try {
            console.log('🔍 Checking event.js file...');
            const response = await fetch('event/event.js');
            
            if (!response.ok) {
                console.log('❌ Event file not found');
                return;
            }

            const content = await response.text();
            console.log('📄 Event.js content length:', content.length);

            // Check if we have events
            const hasEvents = content.includes('const events') && 
                             !content.includes('const events = []') &&
                             !content.includes('const events=[]');
            
            console.log('📋 Has events:', hasEvents);

            if (!hasEvents) {
                console.log('⏸️ No events found, skipping popup');
                return;
            }

            console.log('🚀 Showing popup...');
            showPopup();

        } catch (error) {
            console.log('❌ Popup error:', error.message);
        }
    }

    function showPopup() {
        // Check if already closed
        if (localStorage.getItem('eventPopupClosed')) {
            console.log('⏸️ Popup was closed before');
            return;
        }

        console.log('🎬 Creating popup HTML...');

        const popupHTML = `
            <div class="event-popup-main" id="eventPopupMain">
                <div class="event-popup-content">
                    <!-- Top-right close X -->
                    <div class="popup-x-close" id="popupXClose">
                        <svg width="14" height="14" viewBox="0 0 24 24">
                            <path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                        </svg>
                    </div>
                    
                    <!-- Icon -->
                    <div class="popup-icon-main">
                        <i class="fas fa-bullhorn"></i>
                    </div>
                    
                    <!-- Title -->
                    <h3 class="popup-title-main">Admission Open</h3>
                    
                    <!-- Message -->
                    <div class="popup-message-main">
                        <p class="popup-strong">Nursery Class Registration</p>
                        <p class="popup-text">Limited seats available. Visit office for forms.</p>
                        <div class="popup-time">
                            <i class="fas fa-clock"></i>
                            <span>9 AM - 12 Noon</span>
                        </div>
                    </div>
                    
                    <!-- Buttons -->
                    <div class="popup-buttons-main">
                        <a href="tel:+917333574759" class="popup-btn call-popup-btn">
                            <i class="fas fa-phone"></i>
                            <span>Call Now</span>
                        </a>
                        <div class="popup-btn close-popup-btn" id="popupCloseMain">
                            <span>Close</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add CSS FIRST
        addPopupCSS();
        
        // Then add HTML
        document.body.insertAdjacentHTML('beforeend', popupHTML);
        
        console.log('✅ Popup HTML added');

        const popup = document.getElementById('eventPopupMain');
        const closeBtn = document.getElementById('popupCloseMain');
        const closeX = document.getElementById('popupXClose');

        if (popup) {
            console.log('✅ Popup element found');
            
            // Force show the popup
            setTimeout(() => {
                popup.style.opacity = '1';
                popup.style.visibility = 'visible';
                console.log('👁️ Popup should be visible now');
            }, 100);

            // Close function
            const closePopup = () => {
                console.log('🔴 Closing popup');
                popup.style.opacity = '0';
                popup.style.visibility = 'hidden';
                setTimeout(() => {
                    if (popup.parentNode) {
                        popup.remove();
                    }
                    localStorage.setItem('eventPopupClosed', 'true');
                    console.log('🗑️ Popup removed');
                }, 300);
            };

            // Add click events
            if (closeBtn) {
                closeBtn.addEventListener('click', closePopup);
                console.log('✅ Close button listener added');
            }
            
            if (closeX) {
                closeX.addEventListener('click', closePopup);
                console.log('✅ X button listener added');
            }

            // Close on overlay click
            popup.addEventListener('click', function(e) {
                if (e.target === popup) {
                    closePopup();
                }
            });

            // Close on ESC
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') closePopup();
            });

        } else {
            console.log('❌ Popup element NOT found!');
        }
    }

    function addPopupCSS() {
        if (document.getElementById('popup-main-css')) {
            console.log('✅ CSS already added');
            return;
        }

        console.log('🎨 Adding popup CSS...');

        const style = document.createElement('style');
        style.id = 'popup-main-css';
        style.textContent = `
            /* ========== POPUP STYLES ========== */
            .event-popup-main {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background: rgba(0, 0, 0, 0.85) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                z-index: 999999 !important;
                opacity: 0 !important;
                visibility: hidden !important;
                transition: opacity 0.3s ease !important;
                padding: 20px !important;
                pointer-events: auto !important;
            }
            
            .event-popup-content {
                background: linear-gradient(135deg, #004aad, #0066cc) !important;
                border-radius: 15px !important;
                padding: 30px 25px 25px !important;
                width: 100% !important;
                max-width: 380px !important;
                border: 3px solid #00bf62 !important;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6) !important;
                position: relative !important;
                animation: popupShow 0.4s ease !important;
                pointer-events: auto !important;
            }
            
            @keyframes popupShow {
                from {
                    transform: translateY(-20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            /* Close X */
            .popup-x-close {
                position: absolute !important;
                top: -15px !important;
                right: -15px !important;
                width: 40px !important;
                height: 40px !important;
                border-radius: 50% !important;
                background: #ff4757 !important;
                border: 3px solid white !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
                z-index: 1000 !important;
                box-shadow: 0 5px 20px rgba(255, 71, 87, 0.5) !important;
            }
            
            .popup-x-close:hover {
                background: #ff6b81 !important;
                transform: rotate(90deg) scale(1.1) !important;
            }
            
            /* Icon */
            .popup-icon-main {
                width: 65px !important;
                height: 65px !important;
                background: linear-gradient(135deg, #00bf62, #00d46e) !important;
                border-radius: 50% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                margin: 0 auto 20px !important;
                border: 3px solid white !important;
            }
            
            .popup-icon-main i {
                font-size: 26px !important;
                color: white !important;
            }
            
            /* Title */
            .popup-title-main {
                color: white !important;
                font-size: 24px !important;
                font-weight: 700 !important;
                text-align: center !important;
                margin: 0 0 20px 0 !important;
                font-family: 'Poppins', sans-serif !important;
            }
            
            /* Message */
            .popup-message-main {
                background: rgba(255, 255, 255, 0.1) !important;
                border-radius: 12px !important;
                padding: 20px !important;
                margin-bottom: 25px !important;
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
            }
            
            .popup-strong {
                color: #ffb74d !important;
                font-size: 17px !important;
                font-weight: 700 !important;
                margin: 0 0 12px 0 !important;
                font-family: 'Poppins', sans-serif !important;
            }
            
            .popup-text {
                color: white !important;
                font-size: 15px !important;
                line-height: 1.5 !important;
                margin: 0 0 15px 0 !important;
                font-family: 'Poppins', sans-serif !important;
            }
            
            .popup-time {
                display: flex !important;
                align-items: center !important;
                gap: 10px !important;
                color: #00d46e !important;
                font-size: 14px !important;
                font-family: 'Poppins', sans-serif !important;
            }
            
            /* Buttons */
            .popup-buttons-main {
                display: flex !important;
                gap: 15px !important;
                width: 100% !important;
            }
            
            .popup-btn {
                border-radius: 10px !important;
                min-height: 52px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-weight: 700 !important;
                font-size: 16px !important;
                font-family: 'Poppins', sans-serif !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
                border: 2px solid transparent !important;
                text-decoration: none !important;
                pointer-events: auto !important;
            }
            
            .call-popup-btn {
                flex: 0 0 65% !important;
                background: linear-gradient(135deg, #00bf62, #00d46e) !important;
                color: white !important;
                border-color: #00bf62 !important;
                gap: 10px !important;
            }
            
            .call-popup-btn:hover {
                background: linear-gradient(135deg, #00d46e, #00bf62) !important;
                transform: translateY(-3px) !important;
                box-shadow: 0 8px 20px rgba(0, 191, 98, 0.5) !important;
            }
            
            .close-popup-btn {
                flex: 0 0 35% !important;
                background: #ff4757 !important;
                color: white !important;
                border-color: #ff4757 !important;
            }
            
            .close-popup-btn:hover {
                background: #ff6b81 !important;
                border-color: #ff6b81 !important;
                transform: translateY(-3px) !important;
                box-shadow: 0 8px 20px rgba(255, 107, 129, 0.5) !important;
            }
            
            /* Mobile */
            @media (max-width: 480px) {
                .event-popup-content {
                    max-width: 320px !important;
                    padding: 25px 20px 20px !important;
                }
                
                .popup-x-close {
                    top: -12px !important;
                    right: -12px !important;
                    width: 36px !important;
                    height: 36px !important;
                }
                
                .popup-icon-main {
                    width: 60px !important;
                    height: 60px !important;
                }
                
                .popup-title-main {
                    font-size: 22px !important;
                }
                
                .popup-buttons-main {
                    gap: 12px !important;
                }
                
                .popup-btn {
                    min-height: 48px !important;
                    font-size: 15px !important;
                }
            }
        `;

        document.head.appendChild(style);
        console.log('✅ CSS added to head');
    }

    console.log('✅ Event popup script ready');
})();