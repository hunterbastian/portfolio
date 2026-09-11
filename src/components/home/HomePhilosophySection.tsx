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
      <p className={HOME_PHILOSOPHY_BODY_CLASS_NAME}>
        {homePhilosophyContent.body}
      </p>
    </section>
  )
}
