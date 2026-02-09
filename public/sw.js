// Service Worker for Portfolio - Assets only, fresh HTML always
const CACHE_NAME = 'portfolio-assets-v6'
const STATIC_ASSETS = [
  '/favicon.ico',
  '/favicon/favicon.ico',
  '/favicon/favicon-32x32.png', 
  '/favicon/apple-touch-icon.png',
  '/images/profilepicture.jpg',
  '/images/social/profile-preview.jpg',
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
  
  // Determine asset types
  const isNextStatic = event.request.url.includes('/_next/static/')
  const isCodeAsset = event.request.url.match(/\.(js|css)$/)
  const isStaticAsset = event.request.url.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|avif|woff|woff2)$/)

  if (isNextStatic || isCodeAsset) {
    // Stale-while-revalidate for JS/CSS and Next chunks: instant cache hit + background refresh
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const networkFetch = fetch(event.request)
          .then((response) => {
            if (response && response.status === 200) {
              const responseToCache = response.clone()
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache))
            }
            return response
          })
          .catch(() => cachedResponse)

        return cachedResponse || networkFetch
      })
    )
  } else if (isStaticAsset) {
    // Cache first for static media/fonts
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
          return Response.error()
        })
    )
  }
})
