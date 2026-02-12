'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ProjectFrontmatter } from '@/types/project'
import { useState } from 'react'

interface ProjectCardProps {
  slug: string
  frontmatter: ProjectFrontmatter
  index: number
}

export default function ProjectCard({ slug, frontmatter, index }: ProjectCardProps) {
  const [imgSrc, setImgSrc] = useState(frontmatter.image)

  return (
    <Link href={`/projects/${slug}`} className="group block">
      <div
        className="relative isolate overflow-hidden rounded-[20px] border text-card-foreground shadow-[0_10px_30px_rgba(46,52,64,0.08)] transition-transform transition-shadow duration-[650ms] hover:-translate-y-0.5 hover:shadow-[0_20px_36px_rgba(46,52,64,0.14)] active:scale-[0.99] touch-manipulation"
        style={{
          opacity: 1,
          animationDelay: `${index * 80}ms`,
          borderColor: 'color-mix(in srgb, var(--border) 82%, white)',
          background:
            'linear-gradient(165deg, color-mix(in srgb, var(--card) 86%, white 14%) 0%, color-mix(in srgb, var(--card) 92%, transparent) 100%)',
        }}
      >
        <div className="aspect-[4/3] relative overflow-hidden">
          {/* Static Image - shown by default */}
          <Image
            src={imgSrc}
            alt={frontmatter.title}
            fill
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            style={{ 
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)'
            }}
            sizes="(max-width: 640px) 88vw, (max-width: 1024px) 44vw, 280px"
            priority={index === 0} // Only priority load first image
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyuw=="
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "low"}
            onError={() => setImgSrc('/images/placeholder.svg')}
          />
          
          {/* Video overlay - shown on hover for Porsche App only - Lazy loaded */}
          {frontmatter.title === "Porsche App" && (
            <video
              src="/images/projects/porscheapp.mp4"
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-[900ms] ease-out"
              autoPlay
              loop
              muted
              playsInline
              preload="none"
            />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/22 opacity-70 transition-opacity duration-[900ms] ease-out group-hover:opacity-85" />

          <div
            className="absolute inset-x-0 bottom-0 px-5 pb-4 pt-7 backdrop-blur-[10px] supports-[backdrop-filter]:backdrop-saturate-150"
            style={{
              background:
                'linear-gradient(180deg, color-mix(in srgb, var(--card) 2%, transparent) 0%, color-mix(in srgb, var(--card) 82%, white 18%) 56%, color-mix(in srgb, var(--card) 90%, white 10%) 100%)',
            }}
          >
            <h3
              className="font-medium text-foreground transition-colors duration-[700ms] ease-out group-hover:text-primary font-garamond-narrow"
              style={{ fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              {frontmatter.title}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  )
}
