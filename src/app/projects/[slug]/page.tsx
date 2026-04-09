import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getAllProjects, getProjectBySlug } from '@/lib/projects'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import mdxComponents from '@/components/mdx/MDXComponents'
import { resolveSiteUrl, siteConfig, sitePortfolioName } from '@/lib/site'
import { IconTag } from 'nucleo-pixel-essential'
import BreadcrumbPill from '@/components/BreadcrumbPill'
import ProjectDetailContent from '@/components/ProjectDetailContent'
import CaseStudyNav from '@/components/CaseStudyNav'

function resolveImageUrl(image: string): string {
  return image.startsWith('/') ? resolveSiteUrl(image) : image
}

function formatProjectDate(dateValue?: string): string {
  if (!dateValue) {
    return ''
  }

  const parsedDate = new Date(dateValue)
  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(parsedDate)
}

// Revalidate every 5 minutes for individual project pages
export const revalidate = 300

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const projects = getAllProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    return {}
  }

  const { title, description, image, category, tags, date } = project.frontmatter
  const imageUrl = resolveImageUrl(image)

  return {
    title: `${title} | ${sitePortfolioName}`,
    description,
    keywords: [title, category, ...(tags || []), siteConfig.brandName, 'portfolio', 'case study'],
    openGraph: {
      type: 'article',
      title: `${title} - Case Study`,
      description,
      url: resolveSiteUrl(`/projects/${slug}`),
      siteName: sitePortfolioName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      publishedTime: date,
      authors: [siteConfig.brandName],
      tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: resolveSiteUrl(`/projects/${slug}`),
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const { frontmatter, content } = project
  const isPlayground = frontmatter.archived === true
  const projectUrl = resolveSiteUrl(`/projects/${slug}`)
  const imageUrl = resolveImageUrl(frontmatter.image)
  const displayTitle = frontmatter.displayTitle ?? frontmatter.title
  const formattedDate = formatProjectDate(frontmatter.date)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: frontmatter.title,
      description: frontmatter.description,
      image: imageUrl,
      datePublished: frontmatter.date,
      dateModified: frontmatter.date,
      author: {
        '@type': 'Person',
        name: siteConfig.brandName,
        url: siteConfig.url,
      },
      publisher: {
        '@type': 'Person',
        name: siteConfig.brandName,
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': projectUrl,
      },
      keywords: frontmatter.tags?.join(', '),
      articleSection: frontmatter.category,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
        { '@type': 'ListItem', position: 2, name: 'Projects', item: resolveSiteUrl('/#case-studies') },
        { '@type': 'ListItem', position: 3, name: frontmatter.title, item: projectUrl },
      ],
    },
  ]

  return (
    <article className="container mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-4 sm:mb-8 flex justify-start">
        <BreadcrumbPill
          href={isPlayground ? '/archive' : '/'}
          parentLabel={isPlayground ? 'Playground' : 'Home'}
          currentLabel="Projects"
        />
      </div>

      <div className="relative mx-auto max-w-[560px]">
        <CaseStudyNav />
        <ProjectDetailContent
          slug={slug}
          header={
            <header className="mb-8 flex flex-col items-center text-center">
              <h1 className="font-mono text-lg font-medium tracking-[0.01em] text-foreground sm:text-2xl">{displayTitle}</h1>
              {formattedDate && <p className="mt-1 font-mono text-sm text-muted-foreground">{formattedDate}</p>}
            </header>
          }
          image={
            <div className="relative mb-12 aspect-[4/3] w-full overflow-hidden rounded-[3px] img-inset-outline shadow-card">
              <Image
                src={frontmatter.image}
                alt={frontmatter.title}
                fill
                className="object-cover"
                priority
                quality={90}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
              />
            </div>
          }
          description={
            <p className="mb-10 px-3 text-center text-balance font-inter text-[13px] leading-relaxed text-muted-foreground sm:px-2">
              {frontmatter.description}
            </p>
          }
          meta={
            <div className="mb-12 flex flex-wrap gap-4">
              <div className="group flex items-center gap-2 font-inter text-[13px] text-muted-foreground">
                <IconTag size={12} className="shrink-0 opacity-50 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[-6deg] group-hover:scale-110" aria-hidden />
                <span className="font-medium">Category:</span>
                <span className="bg-accent/10 text-accent px-3 py-1.5 rounded-[3px] sm:py-1">
                  {frontmatter.category}
                </span>
              </div>
            </div>
          }
          links={
            (frontmatter.github || frontmatter.demo || frontmatter.figjam) ? (
              <div className="mb-12 flex flex-wrap gap-3">
                {frontmatter.github && (
                  <a
                    href={frontmatter.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 font-inter text-[13px] font-medium text-primary transition-[color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-accent hover:-translate-y-[2px]"
                  >
                    <svg className="w-5 h-5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    View on GitHub
                  </a>
                )}
                {frontmatter.demo && (
                  <a
                    href={frontmatter.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 font-inter text-[13px] font-medium text-primary transition-[color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-accent hover:-translate-y-[2px]"
                  >
                    <svg className="w-5 h-5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[1px] group-hover:translate-x-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Live Demo
                  </a>
                )}
                {frontmatter.figjam && (
                  <a
                    href={frontmatter.figjam}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 font-inter text-[13px] font-medium text-primary transition-[color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-accent hover:-translate-y-[2px]"
                  >
                    <svg className="w-5 h-5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    View Slides
                  </a>
                )}
              </div>
            ) : null
          }
          content={
            <div className="prose dark:prose-invert max-w-none font-inter text-[13px] [&_li]:font-inter [&_ol]:font-inter [&_p]:font-inter [&_p]:text-[13px] [&_ul]:font-inter [&_li]:text-[13px] [&_h2]:font-mono [&_h3]:font-mono [&_h4]:font-mono">
              <MDXRemote source={content} components={mdxComponents} />
            </div>
          }
        />
      </div>
    </article>
  )
}
