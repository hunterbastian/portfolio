import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import BreadcrumbPill from '@/components/BreadcrumbPill'
import AnimatedDashedArrow from '@/components/AnimatedDashedArrow'
import ResumeButton from '@/components/ResumeButton'

export const metadata: Metadata = {
  title: 'About - Hunter Bastian',
  description: 'A little about Hunter Bastian — interaction designer, photographer, and student based in Utah.',
}

export default function AboutPage() {
  return (
    <div className="relative min-h-screen">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.15] dark:opacity-[0.08] about-page-glow"
        aria-hidden="true"
      />
      <div className="relative z-10 container mx-auto max-w-6xl px-4 sm:px-6">
      <div className="mb-8 sm:mb-12 flex justify-start pt-4 sm:pt-6">
        <BreadcrumbPill href="/" parentLabel="Home" currentLabel="About" />
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-240px)] items-center justify-center">
      <div className="flex flex-col items-center text-center max-w-md">
        <Image
          src="/images/profilepicture.webp"
          alt="Hunter Bastian"
          width={120}
          height={120}
          className="rounded-full img-inset-outline shadow-sm"
          priority
        />

        <h1 className="mt-8 text-sm font-medium tracking-[0.12em] uppercase" style={{ color: 'var(--foreground)' }}>
          Hunter Bastian
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-balance" style={{ color: 'var(--muted-foreground)', fontFamily: 'inherit' }}>
          Interaction design student at Utah Valley University. I design and build
          digital products with care and photograph the world in between.
        </p>

        <div className="mt-6 flex items-center gap-5">
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-1.5 text-xs tracking-[0.08em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-200"
            style={{ fontFamily: 'inherit' }}
          >
            Contact
            <AnimatedDashedArrow size={14} />
          </Link>
          <ResumeButton />
        </div>

      </div>
      </div>
      </div>
    </div>
  )
}
