export default function Footer() {
  return (
    <footer
      className="border-t"
      style={{
        borderColor: 'var(--border)',
        backgroundColor: 'color-mix(in srgb, var(--background) 92%, transparent)',
      }}
    >
      <div className="container mx-auto max-w-6xl px-4 py-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <span className="font-code text-[11px] tracking-[0.12em] text-muted-foreground">@ 2026</span>
        <p className="font-code text-[11px] tracking-[0.12em] text-muted-foreground">CRAFTED BY HUNTER BASTIAN</p>
      </div>
    </footer>
  )
}
