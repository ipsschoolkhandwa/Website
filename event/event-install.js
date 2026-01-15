// event/event-install.js - POPUP VERSION
(function() {
    'use strict';
    
    // Wait for page to load
    window.addEventListener('load', function() {
        setTimeout(checkAndAddEvents, 2000); // 2 second delay for popup
    });
    
    async function checkAndAddEvents() {
        try {
            // Load event.js file
            const response = await fetch('event/event.js');
            if (!response.ok) return;
            
            const content = await response.text();
            
            // Check if we have events
            if (!content.includes('const events') || !content.includes('[') || !content.includes(']')) {
                return;
            }
            
            // Find the array content
            const start = content.indexOf('[');
            const end = content.lastIndexOf(']');
            
            if (start === -1 || end === -1 || start >= end) return;
            
            const arrayContent = content.substring(start, end + 1);
            
            // Check if array has actual content
            if (arrayContent === '[]' || arrayContent.trim().length < 10) return;
            
            // If we got here, we have events - show popup
            showEventsPopup();
            
        } catch (error) {
            console.log('Events popup error:', error.message);
        }
    }
    
    function showEventsPopup() {
        // Check if user closed popup before
        if (localStorage.getItem('eventsPopupClosed') === 'true') {
            return;
        }
        
        // Create popup overlay
        const popupHTML = `
            <div class="events-popup-overlay" id="eventsPopup">
                <div class="events-popup-box">
                    <button class="popup-close" id="popupCloseBtn">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    <div class="popup-header">
                        <div class="popup-icon">
                            <i class="fas fa-bullhorn"></i>
                        </div>
                        <h2>Important Announcement</h2>
                    </div>
                    
                    <div class="popup-content">
                        <div class="popup-event">
                            <div class="event-icon-popup">
                                <i class="fas fa-child"></i>
                            </div>
                            <div class="event-details-popup">
                                <h3>Admission Registration</h3>
                                <p class="event-desc">Registration for Nursery class. Limited seats available. Early registration recommended.</p>
                                <p class="event-info"><i class="fas fa-info-circle"></i> Visit school office for forms between 9 AM to 12 Noon</p>
                                
                                <div class="event-footer-popup">
                                    <div class="event-status">
                                        <i class="fas fa-circle"></i> Ongoing
                                    </div>
                                    <div class="event-tag">
                                        Admission
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="popup-actions">
                        <button class="popup-action-btn action-close" id="closePopup">
                            Close
                        </button>
                        <button class="popup-action-btn action-call" id="callFromPopup">
                            <i class="fas fa-phone"></i> Call Now
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add CSS
        addPopupCSS();
        
        // Insert popup at the end of body
        document.body.insertAdjacentHTML('beforeend', popupHTML);
        
        // Setup close functionality
        const popup = document.getElementById('eventsPopup');
        const closeBtn = document.getElementById('closePopup');
        const popupCloseBtn = document.getElementById('popupCloseBtn');
        const callBtn = document.getElementById('callFromPopup');
        
        if (popup) {
            // Show popup with animation
            setTimeout(() => {
                popup.classList.add('active');
            }, 100);
            
            // Close button
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    closePopup(popup);
                });
            }
            
            // X button
            if (popupCloseBtn) {
                popupCloseBtn.addEventListener('click', function() {
                    closePopup(popup);
                });
            }
            
            // Call button
            if (callBtn) {
                callBtn.addEventListener('click', function() {
                    window.location.href = 'tel:+917333574759';
                });
            }
            
            // Close on overlay click
            popup.addEventListener('click', function(e) {
                if (e.target === popup) {
                    closePopup(popup);
                }
            });
            
            // Prevent closing for 3 seconds
            setTimeout(() => {
                window.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape') {
                        closePopup(popup);
                    }
                });
            }, 3000);
        }
    }
    
    function closePopup(popup) {
        if (!popup) return;
        
        popup.classList.remove('active');
        popup.classList.add('closing');
        
        setTimeout(() => {
            popup.remove();
            localStorage.setItem('eventsPopupClosed', 'true');
        }, 300);
    }
    
    function addPopupCSS() {
        // Check if CSS already added
        if (document.getElementById('popup-css')) return;
        
        const style = document.createElement('style');
        style.id = 'popup-css';
        style.textContent = `
            /* Popup Overlay */
            .events-popup-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                padding: 20px;
                backdrop-filter: blur(5px);
            }
            
            .events-popup-overlay.active {
                opacity: 1;
                visibility: visible;
            }
            
            .events-popup-overlay.closing {
                opacity: 0;
            }
            
            /* Popup Box */
            .events-popup-box {
                background: linear-gradient(135deg, #004aad, #0066cc);
                border-radius: 25px;
                padding: 30px;
                max-width: 500px;
                width: 100%;
                position: relative;
                border: 4px solid #00bf62;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
                transform: scale(0.9);
                transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            
            .events-popup-overlay.active .events-popup-box {
                transform: scale(1);
            }
            
            .events-popup-overlay.closing .events-popup-box {
                transform: scale(0.9);
            }
            
            /* Close Button (Top Right) */
            .popup-close {
                position: absolute;
                top: 15px;
                right: 15px;
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.15);
                border: 2px solid #efa12e;
                color: white;
                font-size: 20px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                z-index: 10;
            }
            
            .popup-close:hover {
                background: #efa12e;
                transform: rotate(90deg) scale(1.1);
                color: #004aad;
                box-shadow: 0 0 15px rgba(239, 161, 46, 0.5);
            }
            
            /* Popup Header */
            .popup-header {
                text-align: center;
                margin-bottom: 25px;
                padding-bottom: 20px;
                border-bottom: 2px solid rgba(255, 255, 255, 0.1);
            }
            
            .popup-icon {
                width: 70px;
                height: 70px;
                background: linear-gradient(135deg, #00bf62, #00d46e);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 15px;
                border: 3px solid white;
                box-shadow: 0 0 20px rgba(0, 191, 98, 0.5);
            }
            
            .popup-icon i {
                font-size: 32px;
                color: white;
            }
            
            .popup-header h2 {
                color: white;
                font-size: 26px;
                margin: 0;
                font-weight: 700;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            }
            
            /* Popup Content */
            .popup-event {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 25px;
                margin-bottom: 25px;
                border: 2px solid rgba(239, 161, 46, 0.3);
                animation: pulseBorder 2s infinite;
            }
            
            @keyframes pulseBorder {
                0%, 100% { border-color: rgba(239, 161, 46, 0.3); }
                50% { border-color: rgba(239, 161, 46, 0.7); }
            }
            
            .event-icon-popup {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #efa12e, #ffb74d);
                border-radius: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                border: 3px solid white;
                box-shadow: 0 5px 15px rgba(239, 161, 46, 0.4);
            }
            
            .event-icon-popup i {
                font-size: 36px;
                color: white;
            }
            
            .event-details-popup h3 {
                color: white;
                font-size: 22px;
                margin: 0 0 15px 0;
                text-align: center;
                font-weight: 700;
            }
            
            .event-desc {
                color: #e3f2fd;
                line-height: 1.6;
                margin: 0 0 15px 0;
                text-align: center;
                font-size: 16px;
            }
            
            .event-info {
                color: #00d46e !important;
                background: rgba(0, 191, 98, 0.15);
                padding: 12px;
                border-radius: 10px;
                margin: 0 0 20px 0;
                font-size: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                border: 1px solid rgba(0, 191, 98, 0.3);
            }
            
            .event-footer-popup {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .event-status {
                color: #ffb74d;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
            }
            
            .event-status i {
                color: #00bf62;
                font-size: 10px;
                animation: blinkStatus 1.5s infinite;
            }
            
            @keyframes blinkStatus {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
            }
            
            .event-tag {
                background: #efa12e;
                color: #004aad;
                padding: 6px 18px;
                border-radius: 20px;
                font-weight: 700;
                font-size: 13px;
                letter-spacing: 1px;
                box-shadow: 0 3px 10px rgba(239, 161, 46, 0.3);
            }
            
            /* Popup Actions */
            .popup-actions {
                display: flex;
                gap: 15px;
                margin-top: 20px;
            }
            
            .popup-action-btn {
                flex: 1;
                padding: 16px;
                border: none;
                border-radius: 12px;
                font-size: 16px;
                font-weight: 700;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                transition: all 0.3s ease;
            }
            
            .action-close {
                background: rgba(255, 255, 255, 0.15);
                color: white;
                border: 2px solid rgba(255, 255, 255, 0.3);
            }
            
            .action-close:hover {
                background: rgba(255, 255, 255, 0.25);
                transform: translateY(-2px);
            }
            
            .action-call {
                background: linear-gradient(135deg, #00bf62, #00d46e);
                color: white;
                border: 2px solid #00bf62;
            }
            
            .action-call:hover {
                background: linear-gradient(135deg, #00d46e, #00bf62);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 191, 98, 0.4);
            }
            
            /* Responsive */
            @media (max-width: 600px) {
                .events-popup-box {
                    padding: 25px 20px;
                    border-radius: 20px;
                }
                
                .popup-header h2 {
                    font-size: 22px;
                }
                
                .popup-icon {
                    width: 60px;
                    height: 60px;
                }
                
                .popup-icon i {
                    font-size: 28px;
                }
                
                .event-icon-popup {
                    width: 70px;
                    height: 70px;
                }
                
                .event-details-popup h3 {
                    font-size: 20px;
                }
                
                .event-desc {
                    font-size: 15px;
                }
                
                .popup-actions {
                    flex-direction: column;
                }
                
                .popup-action-btn {
                    padding: 14px;
                }
            }
            
            @media (max-width: 400px) {
                .events-popup-box {
                    padding: 20px 15px;
                }
                
                .popup-header h2 {
                    font-size: 20px;
                }
                
                .event-details-popup h3 {
                    font-size: 18px;
                }
                
                .event-desc, .event-info {
                    font-size: 14px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
})();