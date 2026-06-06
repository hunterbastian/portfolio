import PlaygroundOrbit from '@/components/PlaygroundOrbit'
import {
  PLAYGROUND_FLIGHT_DECK_LABEL,
  PLAYGROUND_FLIGHT_DECK_MODE,
  PLAYGROUND_FLIGHT_DECK_TITLE,
  PLAYGROUND_ORBIT_RADIUS_DESKTOP,
  PLAYGROUND_ORBIT_RADIUS_LARGE,
} from '@/lib/playground'
import type { Project } from '@/types/project'

interface PlaygroundFlightDeckProps {
  archiveRange: string
  projects: Project[]
}

export default function PlaygroundFlightDeck({ archiveRange, projects }: PlaygroundFlightDeckProps) {
  return (
    <section className="pt-8 sm:pt-10" aria-label={PLAYGROUND_FLIGHT_DECK_LABEL}>
      <div className="playground-flight-shell">
        <div className="playground-flight-toolbar">
          <div className="inline-flex min-w-0 items-center gap-2">
            <span className="playground-toolbar-beacon" aria-hidden="true" />
            <span>{PLAYGROUND_FLIGHT_DECK_TITLE}</span>
          </div>
          <div className="playground-toolbar-meta">
            <span>{PLAYGROUND_FLIGHT_DECK_MODE}</span>
            <span>{archiveRange}</span>
          </div>
        </div>

        <div className="playground-map-panel relative overflow-visible md:h-[40rem] lg:h-[42rem] xl:h-[44rem]">
          <div className="relative z-10 h-full">
            <PlaygroundOrbit
              projects={projects}
              radiusDesktop={PLAYGROUND_ORBIT_RADIUS_DESKTOP}
              radiusLarge={PLAYGROUND_ORBIT_RADIUS_LARGE}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
