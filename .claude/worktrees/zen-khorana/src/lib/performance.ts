export function preloadCriticalResources(): void {
  if (typeof window === 'undefined') {
    return
  }

  const heroImage = new Image()
  heroImage.src = '/favicon/Frame.svg'

  const aboveFoldImages = [
    '/images/projects/brand-identity-system.svg',
    '/images/projects/porscheapp.webp',
    '/images/projects/wanderutah.webp',
  ]

  for (const src of aboveFoldImages) {
    const img = new Image()
    img.src = src
  }
}

export function optimizeIframeLoading(): void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return
  }

  const iframes = document.querySelectorAll('iframe[data-src]')

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const iframe = entry.target as HTMLIFrameElement
          if (iframe.dataset.src) {
            iframe.src = iframe.dataset.src
            iframe.removeAttribute('data-src')
            observer.unobserve(iframe)
          }
        }
      }
    },
    { threshold: 0.1 }
  )

  iframes.forEach((iframe) => observer.observe(iframe))
}

export function measurePerformance(): void {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return
  }

  import('web-vitals')
    .then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(console.log)
      onINP(console.log)
      onFCP(console.log)
      onLCP(console.log)
      onTTFB(console.log)
    })
    .catch(() => {
      console.log('Web Vitals not available')
    })
}
