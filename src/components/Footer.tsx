import FooterSnakeEasterEgg from './FooterSnakeEasterEgg'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="relative overflow-hidden border-t"
      style={{
        borderColor: 'color-mix(in srgb, #3a3a3a 58%, #0a0a0a)',
        background:
          'linear-gradient(180deg, color-mix(in srgb, #1a1a1a 92%, #0a0a0a) 0%, color-mix(in srgb, #111111 94%, transparent) 100%)',
        backdropFilter: 'blur(14px) saturate(1.06)',
        WebkitBackdropFilter: 'blur(14px) saturate(1.06)',
        boxShadow: '0 -14px 30px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08),rgba(255,255,255,0.01),rgba(255,255,255,0.08))] opacity-55"
      />
      <div className="container relative z-10 mx-auto grid max-w-6xl gap-3 px-4 py-6 text-center md:grid-cols-[1fr_auto_1fr] md:items-center">
        <span className="font-code text-[11px] tracking-[0.12em] text-[#b8b8b8] md:justify-self-start">@ {currentYear}</span>
        <div className="flex items-center justify-center">
          <FooterSnakeEasterEgg />
        </div>
        <p className="font-code text-[11px] tracking-[0.12em] text-[#b8b8b8] md:justify-self-end md:text-right">
          CRAFTED BY HUNTER BASTIAN
        </p>
      </div>
    </footer>
  )
}
