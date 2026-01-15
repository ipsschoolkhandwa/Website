// event/event-install.js - SIMPLIFIED & WORKING VERSION
(function() {
    'use strict';
    
    // Wait for page to load
    window.addEventListener('load', function() {
        setTimeout(checkAndAddEvents, 1500);
    });
    
    async function checkAndAddEvents() {
        try {
            // Load event.js file - CORRECT PATH for "event" folder
            const response = await fetch('event/event.js');
            if (!response.ok) {
                console.log('Event file not found');
                return;
            }
            
            const content = await response.text();
            
            // Check if we have the events array
            if (!content.includes('const events') || !content.includes('[') || !content.includes(']')) {
                console.log('No events array found');
                return;
            }
            
            // Find the array content
            const start = content.indexOf('[');
            const end = content.lastIndexOf(']');
            
            if (start === -1 || end === -1 || start >= end) {
                console.log('Invalid events array format');
                return;
            }
            
            const arrayContent = content.substring(start, end + 1);
            
            // Check if array has actual content
            if (arrayContent === '[]' || arrayContent.trim().length < 10) {
                console.log('Events array is empty');
                return;
            }
            
            // If we got here, we have events - add the section
            addEventsSection();
            
        } catch (error) {
            console.log('Events system error:', error.message);
        }
    }
    
    function addEventsSection() {
        // Create events section
        const eventsHTML = `
            <div class="events-container" id="eventsContainer">
                <div class="events-box">
                    <div class="events-header">
                        <h2><i class="fas fa-calendar-alt"></i> School Events</h2>
                        <button class="events-close" id="closeEvents">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="events-content">
                        <div class="event-item event-important">
                            <div class="event-icon">
                                <i class="fas fa-child"></i>
                            </div>
                            <div class="event-details">
                                <h3>Admission Registration</h3>
                                <p>Registration for Nursery class. Limited seats available. Early registration recommended.</p>
                                <p class="event-info"><i class="fas fa-info-circle"></i> Visit school office for forms between 9 AM to 12 Noon</p>
                                <div class="event-footer">
                                    <span class="event-date"><i class="far fa-calendar"></i> Ongoing</span>
                                    <span class="event-type admission">Admission</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="events-note">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Check this section regularly for updates</p>
                    </div>
                </div>
            </div>
        `;
        
        // Add CSS
        addEventsCSS();
        
        // Find where to insert (before footer)
        const footer = document.querySelector('.footer');
        if (footer) {
            footer.insertAdjacentHTML('beforebegin', eventsHTML);
            
            // Setup close button
            const closeBtn = document.getElementById('closeEvents');
            const container = document.getElementById('eventsContainer');
            
            if (closeBtn && container) {
                closeBtn.addEventListener('click', function() {
                    container.style.opacity = '0';
                    container.style.transform = 'translateY(-20px)';
                    setTimeout(() => {
                        container.remove();
                        localStorage.setItem('eventsClosed', 'true');
                    }, 300);
                });
                
                // Check if user closed it before
                if (localStorage.getItem('eventsClosed') === 'true') {
                    container.remove();
                }
            }
        }
    }
    
    function addEventsCSS() {
        // Check if CSS already added
        if (document.getElementById('events-css')) return;
        
        const style = document.createElement('style');
        style.id = 'events-css';
        style.textContent = `
            /* Events Container */
            .events-container {
                margin: 25px 0;
                opacity: 0;
                transform: translateY(20px);
                animation: slideInEvents 0.5s ease-out forwards;
            }
            
            .events-box {
                background: linear-gradient(135deg, #004aad, #0066cc);
                padding: 25px;
                border-radius: 20px;
                border: 3px solid #00bf62;
                box-shadow: 0 8px 25px rgba(0, 74, 173, 0.3);
                position: relative;
                overflow: hidden;
            }
            
            .events-box::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #efa12e, #00bf62, #004aad);
            }
            
            /* Events Header */
            .events-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 25px;
            }
            
            .events-header h2 {
                color: white;
                font-size: 22px;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 10px;
                margin: 0;
            }
            
            .events-header h2 i {
                color: #efa12e;
                font-size: 24px;
            }
            
            .events-close {
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid #efa12e;
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 18px;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .events-close:hover {
                background: #efa12e;
                transform: rotate(90deg);
                color: #004aad;
            }
            
            /* Events Content */
            .events-content {
                margin-bottom: 20px;
            }
            
            .event-item {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 20px;
                display: flex;
                gap: 20px;
                border: 2px solid transparent;
                transition: all 0.3s ease;
            }
            
            .event-item:hover {
                transform: translateY(-3px);
                border-color: #00bf62;
                box-shadow: 0 5px 15px rgba(0, 191, 98, 0.2);
            }
            
            .event-important {
                background: linear-gradient(135deg, rgba(239, 161, 46, 0.15), rgba(255, 183, 77, 0.1));
                border: 2px solid #efa12e;
            }
            
            .event-icon {
                flex-shrink: 0;
                width: 60px;
                height: 60px;
                background: #00bf62;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                color: white;
                border: 2px solid white;
            }
            
            .event-details h3 {
                color: white;
                font-size: 18px;
                margin: 0 0 10px 0;
                font-weight: 600;
            }
            
            .event-details p {
                color: #e3f2fd;
                line-height: 1.5;
                margin: 0 0 10px 0;
                font-size: 15px;
            }
            
            .event-info {
                color: #00d46e !important;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
                font-style: italic;
            }
            
            .event-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .event-date {
                color: #ffb74d;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            
            .event-type {
                background: rgba(255, 255, 255, 0.15);
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .event-type.admission {
                background: #efa12e;
                color: #004aad;
            }
            
            /* Events Note */
            .events-note {
                margin-top: 20px;
                padding: 15px;
                background: rgba(0, 191, 98, 0.15);
                border-radius: 12px;
                display: flex;
                align-items: center;
                gap: 12px;
                color: #00d46e;
                font-size: 14px;
                border: 1px solid rgba(0, 191, 98, 0.3);
            }
            
            .events-note i {
                font-size: 18px;
            }
            
            /* Animations */
            @keyframes slideInEvents {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .events-box {
                    padding: 20px;
                }
                
                .events-header {
                    flex-direction: column;
                    gap: 15px;
                    text-align: center;
                }
                
                .event-item {
                    flex-direction: column;
                    text-align: center;
                }
                
                .event-icon {
                    margin: 0 auto;
                }
                
                .event-footer {
                    flex-direction: column;
                    gap: 10px;
                }
                
                .event-info {
                    justify-content: center;
                }
            }
            
            @media (max-width: 480px) {
                .events-box {
                    padding: 15px;
                    border-radius: 15px;
                }
                
                .events-header h2 {
                    font-size: 18px;
                }
                
                .event-details h3 {
                    font-size: 16px;
                }
                
                .event-details p {
                    font-size: 14px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
})();