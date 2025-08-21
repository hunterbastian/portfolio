// Service Worker for Portfolio - Basic offline support
const CACHE_NAME = 'portfolio-v1'
const STATIC_ASSETS = [
  '/',
  '/favicon/favicon.ico',
  '/favicon/favicon-32x32.png',
  '/favicon/apple-touch-icon.png',
  '/images/portfolio/IMG_2600.jpg',
  '/images/projects/brand-identity-system.svg',
  '/images/projects/porscheapp.png',
  '/images/projects/wanderutah.png'
]

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        )
      })
      .then(() => self.clients.claim())
  )
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return
  
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return
  
  // Skip API routes and dynamic content
  if (event.request.url.includes('/api/')) return
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if available
        if (response) {
          return response
        }
        
        // Otherwise, fetch from network
        return fetch(event.request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }
            
            // Clone the response
            const responseToCache = response.clone()
            
            // Cache pages and static assets
            if (event.request.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|avif)$/)) {
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache)
                })
            }
            
            return response
          })
          .catch(() => {
            // Offline fallback for pages
            if (event.request.mode === 'navigate') {
              return caches.match('/')
            }
            return null
          })
      })
  )
})
