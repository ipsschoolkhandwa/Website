// event/event.js
// This file contains events data for the popup

const events = [
    {
        title: "📢 Class 11th Registrations Started",
        description: "Class 11th registrations are now open. Register soon to secure your stream.",
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

window.events = events;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { events };
}