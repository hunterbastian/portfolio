'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState } from 'react'
import ScrollIndicator from './ScrollIndicator'

const navigation: Array<{ name: string; href: string }> = []

export default function Header() {
  const pathname = usePathname()
  const [language, setLanguage] = useState('EN')

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 mx-auto max-w-6xl">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold" style={{ fontSize: '11px' }}>
              HB
            </span>
            <div className="relative" style={{ width: '11px', height: '11px' }}>
              <Image
                src="/favicon/Frame.svg"
                alt="Hunter Bastian Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
          <ScrollIndicator />
        </div>
        
        <nav className="ml-auto flex items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative font-medium transition-colors hover:text-foreground/80 ${
                pathname === item.href ? 'text-foreground' : 'text-foreground/60'
              }`}
              style={{ fontSize: '11px' }}
            >
              {item.name}
              {pathname === item.href && (
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-foreground"
                  layoutId="underline"
                />
              )}
            </Link>
          ))}
          
          {/* Language Switcher */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setLanguage(language === 'EN' ? 'ES' : 'EN')}
              className="relative font-medium transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1"
              style={{ fontSize: '11px' }}
            >
              <svg 
                className="w-3 h-3" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12h20"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              {language}
            </button>
          </div>

          {/* Profile Picture */}
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/10 border border-white/20">
            <Image
              src="/favicon/Frame.svg"
              alt="Hunter Bastian Profile"
              fill
              className="object-cover"
              priority
            />
          </div>

        </nav>
      </div>
    </header>
  )
}
