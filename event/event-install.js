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
            
            // Check if event.js exists and has events
            let hasEvents = false;
            
            // First, check if file exists
            try {
                const response = await fetch('event/event.js');
                if (response.ok) {
                    const content = await response.text();
                    console.log('📄 Event.js content length:', content.length);
                    
                    // Check if we have events
                    hasEvents = content.includes('const events') && 
                                content.includes('title') &&
                                content.length > 50; // Simple check for content
                    
                    console.log('📋 Has events:', hasEvents);
                } else {
                    console.log('❌ Event file not found');
                }
            } catch (error) {
                console.log('❌ Error fetching event file:', error.message);
            }

            // If no events or file doesn't exist, use default admission event
            if (!hasEvents) {
                console.log('📝 Using default admission event');
                // Create a default event if none exists
                const defaultEvent = {
                    title: "Admission Open",
                    description: "Nursery Class Registration",
                    details: "Limited seats available. Visit office for forms."
                };
                showPopup(defaultEvent);
            } else {
                console.log('🚀 Showing popup from events file...');
                showPopup();
            }

        } catch (error) {
            console.log('❌ Popup error:', error.message);
            // Show default popup even on error
            const defaultEvent = {
                title: "Admission Open",
                description: "Nursery Class Registration",
                details: "Limited seats available. Visit office for forms."
            };
            showPopup(defaultEvent);
        }
    }

    function showPopup(eventData) {
        // Check if already closed
        if (localStorage.getItem('eventPopupClosed')) {
            console.log('⏸️ Popup was closed before');
            return;
        }

        console.log('🎬 Creating popup HTML...');

        const popupHTML = `
            <div class="event-popup-container" id="eventPopupContainer">
                <div class="event-popup-card">
                    <!-- Top-right close X -->
                    <div class="event-popup-close-btn" id="eventPopupCloseBtn">
                        <svg width="14" height="14" viewBox="0 0 24 24">
                            <path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                        </svg>
                    </div>
                    
                    <!-- Icon -->
                    <div class="event-popup-icon">
                        <i class="fas fa-bullhorn"></i>
                    </div>
                    
                    <!-- Title -->
                    <h3 class="event-popup-title">Admission Open</h3>
                    
                    <!-- Message -->
                    <div class="event-popup-message">
                        <p class="event-popup-strong-text">Nursery Class Registration</p>
                        <p class="event-popup-normal-text">Limited seats available. Visit office for forms.</p>
                        <div class="event-popup-time-info">
                            <i class="fas fa-clock"></i>
                            <span>9 AM - 12 Noon</span>
                        </div>
                    </div>
                    
                    <!-- Buttons -->
                    <div class="event-popup-buttons-container">
                        <a href="tel:+917333574759" class="event-popup-call-btn" id="eventPopupCallBtn">
                            <i class="fas fa-phone"></i>
                            <span>Call Now</span>
                        </a>
                        <div class="event-popup-close-main-btn" id="eventPopupCloseMainBtn">
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

        const popupContainer = document.getElementById('eventPopupContainer');
        const closeMainBtn = document.getElementById('eventPopupCloseMainBtn');
        const closeXBtn = document.getElementById('eventPopupCloseBtn');
        const callBtn = document.getElementById('eventPopupCallBtn');

        if (popupContainer) {
            console.log('✅ Popup element found');

            // Force show the popup
            setTimeout(() => {
                popupContainer.style.opacity = '1';
                popupContainer.style.visibility = 'visible';
                console.log('👁️ Popup should be visible now');
            }, 100);

            // Close function
            const closePopup = () => {
                console.log('🔴 Closing popup');
                popupContainer.style.opacity = '0';
                popupContainer.style.visibility = 'hidden';
                setTimeout(() => {
                    if (popupContainer.parentNode) {
                        popupContainer.remove();
                    }
                    localStorage.setItem('eventPopupClosed', 'true');
                    console.log('🗑️ Popup removed');
                }, 300);
            };

            // Add click events
            if (closeMainBtn) {
                closeMainBtn.addEventListener('click', closePopup);
                console.log('✅ Close button listener added');
            }

            if (closeXBtn) {
                closeXBtn.addEventListener('click', closePopup);
                console.log('✅ X button listener added');
            }

            // Call button functionality
            if (callBtn) {
                callBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    console.log('📞 Call button clicked');
                    // The link will handle the call
                    setTimeout(closePopup, 100);
                });
            }

            // Close on overlay click
            popupContainer.addEventListener('click', function(e) {
                if (e.target === popupContainer) {
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
        if (document.getElementById('event-popup-styles')) {
            console.log('✅ CSS already added');
            return;
        }

        console.log('🎨 Adding popup CSS...');

        const style = document.createElement('style');
        style.id = 'event-popup-styles';
        style.textContent = `
            /* ========== POPUP CONTAINER ========== */
            .event-popup-container {
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
            
            /* ========== POPUP CARD ========== */
            .event-popup-card {
                background: linear-gradient(135deg, #004aad, #0066cc) !important;
                border-radius: 15px !important;
                padding: 30px 25px 25px !important;
                width: 100% !important;
                max-width: 380px !important;
                border: 3px solid #00bf62 !important;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6) !important;
                position: relative !important;
                animation: eventPopupShow 0.4s ease !important;
                pointer-events: auto !important;
            }
            
            @keyframes eventPopupShow {
                from {
                    transform: translateY(-20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            /* ========== CLOSE X BUTTON ========== */
            .event-popup-close-btn {
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
            
            .event-popup-close-btn:hover {
                background: #ff6b81 !important;
                transform: rotate(90deg) scale(1.1) !important;
            }
            
            /* ========== ICON ========== */
            .event-popup-icon {
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
            
            .event-popup-icon i {
                font-size: 26px !important;
                color: white !important;
            }
            
            /* ========== TITLE ========== */
            .event-popup-title {
                color: white !important;
                font-size: 24px !important;
                font-weight: 700 !important;
                text-align: center !important;
                margin: 0 0 20px 0 !important;
                font-family: 'Poppins', sans-serif !important;
            }
            
            /* ========== MESSAGE ========== */
            .event-popup-message {
                background: rgba(255, 255, 255, 0.1) !important;
                border-radius: 12px !important;
                padding: 20px !important;
                margin-bottom: 25px !important;
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
            }
            
            .event-popup-strong-text {
                color: #ffb74d !important;
                font-size: 17px !important;
                font-weight: 700 !important;
                margin: 0 0 12px 0 !important;
                font-family: 'Poppins', sans-serif !important;
            }
            
            .event-popup-normal-text {
                color: white !important;
                font-size: 15px !important;
                line-height: 1.5 !important;
                margin: 0 0 15px 0 !important;
                font-family: 'Poppins', sans-serif !important;
            }
            
            .event-popup-time-info {
                display: flex !important;
                align-items: center !important;
                gap: 10px !important;
                color: #00d46e !important;
                font-size: 14px !important;
                font-family: 'Poppins', sans-serif !important;
            }
            
            /* ========== BUTTONS CONTAINER ========== */
            .event-popup-buttons-container {
                display: flex !important;
                gap: 15px !important;
                width: 100% !important;
            }
            
            /* ========== CALL BUTTON (65%) ========== */
            .event-popup-call-btn {
                flex: 0 0 65% !important;
                background: linear-gradient(135deg, #00bf62, #00d46e) !important;
                color: white !important;
                border: 2px solid #00bf62 !important;
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
                text-decoration: none !important;
                pointer-events: auto !important;
                gap: 10px !important;
            }
            
            .event-popup-call-btn:hover {
                background: linear-gradient(135deg, #00d46e, #00bf62) !important;
                transform: translateY(-3px) !important;
                box-shadow: 0 8px 20px rgba(0, 191, 98, 0.5) !important;
            }
            
            /* ========== CLOSE BUTTON (35%) ========== */
            .event-popup-close-main-btn {
                flex: 0 0 35% !important;
                background: #ff4757 !important;
                color: white !important;
                border: 2px solid #ff4757 !important;
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
                pointer-events: auto !important;
            }
            
            .event-popup-close-main-btn:hover {
                background: #ff6b81 !important;
                border-color: #ff6b81 !important;
                transform: translateY(-3px) !important;
                box-shadow: 0 8px 20px rgba(255, 107, 129, 0.5) !important;
            }
            
            /* ========== MOBILE RESPONSIVE ========== */
            @media (max-width: 480px) {
                .event-popup-card {
                    max-width: 320px !important;
                    padding: 25px 20px 20px !important;
                }
                
                .event-popup-close-btn {
                    top: -12px !important;
                    right: -12px !important;
                    width: 36px !important;
                    height: 36px !important;
                }
                
                .event-popup-icon {
                    width: 60px !important;
                    height: 60px !important;
                }
                
                .event-popup-title {
                    font-size: 22px !important;
                }
                
                .event-popup-buttons-container {
                    gap: 12px !important;
                }
                
                .event-popup-call-btn,
                .event-popup-close-main-btn {
                    min-height: 48px !important;
                    font-size: 15px !important;
                }
                
                .event-popup-call-btn {
                    flex: 0 0 65% !important;
                }
                
                .event-popup-close-main-btn {
                    flex: 0 0 35% !important;
                }
            }
        `;

        document.head.appendChild(style);
        console.log('✅ CSS added to head');
    }

    console.log('✅ Event popup script ready');
})();