// event/event.js
// This file contains events data for the popup

const events = [
    {
        title: "Admission Registration",
        description: "Registration for Nursery class. Limited seats available. Early registration recommended.",
        date: "Ongoing",
        type: "admission",
        important: true,
        details: "Visit school office for forms between 9 AM to 12 Noon"
    },
    {
        title: "Happy Republic Day! 🇮🇳",
        description: "Wishing everyone a joyous Republic Day! Celebrating the spirit of our nation.",
        date: "January 26, 2024",
        type: "greeting",
        important: true,
        details: "School will remain closed. Flag hoisting ceremony at 8 AM for resident staff."
    }
    // Add more events here as needed:
    // {
    //     title: "School Open House",
    //     description: "Meet the teachers and see our facilities",
    //     date: "December 15, 2024",
    //     type: "event",
    //     important: false
    // }
];

// Export for use in other files if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { events };
}