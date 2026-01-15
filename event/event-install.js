// event/event-install.js - NEW CLOSE BUTTON NEXT TO CALL BUTTON
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
            <div class="event-popup-main" id="eventPopupMain">
                <div class="event-popup-card">
                    <!-- NO CIRCULAR CLOSE BUTTON HERE -->
                    
                    <div class="popup-main-icon">
                        <i class="fas fa-bullhorn"></i>
                    </div>
                    
                    <h3 class="popup-main-title">Admission Open</h3>
                    
                    <div class="popup-main-content">
                        <p><strong>Nursery Class Registration</strong></p>
                        <p>Limited seats available. Visit office for forms.</p>
                        <div class="popup-time-note">
                            <i class="fas fa-clock"></i>
                            <span>9 AM - 12 Noon</span>
                        </div>
                    </div>
                    
                    <!-- NEW BUTTONS LAYOUT -->
                    <div class="popup-action-row">
                        <div class="action-call-button" id="actionCallBtn">
                            <i class="fas fa-phone"></i> Call Now
                        </div>
                        <div class="action-close-button" id="actionCloseBtn">
                            Close
                        </div>
                    </div>
                </div>
            </div>
        `;

        addPopupCSS();
        document.body.insertAdjacentHTML('beforeend', popupHTML);

        const popup = document.getElementById('eventPopupMain');
        const closeBtn = document.getElementById('actionCloseBtn');
        const callBtn = document.getElementById('actionCallBtn');

        if (popup) {
            setTimeout(() => popup.classList.add('show-popup'), 50);

            const closePopup = () => {
                popup.classList.remove('show-popup');
                setTimeout(() => {
                    popup.remove();
                    localStorage.setItem('eventPopupClosed', 'true');
                }, 200);
            };

            if (closeBtn) closeBtn.addEventListener('click', closePopup);

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
        if (document.getElementById('new-popup-css')) return;

        const style = document.createElement('style');
        style.id = 'new-popup-css';
        style.textContent = `
            /* New Popup - No conflicting classes */
            .event-popup-main {
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
                padding: 20px;
            }
            
            .event-popup-main.show-popup {
                opacity: 1;
                visibility: visible;
            }
            
            .event-popup-card {
                background: linear-gradient(135deg, #004aad, #0066cc);
                border-radius: 15px;
                padding: 25px;
                width: 100%;
                max-width: 350px;
                border: 3px solid #00bf62;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
                position: relative;
            }
            
            /* Main Icon */
            .popup-main-icon {
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
            
            .popup-main-icon i {
                font-size: 24px;
                color: white;
            }
            
            /* Title */
            .popup-main-title {
                color: white;
                font-size: 22px;
                text-align: center;
                margin: 0 0 15px 0;
                font-weight: 700;
                font-family: 'Poppins', sans-serif;
            }
            
            /* Content */
            .popup-main-content {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                padding: 15px;
                margin-bottom: 20px;
            }
            
            .popup-main-content p {
                color: white;
                margin: 0 0 10px 0;
                line-height: 1.5;
                font-size: 15px;
                font-family: 'Poppins', sans-serif;
            }
            
            .popup-main-content p strong {
                color: #ffb74d;
                display: block;
                margin-bottom: 5px;
                font-weight: 700;
            }
            
            .popup-time-note {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #00d46e;
                font-size: 14px;
                margin-top: 10px;
                font-family: 'Poppins', sans-serif;
            }
            
            /* ========== NEW BUTTONS LAYOUT ========== */
            .popup-action-row {
                display: flex;
                gap: 12px;
                align-items: stretch; /* Make buttons same height */
            }
            
            /* Call Button (Green) */
            .action-call-button {
                flex: 2; /* Takes more space */
                background: linear-gradient(135deg, #00bf62, #00d46e);
                color: white;
                border: 2px solid #00bf62;
                border-radius: 10px;
                padding: 14px 5px;
                font-size: 16px;
                font-weight: 700;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: all 0.3s ease;
                font-family: 'Poppins', sans-serif;
                text-align: center;
                min-height: 50px;
            }
            
            .action-call-button:hover {
                background: linear-gradient(135deg, #00d46e, #00bf62);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 191, 98, 0.4);
            }
            
            /* Close Button (Red) - NEXT TO CALL BUTTON */
            .action-close-button {
                flex: 1.2; /* More than half of call button width */
                background: #ff4757;
                color: white;
                border: 2px solid #ff4757;
                border-radius: 10px;
                padding: 14px 5px;
                font-size: 16px;
                font-weight: 700;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                font-family: 'Poppins', sans-serif;
                text-align: center;
                min-height: 50px; /* Same height as call button */
            }
            
            .action-close-button:hover {
                background: #ff6b81;
                border-color: #ff6b81;
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(255, 107, 129, 0.4);
            }
            
            /* Mobile Responsive */
            @media (max-width: 480px) {
                .event-popup-card {
                    max-width: 300px;
                    padding: 20px;
                }
                
                .popup-main-icon {
                    width: 55px;
                    height: 55px;
                }
                
                .popup-main-icon i {
                    font-size: 22px;
                }
                
                .popup-main-title {
                    font-size: 20px;
                }
                
                .popup-main-content p {
                    font-size: 14px;
                }
                
                .popup-action-row {
                    flex-direction: column;
                    gap: 10px;
                }
                
                .action-call-button,
                .action-close-button {
                    width: 100%;
                    padding: 12px;
                    font-size: 15px;
                    min-height: 45px;
                }
            }
            
            /* Force reset any inherited styles */
            .action-call-button,
            .action-close-button {
                all: initial;
                font-family: inherit;
                display: flex !important;
            }
            
            /* Ensure no button styles affect these */
            .event-popup-main button,
            .event-popup-main input,
            .event-popup-main textarea {
                all: unset;
                font-family: inherit;
            }
        `;

        document.head.appendChild(style);
    }
})();