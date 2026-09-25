import { homePhilosophyContent } from '@/content/homepage'
import {
  HOME_PHILOSOPHY_BODY_CLASS_NAME,
  HOME_PHILOSOPHY_TITLE,
  HOME_PHILOSOPHY_TITLE_CLASS_NAME,
} from '@/lib/home-philosophy'

export function HomePhilosophySection() {
  return (
    <section className="space-y-4">
      <p className={HOME_PHILOSOPHY_TITLE_CLASS_NAME}>
        {HOME_PHILOSOPHY_TITLE}
      </p>
      <div className="rounded-[8px] border border-border bg-card p-5 sm:p-6">
        <p className={HOME_PHILOSOPHY_BODY_CLASS_NAME}>{homePhilosophyContent.body}</p>
      </div>
    </section>
  )
}
