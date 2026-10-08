'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useWebHaptics } from 'web-haptics/react'
import * as Drawer from '@/components/alignui/drawer'
import * as Button from '@/components/alignui/button'
import styles from '@/components/alignui/controls.module.css'
import { analytics } from '@/lib/analytics'
import { contactSocialLinks } from '@/content/homepage'

const links = [
  { href: '/', label: 'Home' },
  { href: '/#projects', label: 'Selected work' },
  { href: '/#playground', label: 'Featured experiment' },
  { href: '/archive', label: 'Playground' },
  { href: '/#background', label: 'Background' },
]

export default function MobileNavigation({ open: controlledOpen, onOpenChange }: { open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const [localOpen, setLocalOpen] = useState(false)
  const open = controlledOpen ?? localOpen
  const setOpen = onOpenChange ?? setLocalOpen
  const pathname = usePathname()
  const haptic = useWebHaptics()
  const email = contactSocialLinks.find(link => link.href.startsWith('mailto:'))

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 640px)')
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false) }
    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [setOpen])

  return <Drawer.Root open={open} onOpenChange={setOpen}>
    <Drawer.Trigger asChild>
      <Button.Root mode="ghost" aria-label="Open menu" onClick={() => haptic.trigger('light')}><Menu size={16} aria-hidden="true" />Menu</Button.Root>
    </Drawer.Trigger>
    <Drawer.Content aria-describedby={undefined}>
      <div className={styles.drawerHeader}>
        <Drawer.Title className={styles.drawerTitle}>Hunter Bastian</Drawer.Title>
        <Drawer.Close asChild><Button.Root mode="ghost" aria-label="Close menu"><X size={18} aria-hidden="true" /></Button.Root></Drawer.Close>
      </div>
      <nav className={styles.nav} aria-label="Main navigation">
        {links.map(link => <Drawer.Close asChild key={link.href}>
          <Link className={styles.navLink} href={link.href} aria-current={pathname === link.href ? 'page' : undefined} onClick={() => { analytics.navigationClick(link.label.toLowerCase()); haptic.trigger('light') }}>{link.label}</Link>
        </Drawer.Close>)}
      </nav>
      <div className={styles.drawerFooter}>
        <Drawer.Close asChild><Button.Root asChild><Link href="/cv">Resume</Link></Button.Root></Drawer.Close>
        {email ? <Drawer.Close asChild><Button.Root asChild mode="filled"><a href={email.href}>Email me</a></Button.Root></Drawer.Close> : null}
      </div>
    </Drawer.Content>
  </Drawer.Root>
}
