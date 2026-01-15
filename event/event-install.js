// event/event-install.js - COMPACT POPUP
(function() {
    'use strict';
    
    // Wait for page to load
    window.addEventListener('load', function() {
        setTimeout(checkAndAddEvents, 1500);
    });
    
    async function checkAndAddEvents() {
        try {
            // Load event.js file
            const response = await fetch('event/event.js');
            if (!response.ok) return;
            
            const content = await response.text();
            
            // Quick check for events
            if (!content.includes('const events') || 
                content.includes('const events = []') ||
                content.includes('const events=[]')) {
                return;
            }
            
            // Show popup
            showPopup();
            
        } catch (error) {
            console.log('Popup error:', error.message);
        }
    }
    
    function showPopup() {
        // Check if already closed
        if (localStorage.getItem('eventPopupClosed')) return;
        
        // Create compact popup
        const popupHTML = `
            <div class="event-popup" id="eventPopup">
                <div class="popup-card">
                    <button class="popup-close" id="popupClose">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                    
                    <div class="popup-icon">
                        <i class="fas fa-bullhorn"></i>
                    </div>
                    
                    <h3>Admission Open</h3>
                    
                    <div class="popup-content">
                        <p><strong>Nursery Class Registration</strong></p>
                        <p>Limited seats available. Early registration recommended.</p>
                        <div class="popup-note">
                            <i class="fas fa-clock"></i>
                            <span>Office hours: 9 AM - 12 Noon</span>
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
        
        // Setup interactions
        const popup = document.getElementById('eventPopup');
        const closeBtn = document.getElementById('popupCloseBtn');
        const xBtn = document.getElementById('popupClose');
        const callBtn = document.getElementById('popupCall');
        
        if (popup) {
            // Show with fade in
            setTimeout(() => popup.classList.add('show'), 50);
            
            // Close functions
            const closePopup = () => {
                popup.classList.remove('show');
                setTimeout(() => {
                    popup.remove();
                    localStorage.setItem('eventPopupClosed', 'true');
                }, 300);
            };
            
            // Close buttons
            if (closeBtn) closeBtn.addEventListener('click', closePopup);
            if (xBtn) xBtn.addEventListener('click', closePopup);
            
            // Call button
            if (callBtn) {
                callBtn.addEventListener('click', function() {
                    window.location.href = 'tel:+917333574759';
                });
            }
            
            // Close on ESC
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') closePopup();
            });
        }
    }
    
    function addPopupCSS() {
        if (document.getElementById('compact-popup-css')) return;
        
        const style = document.createElement('style');
        style.id = 'compact-popup-css';
        style.textContent = `
            /* Compact Popup */
            .event-popup {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease;
                padding: 20px;
            }
            
            .event-popup.show {
                opacity: 1;
                visibility: visible;
            }
            
            /* Popup Card */
            .popup-card {
                background: linear-gradient(135deg, #004aad, #0066cc);
                border-radius: 16px;
                padding: 25px;
                width: 100%;
                max-width: 380px;
                position: relative;
                border: 3px solid #00bf62;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
                transform: translateY(20px);
                transition: transform 0.3s ease;
            }
            
            .event-popup.show .popup-card {
                transform: translateY(0);
            }
            
            /* Close Button */
            .popup-close {
                position: absolute;
                top: 15px;
                right: 15px;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid #efa12e;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                padding: 0;
            }
            
            .popup-close:hover {
                background: #efa12e;
            }
            
            .popup-close:hover svg {
                transform: rotate(90deg);
            }
            
            .popup-close svg {
                transition: transform 0.3s ease;
                width: 16px;
                height: 16px;
            }
            
            /* Popup Icon */
            .popup-icon {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #00bf62, #00d46e);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 15px;
                border: 2px solid white;
            }
            
            .popup-icon i {
                font-size: 24px;
                color: white;
            }
            
            /* Popup Title */
            .popup-card h3 {
                color: white;
                font-size: 22px;
                text-align: center;
                margin: 0 0 15px 0;
                font-weight: 700;
            }
            
            /* Popup Content */
            .popup-content {
                background: rgba(255, 255, 255, 0.08);
                border-radius: 12px;
                padding: 15px;
                margin-bottom: 20px;
            }
            
            .popup-content p {
                color: white;
                margin: 0 0 10px 0;
                line-height: 1.5;
                font-size: 15px;
            }
            
            .popup-content p strong {
                color: #ffb74d;
            }
            
            .popup-note {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #00d46e;
                font-size: 14px;
                margin-top: 10px;
            }
            
            /* Popup Buttons */
            .popup-buttons {
                display: flex;
                gap: 12px;
            }
            
            .popup-btn {
                flex: 1;
                padding: 12px;
                border: none;
                border-radius: 10px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: all 0.2s ease;
            }
            
            .call-btn {
                background: linear-gradient(135deg, #00bf62, #00d46e);
                color: white;
                border: 2px solid #00bf62;
            }
            
            .call-btn:hover {
                background: linear-gradient(135deg, #00d46e, #00bf62);
                transform: translateY(-2px);
            }
            
            .close-btn {
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: 2px solid rgba(255, 255, 255, 0.3);
            }
            
            .close-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            /* Responsive */
            @media (max-width: 480px) {
                .popup-card {
                    padding: 20px;
                    max-width: 320px;
                }
                
                .popup-card h3 {
                    font-size: 20px;
                }
                
                .popup-content p {
                    font-size: 14px;
                }
                
                .popup-btn {
                    padding: 10px;
                    font-size: 14px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
})();