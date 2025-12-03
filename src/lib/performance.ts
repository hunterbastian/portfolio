// Performance utilities for optimizing the portfolio

/**
 * Preload critical resources
 */
export function preloadCriticalResources() {
  if (typeof window !== 'undefined') {
    // Preload hero image
    const heroImageElement = new Image()
    heroImageElement.src = '/favicon/Frame.svg'
    
    // Preload project images (first 3 for above-the-fold)
    const projectImageUrls = [
      '/images/projects/brand-identity-system.svg',
      '/images/projects/porscheapp.png',
      '/images/projects/wanderutah.png'
    ]
    
    projectImageUrls.forEach(imageUrl => {
      const imageElement = new Image()
      imageElement.src = imageUrl
    })
  }
}

/**
 * Lazy load animation library components
 */
export function setupLazyLoading(): () => void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return () => {}
  }

  const animationObserver = new IntersectionObserver(
    (observerEntries) => {
      observerEntries.forEach(observerEntry => {
        if (observerEntry.isIntersecting) {
          observerEntry.target.classList.add('animate-in')
        }
      })
    },
    { threshold: 0.1, rootMargin: '50px' }
  )

  const animatedElements = Array.from(document.querySelectorAll('[data-animate]'))
  animatedElements.forEach(animatedElement => {
    animationObserver.observe(animatedElement)
  })

  return () => {
    animatedElements.forEach(animatedElement => animationObserver.unobserve(animatedElement))
    animationObserver.disconnect()
  }
}

/**
 * Optimize iframe loading for gems
 */
export function optimizeIframeLoading() {
  if (typeof window !== 'undefined') {
    // Lazy load iframes when they come into view
    const lazyIframes = document.querySelectorAll('iframe[data-src]')
    
    if ('IntersectionObserver' in window) {
      const iframeLoadObserver = new IntersectionObserver((observerEntries) => {
        observerEntries.forEach(observerEntry => {
          if (observerEntry.isIntersecting) {
            const iframeElement = observerEntry.target as HTMLIFrameElement
            if (iframeElement.dataset.src) {
              iframeElement.src = iframeElement.dataset.src
              iframeElement.removeAttribute('data-src')
              iframeLoadObserver.unobserve(iframeElement)
            }
          }
        })
      }, { threshold: 0.1 })
      
      lazyIframes.forEach(iframeElement => iframeLoadObserver.observe(iframeElement))
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
