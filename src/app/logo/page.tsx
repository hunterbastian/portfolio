import type { Metadata } from 'next'
import ArcSigilLoader from '@/components/ArcSigilLoader'
import { sitePortfolioName } from '@/lib/site'

export const metadata: Metadata = {
  title: `Logo | ${sitePortfolioName}`,
  description: 'Studio Alpine animated sigil loader with export options.',
  robots: { index: false },
}

export default function LogoPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[560px] flex-col items-center justify-center px-6 py-12">
      <div className="nord-panel w-full max-w-[560px] p-8 text-center">
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Studio Alpine</p>
        <h1 className="mt-3 font-mono text-lg font-medium tracking-[0.01em] text-foreground sm:text-xl">
          Loader Logo Export
        </h1>
        <p className="mx-auto mt-3 max-w-xl font-inter text-sm text-muted-foreground">
          Animated sigil loader with export options. Use the LinkedIn button for a square profile-ready PNG.
        </p>

        <ArcSigilLoader size={220} downloadable className="mt-8" />
      </div>
    </main>
  )
}
