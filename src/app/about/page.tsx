import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import IconArrowBackUp from '@/components/IconArrowBackUp'
import AnimatedDashedArrow from '@/components/AnimatedDashedArrow'

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
          className="group inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.06em] text-muted-foreground hover:text-foreground"
        >
          <IconArrowBackUp size={12} className="shrink-0 opacity-60 transition-transform duration-200 ease-out group-hover:-translate-x-0.5" aria-hidden />
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

        <Link
          href="/#contact"
          className="group mt-6 inline-flex items-center gap-1.5 text-xs tracking-[0.08em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-200"
          style={{ fontFamily: 'inherit' }}
        >
          Contact
          <AnimatedDashedArrow size={14} />
        </Link>

      </div>
      </div>
    </div>
  )
}
