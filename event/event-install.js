// event/event-install.js
(function() {
    'use strict';

    console.log('🎯 Event popup script STARTED');

    // Global variable to store events
    let eventsData = null;

    // Function to get events from global scope
    function getEventsData() {
        // Check if events is already defined globally
        if (typeof events !== 'undefined' && Array.isArray(events) && events.length > 0) {
            console.log('✅ Events found in global scope:', events);
            return events;
        }
        
        // Try to access from window object
        if (window.events && Array.isArray(window.events) && window.events.length > 0) {
            console.log('✅ Events found in window.events:', window.events);
            return window.events;
        }
        
        console.warn('⚠️ No events found in global scope');
        return null;
    }

    // Load only after everything is ready
    window.addEventListener('load', function() {
        console.log('✅ Page fully loaded, checking for events...');
        
        // Wait a bit for event.js to load
        setTimeout(function() {
            eventsData = getEventsData();
            
            if (eventsData && eventsData.length > 0) {
                console.log('📢 Displaying event:', eventsData[0]);
                showPopup(eventsData[0]);
            } else {
                console.error('❌ No events data available');
            }
        }, 500);
    });

    function showPopup(eventData) {
        if (!eventData) {
            console.log('❌ No event data to display');
            return;
        }

        console.log('🔄 Creating popup for:', eventData.title);

        // Check if already closed - but only for 24 hours
        const lastClosed = localStorage.getItem('eventPopupClosed');
        if (lastClosed) {
            const lastClosedTime = new Date(lastClosed).getTime();
            const now = new Date().getTime();
            const hoursSinceClosed = (now - lastClosedTime) / (1000 * 60 * 60);

            if (hoursSinceClosed < 24) {
                console.log('⏸️ Popup was closed recently, not showing');
                return;
            }
        }

        console.log('🚀 Creating popup...');

        // Add CSS
        addPopupCSS();

        setTimeout(function() {
            // Determine icon based on event type
            let iconHtml = '<i class="fas fa-bullhorn"></i>';
            if (eventData.type === 'result') {
                iconHtml = '<i class="fas fa-chart-line"></i>';
            } else if (eventData.type === 'greeting') {
                iconHtml = '<i class="fas fa-gift"></i>';
            } else if (eventData.type === 'admission') {
                iconHtml = '<i class="fas fa-graduation-cap"></i>';
            }

            // Determine title based on event type
            let popupTitle = '📢 Important Update';
            if (eventData.type === 'result') {
                popupTitle = '📊 Result Announcement';
            } else if (eventData.type === 'greeting') {
                popupTitle = '🎉 Special Greeting';
            } else if (eventData.type === 'admission') {
                popupTitle = '📝 Admission Update';
            }

            // Format message
            let messageHtml = `
                <p class="event-popup-strong-text">${escapeHtml(eventData.title)}</p>
                <p class="event-popup-normal-text">${escapeHtml(eventData.description)}</p>
                <div class="event-popup-time-info">
                    <i class="fas fa-calendar-alt"></i>
                    <span>${escapeHtml(eventData.date)}</span>
                </div>
            `;

            // Add details if present
            if (eventData.details) {
                messageHtml += `
                    <div class="event-popup-details">
                        <i class="fas fa-info-circle"></i>
                        <span>${escapeHtml(eventData.details)}</span>
                    </div>
                `;
            }

            // Create popup HTML
            const popupHTML = `
                <div class="event-popup-container" id="eventPopupContainer" style="opacity: 0; visibility: hidden;">
                    <div class="event-popup-card">
                        <div class="event-popup-close-btn" id="eventPopupCloseBtn">
                            <svg width="14" height="14" viewBox="0 0 24 24">
                                <path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                            </svg>
                        </div>
                        
                        <div class="event-popup-icon">
                            ${iconHtml}
                        </div>
                        
                        <h3 class="event-popup-title">${popupTitle}</h3>
                        
                        <div class="event-popup-message">
                            ${messageHtml}
                        </div>
                        
                        <div class="event-popup-buttons-container">
                            <a href="tel:+917333574759" class="event-popup-call-btn" id="eventPopupCallBtn">
                                <i class="fas fa-phone"></i>
                                <span>Call School</span>
                            </a>
                            <div class="event-popup-close-main-btn" id="eventPopupCloseMainBtn">
                                <span>Close</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', popupHTML);
            setupPopupEvents();
        }, 50);
    }

    function setupPopupEvents() {
        const popupContainer = document.getElementById('eventPopupContainer');
        if (!popupContainer) {
            console.error('❌ Popup container not found');
            return;
        }

        const closeMainBtn = document.getElementById('eventPopupCloseMainBtn');
        const closeXBtn = document.getElementById('eventPopupCloseBtn');
        const callBtn = document.getElementById('eventPopupCallBtn');

        // Show popup
        setTimeout(() => {
            popupContainer.style.opacity = '1';
            popupContainer.style.visibility = 'visible';
        }, 100);

        const closePopup = () => {
            popupContainer.style.opacity = '0';
            popupContainer.style.visibility = 'hidden';
            setTimeout(() => {
                if (popupContainer && popupContainer.parentNode) {
                    popupContainer.remove();
                }
                localStorage.setItem('eventPopupClosed', new Date().toISOString());
            }, 300);
        };

        if (closeMainBtn) closeMainBtn.addEventListener('click', closePopup);
        if (closeXBtn) closeXBtn.addEventListener('click', closePopup);
        if (callBtn) {
            callBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                setTimeout(closePopup, 100);
            });
        }

        popupContainer.addEventListener('click', function(e) {
            if (e.target === popupContainer) closePopup();
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closePopup();
        });
    }

    function addPopupCSS() {
        if (document.getElementById('event-popup-styles')) return;

        const style = document.createElement('style');
        style.id = 'event-popup-styles';
        style.textContent = `
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
                transition: opacity 0.3s ease !important;
                padding: 20px !important;
            }
            
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
            }
            
            @keyframes eventPopupShow {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
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
            }
            
            .event-popup-close-btn:hover {
                background: #ff6b81 !important;
                transform: rotate(90deg) scale(1.1) !important;
            }
            
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
            
            .event-popup-title {
                color: white !important;
                font-size: 22px !important;
                font-weight: 700 !important;
                text-align: center !important;
                margin: 0 0 20px 0 !important;
                font-family: 'Poppins', sans-serif !important;
            }
            
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
                font-size: 14px !important;
                line-height: 1.5 !important;
                margin: 0 0 15px 0 !important;
                font-family: 'Poppins', sans-serif !important;
            }
            
            .event-popup-time-info {
                display: flex !important;
                align-items: center !important;
                gap: 10px !important;
                color: #00d46e !important;
                font-size: 13px !important;
                font-family: 'Poppins', sans-serif !important;
            }
            
            .event-popup-details {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                margin-top: 12px !important;
                padding-top: 10px !important;
                border-top: 1px solid rgba(255,255,255,0.2) !important;
                font-size: 12px !important;
                color: rgba(255,255,255,0.8) !important;
            }
            
            .event-popup-buttons-container {
                display: flex !important;
                gap: 15px !important;
                width: 100% !important;
            }
            
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
                font-size: 15px !important;
                font-family: 'Poppins', sans-serif !important;
                cursor: pointer !important;
                text-decoration: none !important;
                gap: 8px !important;
            }
            
            .event-popup-call-btn:hover {
                transform: translateY(-3px) !important;
                box-shadow: 0 8px 20px rgba(0, 191, 98, 0.5) !important;
            }
            
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
                font-size: 15px !important;
                font-family: 'Poppins', sans-serif !important;
                cursor: pointer !important;
            }
            
            .event-popup-close-main-btn:hover {
                background: #ff6b81 !important;
                transform: translateY(-3px) !important;
            }
            
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
                    font-size: 20px !important;
                }
                .event-popup-call-btn,
                .event-popup-close-main-btn {
                    min-height: 48px !important;
                    font-size: 14px !important;
                }
            }
        `;

        document.head.appendChild(style);
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    console.log('✅ Event popup script ready');
})();