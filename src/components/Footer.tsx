import FooterSnakeEasterEgg from './FooterSnakeEasterEgg'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="border-t"
      style={{
        borderColor: 'var(--border)',
        backgroundColor: 'color-mix(in srgb, var(--background) 92%, transparent)',
      }}
    >
      <div className="container mx-auto grid max-w-6xl gap-3 px-4 py-6 text-center md:grid-cols-[1fr_auto_1fr] md:items-center">
        <span className="font-code text-[11px] tracking-[0.12em] text-muted-foreground md:justify-self-start">@ {currentYear}</span>
        <div className="flex items-center justify-center">
          <FooterSnakeEasterEgg />
        </div>
        <p className="font-code text-[11px] tracking-[0.12em] text-muted-foreground md:justify-self-end md:text-right">
          CRAFTED BY HUNTER BASTIAN
        </p>
      </div>
    </footer>
  )
}
