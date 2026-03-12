import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About - Hunter Bastian',
  description: 'A little about Hunter Bastian — interaction designer, photographer, and student based in Utah.',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6">
      <div className="mb-16 flex justify-start pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <span aria-hidden className="text-base leading-none">↩</span>
          <span className="text-foreground">Home</span>
          <span aria-hidden className="text-muted-foreground/70">/</span>
          <span>About</span>
        </Link>
      </div>

      <div className="flex min-h-[calc(100vh-240px)] items-center justify-center">
      <div className="flex flex-col items-center text-center max-w-md">
        <Image
          src="/images/profilepicture.webp"
          alt="Hunter Bastian"
          width={120}
          height={120}
          className="rounded-full"
          priority
        />

        <h1 className="mt-8 text-sm font-medium tracking-[0.12em] uppercase" style={{ color: 'var(--foreground)' }}>
          Hunter Bastian
        </h1>

        <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)', fontFamily: 'inherit' }}>
          Interaction design student at Utah Valley University. I design and build
          digital products with care and photograph the world in between.
        </p>

        <Link
          href="/#contact"
          className="mt-6 text-xs tracking-[0.08em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-200"
          style={{ fontFamily: 'inherit' }}
        >
          Contact →
        </Link>

      </div>
      </div>
    </div>
  )
}
