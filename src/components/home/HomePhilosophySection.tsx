import { homePhilosophyContent } from '@/content/homepage'
import {
  HOME_PHILOSOPHY_BODY_CLASS_NAME,
  HOME_PHILOSOPHY_TITLE,
  HOME_PHILOSOPHY_TITLE_CLASS_NAME,
} from '@/lib/home-philosophy'

export function HomePhilosophySection() {
  return (
    <section className="max-w-[31rem] space-y-2.5 sm:space-y-3">
      <p className={HOME_PHILOSOPHY_TITLE_CLASS_NAME}>
        {HOME_PHILOSOPHY_TITLE}
      </p>
      <div className="rounded-[8px] border border-border bg-card px-3.5 py-3.5 sm:px-4 sm:py-4">
        <p className={HOME_PHILOSOPHY_BODY_CLASS_NAME}>{homePhilosophyContent.body}</p>
      </div>
    </section>
  )
}
