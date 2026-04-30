'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [footerHidden, setFooterHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    let ticking = false

    const updateFooterVisibility = () => {
      const currentScrollY = window.scrollY
      const scrollingDown = currentScrollY > lastScrollY.current
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current)
      const viewportBottom = currentScrollY + window.innerHeight
      const pageHeight = document.documentElement.scrollHeight
      const nearPageEnd = viewportBottom >= pageHeight - 160

      if (currentScrollY <= 24 || nearPageEnd) {
        setFooterHidden(false)
      } else if (scrollDelta > 6) {
        setFooterHidden(!scrollingDown)
      }

      lastScrollY.current = currentScrollY
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateFooterVisibility)
        ticking = true
      }
    }

    lastScrollY.current = window.scrollY
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <footer
      className={`px-5 pb-10 pt-20 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-8 sm:pb-14 ${
        footerHidden ? 'pointer-events-none translate-y-6 opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="mx-auto max-w-[36rem] border-t border-border/80 pt-5">
        <div className="flex flex-col gap-2 text-[0.76rem] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="font-header transition-colors duration-150 hover:text-foreground/78">© {currentYear} Hunter Bastian</p>
          <p className="font-header transition-colors duration-150 hover:text-foreground/78 inline-flex items-center gap-2">
            <Image
              src="/favicon/favicon-32x32.png"
              alt=""
              width={16}
              height={16}
              aria-hidden="true"
              className="size-3.5 rounded-full shadow-[0_0_10px_rgba(234,97,174,0.2)]"
            />
            <span>Made with care in Utah.</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
