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

const skillAreas = [
  { label: 'Design', detail: 'Interfaces, interaction patterns, prototyping' },
  { label: 'Development', detail: 'Next.js, TypeScript, Three.js, Rust' },
  { label: 'Photography', detail: 'Studio Alpine — landscape and editorial' },
  { label: 'Games', detail: 'WebGPU, voxel engines, browser-based worlds' },
] as const

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

        <div className="relative z-10 flex justify-center pb-24 pt-12 sm:pt-20">
          <div className="flex flex-col items-center text-center max-w-md">
            {/* --- Profile --- */}
            <Image
              src="/images/profilepicture.webp"
              alt="Hunter Bastian"
              width={120}
              height={120}
              className="rounded-full img-inset-outline shadow-sm"
              priority
            />

            <h1 className="mt-8 text-sm font-medium tracking-[0.12em] uppercase text-foreground">
              Hunter Bastian
            </h1>

            <p className="mt-4 text-sm leading-relaxed text-balance text-muted-foreground">
              Interaction design student at Utah Valley University. I design and build
              digital products with care and photograph the world in between.
            </p>

            {/* --- Currently --- */}
            <div className="mt-14 w-full">
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                Currently
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground text-left">
                Studying Interaction Design at UVU, where I also serve as Department
                Representative. Building games, tools, and interfaces in my spare time.
                Available for freelance and collaboration.
              </p>
            </div>

            {/* --- Actions --- */}
            <div className="mt-14 flex items-center gap-5">
              <Link
                href="/#contact"
                className="group inline-flex items-center gap-1.5 text-xs tracking-[0.08em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-200"
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
