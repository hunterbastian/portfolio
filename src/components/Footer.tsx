import FooterSnakeEasterEgg from './FooterSnakeEasterEgg'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="relative border-t"
      style={{
        borderColor: 'var(--border)',
        background: 'var(--background)',
      }}
    >
      <div className="container relative z-10 mx-auto grid max-w-6xl gap-3 px-4 py-6 text-center md:grid-cols-[1fr_auto_1fr] md:items-center">
        <span className="font-sans text-[11px] tracking-[0.04em] text-muted-foreground md:justify-self-start">© {currentYear}</span>
        <div className="flex items-center justify-center">
          <FooterSnakeEasterEgg />
        </div>
        <p className="font-sans text-[11px] tracking-[0.04em] text-muted-foreground md:justify-self-end md:text-right">
          Crafted by Hunter Bastian
        </p>
      </div>
    </footer>
  )
}
