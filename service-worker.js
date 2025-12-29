// Service Worker for Indian Public School Khandwa - v7
const CACHE_NAME = 'ips-khandwa-v8';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './logo.png',
  './logo-hq.png',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Montserrat:wght@800;900&display=swap'
];

// Dynamic cache for API responses
const DYNAMIC_CACHE = 'ips-dynamic-v2';

// Install event - cache essential files
self.addEventListener('install', event => {
  console.log('📦 Service Worker v7 installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Caching essential files for Indian Public School');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ All files cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Cache installation failed:', error);
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('🔄 Service Worker v7 activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete old caches except current
          if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('✅ Service Worker v7 ready to control pages');
      return self.clients.claim();
    })
    .then(() => {
      // Send message to all clients that SW is updated
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_UPDATED',
            version: 'v7',
            message: 'Service Worker updated to version 7'
          });
        });
      });
    })
  );
});

// Fetch event - serve from cache first
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip Chrome extensions
  if (event.request.url.startsWith('chrome-extension://')) return;

  // Network-first for API calls, Cache-first for assets
  if (event.request.url.includes('/api/') || event.request.url.includes('youtube.com')) {
    // Network-first strategy for dynamic content
    event.respondWith(networkFirstStrategy(event.request));
  } else {
    // Cache-first strategy for static assets
    event.respondWith(cacheFirstStrategy(event.request));
  }
});

// Cache-first strategy (for static assets)
async function cacheFirstStrategy(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('📦 Serving from cache:', request.url);
      return cachedResponse;
    }

    // If not in cache, fetch from network
    console.log('🌐 Fetching from network:', request.url);
    const networkResponse = await fetch(request);

    // Cache the new response (if successful)
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      await cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('❌ Network failed, serving fallback:', request.url);
    
    // Return fallback based on request type
    if (request.destination === 'document' || 
        request.headers.get('accept').includes('text/html')) {
      return caches.match('./index.html');
    }
    
    if (request.destination === 'image') {
      return caches.match('./logo.png');
    }
    
    return new Response('Offline - Indian Public School', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Network-first strategy (for dynamic content)
async function networkFirstStrategy(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    console.log('🌐 Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // No cache available
    return new Response('Network error - please check connection', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Background sync for offline form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'submit-form') {
    console.log('🔄 Background sync triggered:', event.tag);
    event.waitUntil(submitFormData());
  }
  
  if (event.tag === 'sync-notifications') {
    console.log('🔄 Syncing notification subscriptions');
    event.waitUntil(syncNotificationSubscriptions());
  }
});

// ========== ENHANCED PUSH NOTIFICATIONS ==========
self.addEventListener('push', event => {
  console.log('🔔 Push notification received');
  
  let notificationData = {
    title: 'Indian Public School Khandwa',
    body: 'New update from Indian Public School',
    icon: './logo.png',
    badge: './logo.png',
    image: './logo-hq.png',
    url: './index.html',
    timestamp: new Date().toISOString(),
    tag: 'school-update'
  };

  // Parse incoming data
  if (event.data) {
    try {
      const customData = event.data.json();
      notificationData = { ...notificationData, ...customData };
      console.log('📨 Custom push data:', customData);
    } catch (e) {
      // If not JSON, try as text
      try {
        const textData = event.data.text();
        if (textData) notificationData.body = textData;
      } catch (textError) {
        console.log('📨 Raw push data (not text/JSON)');
      }
    }
  }

  // Enhanced notification options
  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    image: notificationData.image,
    vibrate: [100, 50, 100, 50, 100],
    timestamp: new Date(notificationData.timestamp).getTime(),
    data: {
      url: notificationData.url,
      id: notificationData.id || Date.now().toString(),
      tag: notificationData.tag,
      timestamp: notificationData.timestamp
    },
    actions: [
      {
        action: 'open-website',
        title: '📱 Open School App'
      },
      {
        action: 'youtube',
        title: '🎥 Watch Videos'
      },
      {
        action: 'call',
        title: '📞 Call School'
      }
    ],
    requireInteraction: false,
    silent: false
  };

  // Show the notification
  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
    .then(() => {
      console.log('✅ Notification shown:', notificationData.title);
      // Send analytics if needed
      sendNotificationAnalytics('shown', notificationData);
    })
    .catch(error => {
      console.error('❌ Failed to show notification:', error);
    })
  );
});

// Enhanced notification click handler
self.addEventListener('notificationclick', event => {
  console.log('🖱️ Notification clicked:', event.notification.tag);
  
  // Close the notification
  event.notification.close();
  
  const notificationData = event.notification.data || {};
  
  // Handle different actions
  switch (event.action) {
    case 'open-website':
      event.waitUntil(
        clients.openWindow(notificationData.url || './index.html')
      );
      break;
      
    case 'youtube':
      event.waitUntil(
        clients.openWindow('https://youtube.com/@indianpublicschoolkhandwa5876')
      );
      break;
      
    case 'call':
      event.waitUntil(
        clients.openWindow('tel:+917333574759')
      );
      break;
      
    default:
      // Default click action - open website
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
  sendNotificationAnalytics('clicked', notificationData);
});

// Notification close handler
self.addEventListener('notificationclose', event => {
  console.log('❌ Notification closed:', event.notification.tag);
  const notificationData = event.notification.data || {};
  sendNotificationAnalytics('dismissed', notificationData);
});

// Message handler for communication from web page
self.addEventListener('message', event => {
  console.log('📨 Message received in Service Worker:', event.data);
  
  switch (event.data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'TEST_NOTIFICATION':
      self.registration.showNotification('Test from Service Worker', {
        body: 'This is a test notification sent via Service Worker',
        icon: './logo.png',
        tag: 'test'
      });
      break;
      
    case 'GET_CACHE_INFO':
      caches.keys().then(cacheNames => {
        event.ports[0].postMessage({
          caches: cacheNames,
          version: 'v7'
        });
      });
      break;
  }
});

// ========== HELPER FUNCTIONS ==========

// Submit form data (for future use)
async function submitFormData() {
  try {
    // Get pending forms from IndexedDB
    const pendingForms = await getPendingForms();
    
    for (const form of pendingForms) {
      const response = await fetch('https://your-backend.com/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.data)
      });
      
      if (response.ok) {
        console.log('✅ Form submitted successfully:', form.id);
        await removePendingForm(form.id);
        
        // Show success notification
        self.registration.showNotification('Form Submitted', {
          body: 'Your admission form has been submitted successfully!',
          icon: './logo.png'
        });
      }
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error('❌ Form submission failed:', error);
    return Promise.reject(error);
  }
}

// Sync notification subscriptions
async function syncNotificationSubscriptions() {
  try {
    const registration = await self.registration;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      // Send subscription to backend
      const response = await fetch('https://your-backend.com/api/save-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription.toJSON())
      });
      
      if (response.ok) {
        console.log('✅ Subscription synced with backend');
      }
    }
  } catch (error) {
    console.error('❌ Subscription sync failed:', error);
  }
}

// Send notification analytics
function sendNotificationAnalytics(action, data) {
  // In production, send to your analytics server
  console.log(`📊 Notification ${action}:`, {
    id: data.id,
    tag: data.tag,
    timestamp: data.timestamp,
    action: action
  });
  
  // Example: Store in IndexedDB for offline analytics
  storeAnalyticsEvent({
    type: 'notification_' + action,
    data: data,
    timestamp: new Date().toISOString()
  });
}

// Store analytics events (offline)
function storeAnalyticsEvent(event) {
  // Implementation for IndexedDB
  console.log('📈 Analytics event stored:', event);
}

// Get pending forms from storage
async function getPendingForms() {
  // Implementation for IndexedDB
  return [];
}

// Remove pending form
async function removePendingForm(formId) {
  // Implementation for IndexedDB
  return true;
}

// Periodic sync (if browser supports it)
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', event => {
    if (event.tag === 'update-content') {
      console.log('🔄 Periodic sync triggered');
      event.waitUntil(updateCachedContent());
    }
  });
}

// Update cached content periodically
async function updateCachedContent() {
  try {
    const cache = await caches.open(CACHE_NAME);
    
    // Update critical files
    const updatePromises = urlsToCache.map(url => {
      return fetch(url).then(response => {
        if (response.ok) {
          return cache.put(url, response);
        }
      }).catch(error => {
        console.log(`⚠️ Failed to update ${url}:`, error);
      });
    });
    
    await Promise.all(updatePromises);
    console.log('✅ Content updated successfully');
  } catch (error) {
    console.error('❌ Content update failed:', error);
  }
}

console.log('🚀 Service Worker v7 loaded successfully');
