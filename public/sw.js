// Service Worker for Portfolio - Assets only, fresh HTML always
const CACHE_NAME = 'portfolio-assets-v2'
const STATIC_ASSETS = [
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

// Fetch event - Network first for HTML, cache for assets
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return
  
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return
  
  // Skip API routes
  if (event.request.url.includes('/api/')) return
  
  // Determine if this is a static asset
  const isStaticAsset = event.request.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|avif|woff|woff2)$/) ||
                        event.request.url.includes('/_next/static/')
  
  if (isStaticAsset) {
    // Cache first for static assets
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) return response
          
          return fetch(event.request)
            .then(response => {
              if (response && response.status === 200) {
                const responseToCache = response.clone()
                caches.open(CACHE_NAME)
                  .then(cache => cache.put(event.request, responseToCache))
              }
              return response
            })
        })
    )
  } else {
    // Network first for HTML pages - ALWAYS FRESH
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Only fallback to cache for navigation requests when truly offline
          if (event.request.mode === 'navigate') {
            return new Response(
              '<html><body><h1>Offline</h1><p>Please check your connection</p></body></html>',
              { headers: { 'Content-Type': 'text/html' } }
            )
          }
          return null
        })
    )
  }
})
