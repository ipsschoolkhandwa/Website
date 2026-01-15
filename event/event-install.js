// event/event-install.js - COMPLETE WITH INLINE CSS
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

        // INLINE STYLES - Will override everything
        const popupHTML = `
            <div class="event-popup" id="eventPopup" style="
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
                box-sizing: border-box;
            ">
                <div class="popup-card" style="
                    background: linear-gradient(135deg, #004aad, #0066cc);
                    border-radius: 12px;
                    padding: 25px 20px 20px;
                    width: 100%;
                    max-width: 320px;
                    position: relative;
                    border: 2px solid #00bf62;
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
                    box-sizing: border-box;
                ">
                    <!-- PERFECT CIRCLE CLOSE BUTTON -->
                    <button class="popup-close" id="popupClose" aria-label="Close popup" style="
                        position: absolute;
                        top: -15px;
                        right: -15px;
                        width: 36px;
                        height: 36px;
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
                        transition: all 0.3s ease;
                        z-index: 100;
                        box-shadow: 0 4px 10px rgba(255, 107, 107, 0.4);
                        overflow: visible;
                        box-sizing: border-box;
                        font-family: inherit;
                        line-height: 1;
                        text-align: center;
                        text-decoration: none;
                        vertical-align: middle;
                        user-select: none;
                    ">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style="
                            display: block;
                            flex-shrink: 0;
                            transition: transform 0.3s ease;
                        ">
                            <path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                        </svg>
                    </button>
                    
                    <div class="popup-icon" style="
                        width: 50px;
                        height: 50px;
                        background: linear-gradient(135deg, #00bf62, #00d46e);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 12px;
                        border: 2px solid white;
                        box-sizing: border-box;
                    ">
                        <i class="fas fa-bullhorn" style="
                            font-size: 20px;
                            color: white;
                        "></i>
                    </div>
                    
                    <h3 style="
                        color: white;
                        font-size: 18px;
                        text-align: center;
                        margin: 0 0 12px 0;
                        font-weight: 700;
                        font-family: 'Poppins', sans-serif;
                    ">Admission Open</h3>
                    
                    <div class="popup-content" style="
                        background: rgba(255, 255, 255, 0.08);
                        border-radius: 8px;
                        padding: 12px;
                        margin-bottom: 15px;
                        box-sizing: border-box;
                    ">
                        <p style="
                            color: white;
                            margin: 0 0 8px 0;
                            line-height: 1.4;
                            font-size: 14px;
                            font-family: 'Poppins', sans-serif;
                        "><strong style="
                            color: #ffb74d;
                            display: block;
                            margin-bottom: 4px;
                            font-weight: 700;
                        ">Nursery Class Registration</strong></p>
                        <p style="
                            color: white;
                            margin: 0 0 8px 0;
                            line-height: 1.4;
                            font-size: 14px;
                            font-family: 'Poppins', sans-serif;
                        ">Limited seats available. Visit office for forms.</p>
                        <div class="popup-note" style="
                            display: flex;
                            align-items: center;
                            gap: 6px;
                            color: #00d46e;
                            font-size: 12px;
                            margin-top: 8px;
                            font-family: 'Poppins', sans-serif;
                        ">
                            <i class="fas fa-clock"></i>
                            <span>9 AM - 12 Noon</span>
                        </div>
                    </div>
                    
                    <div class="popup-buttons" style="
                        display: flex;
                        gap: 10px;
                    ">
                        <button class="popup-btn call-btn" id="popupCall" style="
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
                            background: linear-gradient(135deg, #00bf62, #00d46e);
                            color: white;
                            border: 1px solid #00bf62;
                            box-sizing: border-box;
                            font-family: 'Poppins', sans-serif;
                            margin: 0;
                            line-height: 1;
                        ">
                            <i class="fas fa-phone"></i> Call Now
                        </button>
                        <button class="popup-btn close-btn" id="popupCloseBtn" style="
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
                            background: rgba(255, 255, 255, 0.1);
                            color: white;
                            border: 1px solid rgba(255, 255, 255, 0.3);
                            box-sizing: border-box;
                            font-family: 'Poppins', sans-serif;
                            margin: 0;
                            line-height: 1;
                        ">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add dynamic CSS for animations and hover effects
        const style = document.createElement('style');
        style.id = 'popup-inline-css';
        style.textContent = `
            /* Override everything with !important */
            #eventPopup {
                opacity: 1 !important;
                visibility: visible !important;
                animation: popupFadeIn 0.3s ease !important;
            }
            
            @keyframes popupFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            /* PERFECT CIRCLE with hover effect */
            #popupClose {
                transform-origin: center center !important;
            }
            
            #popupClose:hover {
                background: #ff4757 !important;
                transform: rotate(90deg) scale(1.1) !important;
                box-shadow: 0 6px 15px rgba(255, 71, 87, 0.5) !important;
            }
            
            #popupClose:hover svg {
                transform: none !important;
            }
            
            /* Button hover effects */
            #popupCall:hover {
                background: linear-gradient(135deg, #00d46e, #00bf62) !important;
                transform: translateY(-2px) !important;
            }
            
            #popupCloseBtn:hover {
                background: rgba(255, 255, 255, 0.2) !important;
            }
            
            /* Mobile responsive */
            @media (max-width: 480px) {
                .popup-card {
                    max-width: 280px !important;
                    padding: 20px 15px 15px !important;
                }
                
                #popupClose {
                    top: -12px !important;
                    right: -12px !important;
                    width: 32px !important;
                    height: 32px !important;
                    border-width: 2px !important;
                }
                
                #popupClose svg {
                    width: 12px !important;
                    height: 12px !important;
                }
                
                .popup-icon {
                    width: 45px !important;
                    height: 45px !important;
                }
                
                .popup-icon i {
                    font-size: 18px !important;
                }
                
                h3 {
                    font-size: 16px !important;
                }
                
                .popup-content p {
                    font-size: 13px !important;
                }
                
                .popup-btn {
                    padding: 8px !important;
                    font-size: 13px !important;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.insertAdjacentHTML('beforeend', popupHTML);

        const popup = document.getElementById('eventPopup');
        const closeBtn = document.getElementById('popupCloseBtn');
        const xBtn = document.getElementById('popupClose');
        const callBtn = document.getElementById('popupCall');

        if (popup) {
            // Show with fade in
            setTimeout(() => {
                popup.style.opacity = '1';
                popup.style.visibility = 'visible';
            }, 50);

            const closePopup = () => {
                popup.style.opacity = '0';
                popup.style.visibility = 'hidden';
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

            // Add hover effect for close button
            if (xBtn) {
                xBtn.addEventListener('mouseenter', function() {
                    this.style.background = '#ff4757';
                    this.style.transform = 'rotate(90deg) scale(1.1)';
                    this.style.boxShadow = '0 6px 15px rgba(255, 71, 87, 0.5)';
                });
                
                xBtn.addEventListener('mouseleave', function() {
                    this.style.background = '#ff6b6b';
                    this.style.transform = 'rotate(0deg) scale(1)';
                    this.style.boxShadow = '0 4px 10px rgba(255, 107, 107, 0.4)';
                });
            }
        }
    }
})();