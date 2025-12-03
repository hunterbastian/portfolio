/**
 * Smooth scroll utility for enhanced navigation
 */

export function smoothScrollTo(elementId: string) {
  const targetElement = document.getElementById(elementId)
  if (!targetElement) return

  targetElement.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest'
  })
}

/**
 * Enhanced scroll with easing
 */
export function smoothScrollToWithEasing(targetPosition: number, animationDuration: number = 800) {
  const initialScrollPosition = window.pageYOffset
  const scrollDistance = targetPosition - initialScrollPosition
  let animationStartTime: number | null = null

  function animateScrollStep(currentTimestamp: number) {
    if (animationStartTime === null) animationStartTime = currentTimestamp
    const elapsedTime = currentTimestamp - animationStartTime
    const scrollProgress = Math.min(elapsedTime / animationDuration, 1)
    
    // Easing function (ease-in-out-cubic)
    const easingValue = scrollProgress < 0.5
      ? 4 * scrollProgress * scrollProgress * scrollProgress
      : 1 - Math.pow(-2 * scrollProgress + 2, 3) / 2

    window.scrollTo(0, initialScrollPosition + scrollDistance * easingValue)

    if (elapsedTime < animationDuration) {
      requestAnimationFrame(animateScrollStep)
    }
  }

  requestAnimationFrame(animateScrollStep)
}

/**
 * Add smooth reveal on scroll
 */
export function initScrollReveal() {
  if (typeof window === 'undefined') return

  const scrollRevealObserver = new IntersectionObserver(
    (observerEntries) => {
      observerEntries.forEach((observerEntry) => {
        if (observerEntry.isIntersecting) {
          observerEntry.target.classList.add('reveal')
          scrollRevealObserver.unobserve(observerEntry.target)
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  )

  document.querySelectorAll('[data-reveal]').forEach((revealElement) => {
    scrollRevealObserver.observe(revealElement)
  })

  return () => scrollRevealObserver.disconnect()
}
