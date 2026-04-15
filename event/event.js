// event/event.js
// This file contains events data for the popup

const events = [
    {
        title: "📢 Class 10th & 12th Results Today!",
        description: "Today is the result day for Class 10th and Class 12th. Best of luck to all students! We wish you pass with a good percentage.",
        date: "April 15, 2026",
        type: "result",
        important: true,
        details: "Results available on school website and notice board. Keep your roll number ready."
    }
];

// Export for use in other files if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { events };
}