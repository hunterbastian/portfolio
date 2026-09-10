import { homePhilosophyContent } from '@/content/homepage'
import { HOME_PHILOSOPHY_TITLE } from '@/lib/home-philosophy'

export function HomePhilosophySection() {
  return (
    <section className="max-w-[31rem] space-y-2.5 sm:space-y-3">
      <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.1em] text-muted-foreground/62">
        {HOME_PHILOSOPHY_TITLE}
      </p>
      <p className="text-pretty font-header text-[14px] font-normal leading-[1.62] tracking-[-0.012em] text-foreground/86">
        {homePhilosophyContent.body}
      </p>
    </section>
  )
}
