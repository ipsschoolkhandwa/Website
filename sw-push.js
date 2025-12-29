// Service Worker for Indian Public School - Enhanced Version
const CACHE_NAME = 'ips-push-v2';
const SUBSCRIBERS_KEY = 'ips_subscribers';

// Install event
self.addEventListener('install', event => {
    console.log('✅ Push Service Worker v2 installing...');
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
    console.log('✅ Push Service Worker v2 activated!');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Sync subscribers across devices (when online)
async function syncSubscribers() {
    try {
        const subscribers = await getAllSubscribers();
        
        // In a real backend, you would send to server here
        // For now, we'll store in IndexedDB for better persistence
        await storeSubscribersInIDB(subscribers);
        
        // Broadcast to all open tabs
        const allClients = await self.clients.matchAll();
        allClients.forEach(client => {
            client.postMessage({
                type: 'SYNC_SUBSCRIBERS',
                count: subscribers.length
            });
        });
        
        console.log('🔄 Synced', subscribers.length, 'subscribers');
    } catch (error) {
        console.error('Sync failed:', error);
    }
}

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
            timestamp: new Date().toISOString(),
            id: 'notif_' + Date.now()
        },
        actions: [
            {
                action: 'open',
                title: '📱 Open School Site'
            },
            {
                action: 'youtube',
                title: '🎥 Watch Videos'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(notificationData.title, options)
    );
});

// Handle notification click
self.addEventListener('notificationclick', event => {
    console.log('🖱️ Notification clicked:', event.action);
    event.notification.close();

    let urlToOpen = event.notification.data.url || './index.html';
    
    // Handle action buttons
    if (event.action === 'youtube') {
        urlToOpen = 'https://youtube.com/@indianpublicschoolkhandwa5876';
    } else if (event.action === 'open') {
        urlToOpen = event.notification.data.url || './index.html';
    }

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(windowClients => {
                // Check if there's already a window open
                for (const client of windowClients) {
                    if (client.url.includes(urlToOpen) && 'focus' in client) {
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

// Handle messages from admin panel
self.addEventListener('message', event => {
    console.log('📨 Message received in Service Worker:', event.data);
    
    switch (event.data.type) {
        case 'ADMIN_NOTIFICATION':
            // Send notification to all
            self.registration.showNotification(event.data.title, {
                body: event.data.body,
                icon: event.data.icon || './logo.png',
                badge: './logo.png',
                data: {
                    url: event.data.url || './index.html',
                    fromAdmin: true
                }
            });
            break;
            
        case 'GET_SUBSCRIBERS':
            // Return subscriber count
            getAllSubscribers().then(subscribers => {
                event.ports[0].postMessage({
                    type: 'SUBSCRIBERS_COUNT',
                    count: subscribers.length,
                    subscribers: subscribers
                });
            });
            break;
            
        case 'SYNC_REQUEST':
            // Sync across devices
            syncSubscribers();
            break;
    }
});

// Background sync for offline support
self.addEventListener('sync', event => {
    if (event.tag === 'sync-subscribers') {
        console.log('🔄 Background sync triggered');
        event.waitUntil(syncSubscribers());
    }
});

// Periodic sync (if supported)
if ('periodicSync' in self.registration) {
    self.addEventListener('periodicsync', event => {
        if (event.tag === 'update-subscribers') {
            event.waitUntil(syncSubscribers());
        }
    });
}

// Helper function to get all subscribers
async function getAllSubscribers() {
    // Try to get from IndexedDB first
    try {
        const db = await openIDB();
        const tx = db.transaction('subscribers', 'readonly');
        const store = tx.objectStore('subscribers');
        const subscribers = await store.getAll();
        return subscribers;
    } catch (error) {
        // Fallback to localStorage
        const response = await self.clients.matchAll();
        let allSubscribers = [];
        
        for (const client of response) {
            try {
                const result = await client.postMessage({
                    type: 'GET_LOCAL_SUBSCRIBERS'
                });
                if (result && result.subscribers) {
                    allSubscribers = [...allSubscribers, ...result.subscribers];
                }
            } catch (e) {
                console.log('Could not get subscribers from client:', client.id);
            }
        }
        
        // Remove duplicates
        const uniqueSubscribers = Array.from(
            new Map(allSubscribers.map(sub => [sub.id, sub])).values()
        );
        
        return uniqueSubscribers;
    }
}

// IndexedDB for better subscriber storage
async function openIDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('IPS_Subscribers', 1);
        
        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('subscribers')) {
                const store = db.createObjectStore('subscribers', { keyPath: 'id' });
                store.createIndex('subscribedAt', 'subscribedAt', { unique: false });
            }
        };
        
        request.onsuccess = function(event) {
            resolve(event.target.result);
        };
        
        request.onerror = function(event) {
            reject(event.target.error);
        };
    });
}

async function storeSubscribersInIDB(subscribers) {
    try {
        const db = await openIDB();
        const tx = db.transaction('subscribers', 'readwrite');
        const store = tx.objectStore('subscribers');
        
        for (const subscriber of subscribers) {
            await store.put(subscriber);
        }
        
        await tx.complete;
        console.log('💾 Saved', subscribers.length, 'subscribers to IndexedDB');
    } catch (error) {
        console.error('IndexedDB error:', error);
    }
}

console.log('🚀 Enhanced Push Service Worker v2 loaded!');