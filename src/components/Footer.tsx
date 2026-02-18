import FooterSnakeEasterEgg from './FooterSnakeEasterEgg'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="relative overflow-hidden border-t"
      style={{
        borderColor: 'color-mix(in srgb, #6f92b3 34%, #0a111b)',
        background:
          'linear-gradient(180deg, color-mix(in srgb, #0f1a28 88%, #0a111b) 0%, color-mix(in srgb, #0b1421 90%, transparent) 100%)',
        backdropFilter: 'blur(14px) saturate(1.06)',
        WebkitBackdropFilter: 'blur(14px) saturate(1.06)',
        boxShadow: '0 -14px 32px rgba(2, 8, 18, 0.42), inset 0 1px 0 rgba(150, 186, 220, 0.18)',
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(184,221,255,0.18),rgba(184,221,255,0.03),rgba(184,221,255,0.18))] opacity-70"
      />
      <div className="container relative z-10 mx-auto grid max-w-6xl gap-3 px-4 py-6 text-center md:grid-cols-[1fr_auto_1fr] md:items-center">
        <span className="font-code text-[11px] tracking-[0.12em] text-[#a8bfd6] md:justify-self-start">@ {currentYear}</span>
        <div className="flex items-center justify-center">
          <FooterSnakeEasterEgg />
        </div>
        <p className="font-code text-[11px] tracking-[0.12em] text-[#a8bfd6] md:justify-self-end md:text-right">
          CRAFTED BY HUNTER BASTIAN
        </p>
      </div>
    </footer>
  )
}
