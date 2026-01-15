// event/event-install.js - FINAL VERSION WITH PERFECT BUTTONS
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

        // Create popup with DIV elements instead of BUTTON elements
        const popupHTML = `
            <div class="final-popup-overlay" id="finalPopup">
                <div class="final-popup-box">
                    <!-- Title Section -->
                    <div class="popup-title-section">
                        <div class="title-icon">
                            <i class="fas fa-bullhorn"></i>
                        </div>
                        <h2 class="popup-heading">Admission Open</h2>
                    </div>
                    
                    <!-- Content Section -->
                    <div class="popup-info-box">
                        <p class="info-title">Nursery Class Registration</p>
                        <p class="info-desc">Limited seats available. Visit office for forms.</p>
                        <div class="info-time">
                            <i class="fas fa-clock"></i>
                            <span>9 AM - 12 Noon</span>
                        </div>
                    </div>
                    
                    <!-- Action Buttons - Using DIVs to avoid CSS conflicts -->
                    <div class="popup-action-container">
                        <div class="action-item call-action" id="finalCallBtn">
                            <div class="action-content">
                                <i class="fas fa-phone"></i>
                                <span>Call Now</span>
                            </div>
                        </div>
                        <div class="action-item close-action" id="finalCloseBtn">
                            <div class="action-content">
                                <span>Close</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        addFinalCSS();
        document.body.insertAdjacentHTML('beforeend', popupHTML);

        const popup = document.getElementById('finalPopup');
        const closeBtn = document.getElementById('finalCloseBtn');
        const callBtn = document.getElementById('finalCallBtn');

        if (popup) {
            // Show popup
            setTimeout(() => {
                popup.style.opacity = '1';
                popup.style.visibility = 'visible';
                popup.style.pointerEvents = 'auto';
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
                closeBtn.onclick = closePopup;
            }

            if (callBtn) {
                callBtn.onclick = function() {
                    window.location.href = 'tel:+917333574759';
                };
            }

            // Close on overlay click
            popup.onclick = function(e) {
                if (e.target === popup) {
                    closePopup();
                }
            };

            // Close on ESC
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') closePopup();
            });
        }
    }

    function addFinalCSS() {
        if (document.getElementById('final-popup-styles')) return;

        const style = document.createElement('style');
        style.id = 'final-popup-styles';
        style.textContent = `
            /* ========== FINAL POPUP STYLES ========== */
            /* Using !important to override everything */
            
            /* Overlay */
            .final-popup-overlay {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                background: rgba(0, 0, 0, 0.8) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                z-index: 999999 !important;
                opacity: 0 !important;
                visibility: hidden !important;
                transition: opacity 0.3s ease !important;
                padding: 20px !important;
                pointer-events: none !important;
            }
            
            /* Popup Box */
            .final-popup-box {
                background: linear-gradient(135deg, #004aad, #0066cc) !important;
                border-radius: 15px !important;
                padding: 25px !important;
                width: 100% !important;
                max-width: 350px !important;
                border: 3px solid #00bf62 !important;
                box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5) !important;
                position: relative !important;
                animation: popupAppear 0.4s ease !important;
            }
            
            @keyframes popupAppear {
                from {
                    transform: translateY(20px) scale(0.95);
                    opacity: 0;
                }
                to {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                }
            }
            
            /* Title Section */
            .popup-title-section {
                text-align: center !important;
                margin-bottom: 20px !important;
            }
            
            .title-icon {
                width: 60px !important;
                height: 60px !important;
                background: linear-gradient(135deg, #00bf62, #00d46e) !important;
                border-radius: 50% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                margin: 0 auto 15px !important;
                border: 3px solid white !important;
            }
            
            .title-icon i {
                font-size: 24px !important;
                color: white !important;
            }
            
            .popup-heading {
                color: white !important;
                font-size: 22px !important;
                font-weight: 700 !important;
                margin: 0 !important;
                font-family: 'Poppins', sans-serif !important;
            }
            
            /* Info Box */
            .popup-info-box {
                background: rgba(255, 255, 255, 0.1) !important;
                border-radius: 10px !important;
                padding: 18px !important;
                margin-bottom: 25px !important;
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
            }
            
            .info-title {
                color: #ffb74d !important;
                font-size: 16px !important;
                font-weight: 700 !important;
                margin: 0 0 10px 0 !important;
                font-family: 'Poppins', sans-serif !important;
            }
            
            .info-desc {
                color: white !important;
                font-size: 14px !important;
                line-height: 1.5 !important;
                margin: 0 0 15px 0 !important;
                font-family: 'Poppins', sans-serif !important;
            }
            
            .info-time {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                color: #00d46e !important;
                font-size: 13px !important;
                font-family: 'Poppins', sans-serif !important;
            }
            
            /* ========== PERFECT BUTTONS LAYOUT ========== */
            .popup-action-container {
                display: flex !important;
                gap: 12px !important;
                width: 100% !important;
            }
            
            /* Action Items (DIVs styled as buttons) */
            .action-item {
                border-radius: 10px !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                min-height: 50px !important;
                border: 2px solid transparent !important;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2) !important;
            }
            
            .action-content {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 8px !important;
                font-weight: 700 !important;
                font-size: 15px !important;
                font-family: 'Poppins', sans-serif !important;
                padding: 5px !important;
            }
            
            /* Call Button - 65% width */
            .call-action {
                flex: 0 0 65% !important; /* 65% width */
                background: linear-gradient(135deg, #00bf62, #00d46e) !important;
                color: white !important;
                border-color: #00bf62 !important;
            }
            
            .call-action:hover {
                background: linear-gradient(135deg, #00d46e, #00bf62) !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 6px 15px rgba(0, 191, 98, 0.4) !important;
            }
            
            /* Close Button - 35% width */
            .close-action {
                flex: 0 0 35% !important; /* 35% width */
                background: #ff4757 !important;
                color: white !important;
                border-color: #ff4757 !important;
            }
            
            .close-action:hover {
                background: #ff6b81 !important;
                border-color: #ff6b81 !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 6px 15px rgba(255, 107, 129, 0.4) !important;
            }
            
            /* Mobile Responsive */
            @media (max-width: 480px) {
                .final-popup-box {
                    max-width: 300px !important;
                    padding: 20px !important;
                }
                
                .title-icon {
                    width: 55px !important;
                    height: 55px !important;
                }
                
                .title-icon i {
                    font-size: 22px !important;
                }
                
                .popup-heading {
                    font-size: 20px !important;
                }
                
                .info-title {
                    font-size: 15px !important;
                }
                
                .info-desc {
                    font-size: 13px !important;
                }
                
                .popup-action-container {
                    flex-direction: row !important; /* Keep side by side on mobile too */
                    gap: 10px !important;
                }
                
                .action-item {
                    min-height: 45px !important;
                }
                
                .action-content {
                    font-size: 14px !important;
                }
                
                .call-action {
                    flex: 0 0 65% !important;
                }
                
                .close-action {
                    flex: 0 0 35% !important;
                }
            }
            
            /* Force remove any inherited styles */
            .final-popup-overlay * {
                box-sizing: border-box !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            
            /* Ensure no button styles affect our DIVs */
            .action-item {
                all: initial !important;
                font-family: 'Poppins', sans-serif !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
        `;

        document.head.appendChild(style);
    }
})();