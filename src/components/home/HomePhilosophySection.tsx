import { homePhilosophyContent } from '@/content/homepage'
import {
  HOME_PHILOSOPHY_BODY_CLASS_NAME,
  HOME_PHILOSOPHY_TITLE,
  HOME_PHILOSOPHY_TITLE_CLASS_NAME,
} from '@/lib/home-philosophy'

export function HomePhilosophySection() {
  return (
    <section className="home-editorial-philosophy" aria-label={HOME_PHILOSOPHY_TITLE}>
      <p className={HOME_PHILOSOPHY_TITLE_CLASS_NAME}>
        {HOME_PHILOSOPHY_TITLE}
      </p>
      <div className="home-philosophy-note">
        <p className={HOME_PHILOSOPHY_BODY_CLASS_NAME}>{homePhilosophyContent.body}</p>
      </div>
    </section>
  )
}
