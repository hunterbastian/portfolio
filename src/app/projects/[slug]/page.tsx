import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getAllProjects, getProjectBySlug } from '@/lib/projects'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import mdxComponents from '@/components/mdx/MDXComponents'

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
  const baseUrl = 'https://hunterbastian.com'
  const brandName = 'Hunter Bastian // Studio Alpine'
  
  if (!project) {
    return {}
  }

  const { title, description, image, category, tags, date } = project.frontmatter

  return {
    title: `${title} | ${brandName} Portfolio`,
    description: description,
    keywords: [title, category, ...(tags || []), brandName, 'portfolio', 'case study'],
    openGraph: {
      type: 'article',
      title: `${title} - Case Study`,
      description: description,
      url: `${baseUrl}/projects/${slug}`,
      siteName: `${brandName} Portfolio`,
      images: [
        {
          url: image.startsWith('/') ? `${baseUrl}${image}` : image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      publishedTime: date,
      authors: [brandName],
      tags: tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [image.startsWith('/') ? `${baseUrl}${image}` : image],
    },
    alternates: {
      canonical: `${baseUrl}/projects/${slug}`,
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  try {
    const { slug } = await params
    const project = getProjectBySlug(slug)

    if (!project) {
      notFound()
    }

    const { frontmatter, content } = project

    const baseUrl = 'https://hunterbastian.com'
    const brandName = 'Hunter Bastian // Studio Alpine'
    const projectUrl = `${baseUrl}/projects/${slug}`
    const imageUrl = frontmatter.image.startsWith('/') ? `${baseUrl}${frontmatter.image}` : frontmatter.image

    // JSON-LD structured data for the project
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: frontmatter.title,
      description: frontmatter.description,
      image: imageUrl,
      datePublished: frontmatter.date,
      dateModified: frontmatter.date,
      author: {
        '@type': 'Person',
        name: brandName,
        url: baseUrl,
      },
      publisher: {
        '@type': 'Person',
        name: brandName,
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': projectUrl,
      },
      keywords: frontmatter.tags?.join(', '),
      articleSection: frontmatter.category,
    }

    return (
      <article className="container mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to case studies
          </Link>
          
          <h1 className="mb-8 text-3xl font-bold sm:text-4xl md:text-5xl">{frontmatter.title}</h1>
        </div>

        {/* Hero Image */}
        <div className="aspect-video relative rounded-xl overflow-hidden mb-12">
          <Image
            src={frontmatter.image}
            alt={frontmatter.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
          />
        </div>

        {/* Project Details */}
        <div className="mb-12 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">Category:</span>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
              {frontmatter.category}
            </span>
          </div>
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">Tags:</span>
              <div className="flex flex-wrap gap-2">
                {frontmatter.tags.map((tag) => (
                  <span key={tag} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Project Links */}
        {(frontmatter.github || frontmatter.demo) && (
          <div className="mb-12 flex flex-wrap gap-4">
            {frontmatter.github && (
              <a
                href={frontmatter.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
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
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Live Demo
              </a>
            )}
          </div>
        )}

        {/* MDX Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <MDXRemote source={content} components={mdxComponents} />
        </div>
      </article>
    )
  } catch (error: unknown) {
    // Safely log the error
    if (error instanceof Error) {
      console.error('Error rendering project page:', error.message)
    } else {
      console.error('Error rendering project page:', String(error))
    }
    
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Project</h1>
        <p className="mt-4">There was an error loading this project. Please try again later.</p>
        <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </div>
    )
  }
}
