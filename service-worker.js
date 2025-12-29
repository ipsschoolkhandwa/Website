// Service Worker for Indian Public School Khandwa
const CACHE_NAME = 'ips-khandwa-v6';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './logo.png',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Montserrat:wght@800;900&display=swap'
];

// Install event - cache essential files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching essential files for Indian Public School');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache first
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if available
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Otherwise fetch from network
        return fetch(event.request)
          .then(response => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Cache the new resource
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // If network fails and it's a page request, return offline page
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('./index.html');
            }
            // If it's an image, return the logo
            if (event.request.destination === 'image') {
              return caches.match('./logo.png');
            }
          });
      })
  );
});

// Background sync for offline form submissions (if needed)
self.addEventListener('sync', event => {
  if (event.tag === 'submit-form') {
    event.waitUntil(submitFormData());
  }
});

// Push notifications support
// Replace your existing push event (lines 98-118) with:
self.addEventListener('push', event => {
    let data = {
        title: 'Indian Public School',
        body: 'New update from Indian Public School Khandwa',
        icon: './logo.png',
        badge: './logo.png',
        url: './index.html'
    };
    
    // Try to parse custom data if available
    if (event.data) {
        try {
            const customData = event.data.json();
            data = { ...data, ...customData };
        } catch (e) {
            // If not JSON, try as text
            const textData = event.data.text();
            if (textData) data.body = textData;
        }
    }
    
    const options = {
        body: data.body,
        icon: data.icon,
        badge: data.badge,
        vibrate: [100, 50, 100],
        data: {
            url: data.url || './index.html',
            timestamp: new Date().toISOString()
        },
        actions: [
            {
                action: 'open',
                title: 'Open Website'
            },
            {
                action: 'youtube',
                title: 'Watch Videos'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Enhanced notification click handler
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    } else if (event.action === 'youtube') {
        event.waitUntil(
            clients.openWindow('https://youtube.com/@indianpublicschoolkhandwa5876')
        );
    } else {
        // Default click action
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});
// Helper function for form submission (for future use)
async function submitFormData() {
  // This function would handle offline form submissions
  // For now, it's a placeholder for future functionality
  console.log('Background sync for form submission');
  return Promise.resolve();
}
