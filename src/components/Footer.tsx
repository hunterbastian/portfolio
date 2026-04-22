import { Summer as PixelSun } from '@/components/pixel/glyphs'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="px-5 pb-10 pt-20 sm:px-8 sm:pb-14">
      <div className="mx-auto max-w-[36rem] border-t border-border/80 pt-5">
        <div className="flex flex-col gap-2 text-[0.76rem] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="transition-colors duration-150 hover:text-foreground/78">© {currentYear} Hunter Bastian</p>
          <p className="font-mono transition-colors duration-150 hover:text-foreground/78 inline-flex items-center gap-2">
            <span aria-hidden className="inline-flex text-accent/85 leading-none">
              <PixelSun size={11} />
            </span>
            <span>Made with care in Utah.</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
