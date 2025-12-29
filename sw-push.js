// Service Worker for Indian Public School Push Notifications - v2.0
const CACHE_NAME = 'ips-push-v2';
const urlsToCache = [
    './',
    './index.html',
    './admin.html',
    './style.css',
    './logo.png',
    './manifest.json'
];

// Install event
self.addEventListener('install', event => {
    console.log('✅ IPS Push Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Caching essential files for offline use');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event
self.addEventListener('activate', event => {
    console.log('✅ IPS Push Service Worker activated!');
    
    // Clean old caches
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
    
    // Notify all clients that SW is ready
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({
                type: 'SW_READY',
                message: 'Push notifications are ready'
            });
        });
    });
});

// Push notification event
self.addEventListener('push', event => {
    console.log('🔔 Push notification received!');
    
    let notificationData = {
        title: 'Indian Public School Khandwa',
        body: 'New update from school',
        icon: './logo.png',
        badge: './logo.png',
        url: './index.html',
        timestamp: new Date().toISOString(),
        tag: 'school-update-' + Date.now()
    };

    // Parse incoming data
    if (event.data) {
        try {
            const data = event.data.json();
            notificationData = { ...notificationData, ...data };
            console.log('📨 Custom push data:', data);
        } catch (e) {
            // If not JSON, try as text
            const text = event.data.text();
            if (text) {
                notificationData.body = text;
                console.log('📨 Text push data:', text);
            }
        }
    }

    // Notification options
    const options = {
        body: notificationData.body,
        icon: notificationData.icon,
        badge: notificationData.badge,
        vibrate: [100, 50, 100, 50, 100],
        timestamp: new Date(notificationData.timestamp).getTime(),
        tag: notificationData.tag,
        renotify: true,
        requireInteraction: false,
        silent: false,
        data: {
            url: notificationData.url,
            id: notificationData.id || Date.now().toString(),
            tag: notificationData.tag,
            timestamp: notificationData.timestamp,
            source: 'ips-khandwa'
        },
        actions: [
            {
                action: 'open',
                title: '📱 Open School App'
            },
            {
                action: 'call',
                title: '📞 Call School'
            }
        ]
    };

    // Show the notification
    event.waitUntil(
        self.registration.showNotification(notificationData.title, options)
            .then(() => {
                console.log('✅ Notification shown:', notificationData.title);
                // Send analytics
                sendAnalytics('notification_shown', notificationData);
            })
            .catch(error => {
                console.error('❌ Failed to show notification:', error);
            })
    );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
    console.log('🖱️ Notification clicked:', event.notification.tag);
    
    // Close the notification
    event.notification.close();
    
    const notificationData = event.notification.data || {};
    
    // Handle different actions
    switch (event.action) {
        case 'open':
            event.waitUntil(
                clients.openWindow(notificationData.url || './index.html')
            );
            break;
            
        case 'call':
            event.waitUntil(
                clients.openWindow('tel:+917333574759')
            );
            break;
            
        default:
            // Default click - open website
            if (notificationData.url) {
                event.waitUntil(
                    clients.openWindow(notificationData.url)
                );
            } else {
                event.waitUntil(
                    clients.openWindow('./index.html')
                );
            }
    }
    
    // Send click analytics
    sendAnalytics('notification_clicked', notificationData);
});

// Notification close handler
self.addEventListener('notificationclose', event => {
    console.log('❌ Notification closed:', event.notification.tag);
    const notificationData = event.notification.data || {};
    sendAnalytics('notification_dismissed', notificationData);
});

// Handle messages from web pages
self.addEventListener('message', event => {
    console.log('📨 Message from page:', event.data);
    
    if (!event.data) return;
    
    switch (event.data.type) {
        case 'ADMIN_NOTIFICATION':
            console.log('🎯 Admin sending notification to all users');
            
            // Send to all clients
            event.waitUntil(
                self.clients.matchAll().then(clients => {
                    // Store notification for offline users
                    storeNotificationForOffline(event.data);
                    
                    // Show notification immediately
                    return self.registration.showNotification(
                        event.data.title || 'Indian Public School',
                        {
                            body: event.data.body,
                            icon: event.data.icon || './logo.png',
                            badge: './logo.png',
                            vibrate: [100, 50, 100],
                            data: {
                                url: event.data.url || './index.html',
                                timestamp: event.data.timestamp || new Date().toISOString(),
                                adminSent: true
                            },
                            tag: 'admin-' + Date.now(),
                            renotify: true
                        }
                    );
                })
            );
            break;
            
        case 'SEND_TEST':
            // Test notification
            self.registration.showNotification('Test from Service Worker', {
                body: 'This is a test notification',
                icon: './logo.png',
                tag: 'test'
            });
            break;
            
        case 'GET_SUBSCRIPTION':
            // Get current subscription
            self.registration.pushManager.getSubscription()
                .then(subscription => {
                    event.ports[0].postMessage({
                        type: 'SUBSCRIPTION_INFO',
                        subscription: subscription
                    });
                });
            break;
            
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
    }
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // Return cached if available
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                // Otherwise fetch from network
                return fetch(event.request)
                    .then(response => {
                        // Cache successful responses
                        if (response.ok) {
                            const responseToCache = response.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseToCache);
                                });
                        }
                        return response;
                    })
                    .catch(() => {
                        // Network failed - return offline page
                        if (event.request.destination === 'document') {
                            return caches.match('./index.html');
                        }
                        return new Response('Offline - Indian Public School', {
                            status: 503,
                            headers: { 'Content-Type': 'text/plain' }
                        });
                    });
            })
    );
});

// Background sync for offline notifications
self.addEventListener('sync', event => {
    if (event.tag === 'sync-offline-notifications') {
        console.log('🔄 Syncing offline notifications');
        event.waitUntil(syncOfflineNotifications());
    }
});

// ========== HELPER FUNCTIONS ==========

// Store notification for offline users
function storeNotificationForOffline(data) {
    const notifications = JSON.parse(localStorage.getItem('offline_notifications') || '[]');
    notifications.push({
        data: data,
        storedAt: new Date().toISOString(),
        delivered: false
    });
    
    // Store in IndexedDB or send to all clients
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({
                type: 'NEW_NOTIFICATION_STORED',
                notification: data
            });
        });
    });
    
    console.log('💾 Notification stored for offline users:', data);
}

// Sync offline notifications when back online
async function syncOfflineNotifications() {
    try {
        // Implementation for when you add a backend
        console.log('Syncing notifications with backend...');
        return Promise.resolve();
    } catch (error) {
        console.error('Sync failed:', error);
        return Promise.reject(error);
    }
}

// Send analytics (for future use)
function sendAnalytics(action, data) {
    console.log(`📊 Analytics: ${action}`, {
        id: data.id,
        tag: data.tag,
        timestamp: data.timestamp,
        action: action
    });
    
    // In production, send to your analytics server
    // Example: fetch('/api/analytics', { method: 'POST', body: JSON.stringify({action, data}) });
}

// Periodic sync (if supported)
if ('periodicSync' in self.registration) {
    self.addEventListener('periodicsync', event => {
        if (event.tag === 'update-content') {
            console.log('🔄 Periodic content update');
            event.waitUntil(updateCachedContent());
        }
    });
}

// Update cached content
async function updateCachedContent() {
    try {
        const cache = await caches.open(CACHE_NAME);
        const updatePromises = urlsToCache.map(url => {
            return fetch(url).then(response => {
                if (response.ok) {
                    return cache.put(url, response);
                }
            });
        });
        
        await Promise.all(updatePromises);
        console.log('✅ Content updated successfully');
    } catch (error) {
        console.error('❌ Content update failed:', error);
    }
}

console.log('🚀 IPS Push Service Worker v2.0 loaded successfully!');