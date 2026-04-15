// event/event.js
// This file contains events data for the popup

const events = [
    {
        title: "🎓 Class 10th & 12th Results",
        description: "MPBSE results are out! Check your result now.",
        date: "April 15, 2026",
        type: "result",
        important: true,
        details: "Check result at: mpbse.nic.in |Results are announced on 15th April at 11:00 Am | Best of luck!"
    }
];

// Make it available globally
window.events = events;

// Export for module use if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { events };
}