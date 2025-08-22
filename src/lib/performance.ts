// Performance utilities for optimizing the portfolio

/**
 * Preload critical resources
 */
export function preloadCriticalResources() {
  if (typeof window !== 'undefined') {
    // Preload hero image
    const heroImage = new Image()
    heroImage.src = '/favicon/Frame.svg'
    
    // Preload project images (first 3 for above-the-fold)
    const projectImages = [
      '/images/projects/brand-identity-system.svg',
      '/images/projects/porscheapp.png',
      '/images/projects/wanderutah.png'
    ]
    
    projectImages.forEach(src => {
      const img = new Image()
      img.src = src
    })
  }
}

/**
 * Lazy load animation library components
 */
export function setupLazyLoading() {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    // Setup intersection observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      { threshold: 0.1, rootMargin: '50px' }
    )
    
    // Observe elements that should animate in
    document.querySelectorAll('[data-animate]').forEach(el => {
      observer.observe(el)
    })
  }
}

/**
 * Optimize iframe loading for gems
 */
export function optimizeIframeLoading() {
  if (typeof window !== 'undefined') {
    // Lazy load iframes when they come into view
    const iframes = document.querySelectorAll('iframe[data-src]')
    
    if ('IntersectionObserver' in window) {
      const iframeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const iframe = entry.target as HTMLIFrameElement
            if (iframe.dataset.src) {
              iframe.src = iframe.dataset.src
              iframe.removeAttribute('data-src')
              iframeObserver.unobserve(iframe)
            }
          }
        })
      }, { threshold: 0.1 })
      
      iframes.forEach(iframe => iframeObserver.observe(iframe))
    }
  }
}

/**
 * Performance monitoring
 */
export function measurePerformance() {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Measure Core Web Vitals
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(console.log)
      onINP(console.log)
      onFCP(console.log)
      onLCP(console.log)
      onTTFB(console.log)
    }).catch(() => {
      // Fallback if web-vitals is not available
      console.log('Web Vitals not available')
    })
  }
}
