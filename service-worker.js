// Service Worker for Indian Public School - ALL IN ONE
const CACHE_NAME = 'ips-khandwa-push-v1';
const VAPID_PUBLIC_KEY = 'BCqyvwEdH6jLlMn5j_HNrcXhU1zX1v1v-Q4YV2ScH2DTSm71qz_mgQh8Uq3Pm4BItGjhNp3c0nSlVJq8NnGgDGs';

// URLs to cache
const urlsToCache = [
  './',
  './index.html',
  './admin.html',
  './style.css',
  './logo.png',
  './manifest.json'
];

// Install - Cache files
self.addEventListener('install', event => {
  console.log('📦 Installing Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate - Clean old caches
self.addEventListener('activate', event => {
  console.log('✅ Service Worker activated!');
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.map(key => 
        key !== CACHE_NAME ? caches.delete(key) : null
      ))
    ).then(() => self.clients.claim())
  );
});

// Fetch - Cache first strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});

// ========== PUSH NOTIFICATIONS (CROSS-DEVICE) ==========
self.addEventListener('push', event => {
  console.log('🔔 Push received!');
  
  let data = {
    title: 'Indian Public School Khandwa',
    body: 'New school update',
    icon: './logo.png',
    url: './index.html'
  };

  // Parse data from admin
  if (event.data) {
    try {
      const jsonData = event.data.json();
      data = { ...data, ...jsonData };
    } catch (e) {
      const text = event.data.text();
      if (text) data.body = text;
    }
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: './logo.png',
    vibrate: [200, 100, 200],
    data: { url: data.url },
    actions: [
      { action: 'open', title: 'Open Website' },
      { action: 'youtube', title: 'Watch Videos' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  let url = './index.html';
  if (event.action === 'youtube') {
    url = 'https://youtube.com/@indianpublicschoolkhandwa5876';
  } else if (event.notification.data.url) {
    url = event.notification.data.url;
  }

  event.waitUntil(
    clients.openWindow(url)
  );
});

// Handle messages from admin
self.addEventListener('message', event => {
  console.log('📨 Message from admin:', event.data);
  
  if (event.data.type === 'ADMIN_NOTIFICATION') {
    self.registration.showNotification(event.data.title, {
      body: event.data.body,
      icon: event.data.icon || './logo.png',
      badge: './logo.png',
      data: { url: event.data.url || './index.html' }
    });
  }
});

console.log('🚀 Service Worker loaded with push support!');