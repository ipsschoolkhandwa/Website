// Service Worker for Indian Public School Push Notifications
const CACHE_NAME = 'ips-push-v1';

// Install event
self.addEventListener('install', event => {
    console.log('✅ Push Service Worker installing...');
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
    console.log('✅ Push Service Worker activated!');
    event.waitUntil(self.clients.claim());
});

// Handle push notifications
self.addEventListener('push', event => {
    console.log('🔔 Push notification received!');
    
    let notificationData = {
        title: 'Indian Public School Khandwa',
        body: 'New update from school',
        icon: './logo.png',
        badge: './logo.png',
        url: './index.html'
    };

    // Parse data if available
    if (event.data) {
        try {
            const data = event.data.json();
            notificationData = { ...notificationData, ...data };
        } catch (e) {
            // If not JSON, try as text
            const text = event.data.text();
            if (text) notificationData.body = text;
        }
    }

    const options = {
        body: notificationData.body,
        icon: notificationData.icon,
        badge: notificationData.badge,
        vibrate: [100, 50, 100],
        data: {
            url: notificationData.url,
            timestamp: new Date().toISOString()
        }
    };

    event.waitUntil(
        self.registration.showNotification(notificationData.title, options)
    );
});

// Handle notification click
self.addEventListener('notificationclick', event => {
    console.log('🖱️ Notification clicked');
    event.notification.close();

    const urlToOpen = event.notification.data.url || './index.html';
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(windowClients => {
                // Check if there's already a window open
                for (const client of windowClients) {
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus();
                    }
                }
                // If not, open a new window
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});

// Handle messages from main page (for admin sends)
self.addEventListener('message', event => {
    console.log('📨 Message received in Service Worker:', event.data);
    
    if (event.data && event.data.type === 'SEND_NOTIFICATION') {
        self.registration.showNotification(event.data.title, {
            body: event.data.body,
            icon: event.data.icon || './logo.png',
            badge: './logo.png'
        });
    }
});

// Background sync for offline support
self.addEventListener('sync', event => {
    if (event.tag === 'sync-notifications') {
        console.log('🔄 Background sync for notifications');
    }
});

console.log('🚀 Push Service Worker loaded successfully!');