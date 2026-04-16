// event/event.js
// This file contains events data for the popup

const events = [
    {
        title: "📢 Class 11th Registration Started",
        description: "All parents are hereby informed that registration for Class 11th has begun. Registration forms will be available at the school from 16/04/2026 (Thursday). Parents are requested to collect the registration form from the school, submit it soon with required documents and fees, and choose their stream to confirm admission.",
        date: "From April 16, 2026",
        type: "documents",
        important: true,
        details: "Registration forms available at school office (9 AM to 12 Noon)",
        documents: [
            "Aadhar Card (Student)",
            "Parents' Aadhar Card",
            "Samagra ID",
            "Digital Birth Certificate",
            "10th Marksheet",
            "Passport Size Photo (2)"
        ]
    }
];

// Make it available globally
window.events = events;

// Export for module use if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { events };
}