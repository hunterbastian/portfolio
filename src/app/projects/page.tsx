import CardsProjects from '@/components/cards/CardsProjects'
import { HOME_SHOWCASE_LOCATION, HOME_SHOWCASE_ROLE } from '@/lib/home-showcase'
import { getAllProjects, getArchivedProjects } from '@/lib/projects'
import { siteConfig } from '@/lib/site'
import { getStaticPageMetadata } from '@/lib/site-metadata'

const projectsTitle = `Projects | ${siteConfig.personName}`
const projectsDescription = `Projects by ${siteConfig.personName}, ${HOME_SHOWCASE_ROLE} in ${HOME_SHOWCASE_LOCATION}.`

export const metadata = getStaticPageMetadata({
  absoluteTitle: true,
  description: projectsDescription,
  image: '/projects/opengraph-image',
  imageAlt: projectsTitle,
  path: '/projects',
  siteName: siteConfig.personName,
  title: projectsTitle,
})

export const revalidate = 60

export default function ProjectsPage() {
  const projects = [...getAllProjects(), ...getArchivedProjects()]

  return <CardsProjects projects={projects} />
}
