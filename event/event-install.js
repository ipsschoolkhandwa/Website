// events/event-install.js
// This file dynamically adds events section to your website

(function() {
    'use strict';
    
    // Only run if we haven't loaded events yet
    if (window.eventsLoaded) return;
    window.eventsLoaded = true;
    
    // Function to load events dynamically
    async function loadEvents() {
        try {
            // Try to fetch the event.js file
            const response = await fetch('events/event.js');
            
            if (!response.ok) {
                console.log('Event file not found or empty');
                return;
            }
            
            const content = await response.text();
            
            // Check if there's actual content (not just comments/whitespace)
            const cleanContent = content
                .replace(/\/\*[\s\S]*?\*\//g, '') // Remove /* */ comments
                .replace(/\/\/.*/g, '')          // Remove // comments
                .replace(/\s/g, '')              // Remove whitespace
                .replace(/constevents=\[\]/g, ''); // Remove empty array declaration
            
            if (cleanContent.length < 10) { // Adjust threshold as needed
                console.log('No events found in event.js');
                return;
            }
            
            // Extract events array using regex
            const eventsMatch = content.match(/const events = (\[[\s\S]*?\]);/);
            
            if (!eventsMatch) {
                console.log('Could not parse events data');
                return;
            }
            
            // Safely evaluate the events array
            let events;
            try {
                events = eval(`(${eventsMatch[1]})`);
            } catch (e) {
                console.error('Error parsing events:', e);
                return;
            }
            
            if (!Array.isArray(events) || events.length === 0) {
                console.log('No events in array');
                return;
            }
            
            // Add events section to the page
            addEventsSection(events);
            
        } catch (error) {
            console.log('Events system disabled:', error.message);
        }
    }
    
    // Function to add events section to the page
    function addEventsSection(events) {
        // Create events section HTML
        const eventsHTML = `
            <div class="events-container" id="eventsContainer">
                <div class="events-box">
                    <div class="events-header">
                        <h2><i class="fas fa-calendar-alt"></i> School Events & Announcements</h2>
                        <button class="events-close" id="closeEvents">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="events-list">
                        ${events.map(event => `
                            <div class="event-item ${event.important ? 'event-important' : ''}">
                                <div class="event-icon">
                                    ${getEventIcon(event.type)}
                                </div>
                                <div class="event-content">
                                    <h3>${event.title}</h3>
                                    <p class="event-description">${event.description}</p>
                                    ${event.details ? `<p class="event-details"><i class="fas fa-info-circle"></i> ${event.details}</p>` : ''}
                                    <div class="event-footer">
                                        <span class="event-date"><i class="far fa-calendar"></i> ${event.date}</span>
                                        <span class="event-type ${event.type}">${event.type}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="events-note">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Check this section regularly for updates</p>
                    </div>
                </div>
            </div>
        `;
        
        // Add events CSS
        addEventsCSS();
        
        // Insert events section before the footer
        const footer = document.querySelector('.footer');
        if (footer) {
            footer.insertAdjacentHTML('beforebegin', eventsHTML);
            
            // Add close functionality
            const closeBtn = document.getElementById('closeEvents');
            const eventsContainer = document.getElementById('eventsContainer');
            
            if (closeBtn && eventsContainer) {
                closeBtn.addEventListener('click', function() {
                    eventsContainer.style.animation = 'slideOut 0.3s ease forwards';
                    setTimeout(() => {
                        eventsContainer.remove();
                        localStorage.setItem('eventsClosed', 'true');
                    }, 300);
                });
                
                // Check if user previously closed events
                if (localStorage.getItem('eventsClosed') === 'true') {
                    eventsContainer.remove();
                }
            }
        }
    }
    
    // Function to get appropriate icon for event type
    function getEventIcon(type) {
        switch(type) {
            case 'admission':
                return '<i class="fas fa-child"></i>';
            case 'holiday':
                return '<i class="fas fa-umbrella-beach"></i>';
            case 'exam':
                return '<i class="fas fa-file-alt"></i>';
            case 'sports':
                return '<i class="fas fa-running"></i>';
            case 'cultural':
                return '<i class="fas fa-music"></i>';
            default:
                return '<i class="fas fa-calendar-check"></i>';
        }
    }
    
    // Function to add events-specific CSS
    function addEventsCSS() {
        const style = document.createElement('style');
        style.id = 'events-styles';
        style.textContent = `
            /* Events Container */
            .events-container {
                margin: 25px 0;
                animation: slideIn 0.5s ease-out;
            }
            
            .events-box {
                background: linear-gradient(135deg, var(--navy-blue), #0066cc);
                padding: 25px;
                border-radius: 20px;
                border: 3px solid var(--green);
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
                background: linear-gradient(90deg, var(--orange), var(--green), var(--navy-blue));
            }
            
            /* Events Header */
            .events-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 25px;
            }
            
            .events-header h2 {
                color: var(--white);
                font-size: 22px;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .events-header h2 i {
                color: var(--orange);
                font-size: 24px;
            }
            
            .events-close {
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid var(--orange);
                color: var(--white);
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 18px;
                transition: all 0.3s ease;
            }
            
            .events-close:hover {
                background: var(--orange);
                transform: rotate(90deg);
                color: var(--navy-blue);
            }
            
            /* Events List */
            .events-list {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            
            .event-item {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 20px;
                display: flex;
                gap: 20px;
                border: 2px solid transparent;
                transition: all 0.3s ease;
                animation: fadeInUp 0.5s ease-out;
            }
            
            .event-item:hover {
                transform: translateY(-3px);
                border-color: var(--green);
                box-shadow: 0 5px 15px rgba(0, 191, 98, 0.2);
            }
            
            .event-important {
                background: linear-gradient(135deg, rgba(239, 161, 46, 0.15), rgba(255, 183, 77, 0.1));
                border: 2px solid var(--orange);
                animation: pulseImportant 2s infinite;
            }
            
            .event-icon {
                flex-shrink: 0;
                width: 60px;
                height: 60px;
                background: var(--green);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                color: var(--white);
                border: 2px solid var(--white);
            }
            
            .event-content {
                flex: 1;
            }
            
            .event-content h3 {
                color: var(--white);
                font-size: 18px;
                margin-bottom: 8px;
                font-weight: 600;
            }
            
            .event-description {
                color: #e3f2fd;
                line-height: 1.5;
                margin-bottom: 10px;
                font-size: 15px;
            }
            
            .event-details {
                color: var(--green-light);
                font-size: 14px;
                margin-bottom: 12px;
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
                padding-top: 12px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .event-date {
                color: var(--orange-light);
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
                background: var(--orange);
                color: var(--navy-blue);
            }
            
            .event-type.holiday {
                background: var(--green);
                color: var(--white);
            }
            
            .event-type.exam {
                background: #ff4757;
                color: var(--white);
            }
            
            .event-type.sports {
                background: #00a8ff;
                color: var(--white);
            }
            
            .event-type.cultural {
                background: #9c88ff;
                color: var(--white);
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
                color: var(--green-light);
                font-size: 14px;
                border: 1px solid rgba(0, 191, 98, 0.3);
            }
            
            .events-note i {
                font-size: 18px;
            }
            
            /* Animations */
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes slideOut {
                from {
                    opacity: 1;
                    transform: translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateY(20px);
                }
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes pulseImportant {
                0%, 100% {
                    box-shadow: 0 0 0 0 rgba(239, 161, 46, 0.4);
                }
                50% {
                    box-shadow: 0 0 0 10px rgba(239, 161, 46, 0);
                }
            }
            
            /* Responsive Design */
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
                
                .event-details {
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
                
                .event-content h3 {
                    font-size: 16px;
                }
                
                .event-description,
                .event-details {
                    font-size: 14px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add CSS variables if they don't exist
    function ensureCSSVariables() {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        
        // Check if our CSS variables exist
        const navyBlue = computedStyle.getPropertyValue('--navy-blue');
        if (!navyBlue.trim()) {
            // Add CSS variables to root
            root.style.setProperty('--navy-blue', '#004aad');
            root.style.setProperty('--navy-light', '#0066cc');
            root.style.setProperty('--orange', '#efa12e');
            root.style.setProperty('--orange-light', '#ffb74d');
            root.style.setProperty('--green', '#00bf62');
            root.style.setProperty('--green-light', '#00d46e');
            root.style.setProperty('--white', '#ffffff');
        }
    }
    
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Add a small delay to ensure other scripts have loaded
        setTimeout(() => {
            ensureCSSVariables();
            loadEvents();
        }, 1000); // 1 second delay to ensure everything else is loaded
    });
    
})();