import ArcSigilLoader from '@/components/ArcSigilLoader'

export default function LogoPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-6 py-12">
      <div className="nord-panel w-full max-w-2xl rounded-xl p-8 text-center">
        <p className="font-code text-xs uppercase tracking-[0.14em] text-muted-foreground">Studio Alpine</p>
        <h1 className="mt-3 font-garamond-narrow text-3xl font-semibold text-foreground sm:text-4xl">
          Loader Logo Export
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Updated animated sigil loader with export options. Use the LinkedIn button for a square profile-ready PNG.
        </p>

        <ArcSigilLoader size={220} downloadable className="mt-8" />
      </div>
    </main>
  )
}
