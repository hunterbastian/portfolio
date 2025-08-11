'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState } from 'react'

const navigation: Array<{ name: string; href: string }> = []

export default function Header() {
  const pathname = usePathname()
  const [language, setLanguage] = useState('EN')

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 mx-auto max-w-6xl">
                       <Link href="/" className="flex items-center space-x-2">
                 <span className="font-bold" style={{ fontSize: '11px' }}>
                   HB
                 </span>
               </Link>
        
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
              className="relative font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              style={{ fontSize: '11px' }}
            >
              {language}
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-foreground"
                layoutId="language-underline"
              />
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
