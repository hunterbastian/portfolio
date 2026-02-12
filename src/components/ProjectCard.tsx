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
    <Link href={`/projects/${slug}`} className="group block h-full w-full">
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
        <div className="aspect-[16/10] relative overflow-hidden">
          {/* Static Image - shown by default */}
          <Image
            src={imgSrc}
            alt={frontmatter.title}
            fill
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            style={{ 
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)'
            }}
            sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) calc((100vw - 5rem) / 2), 280px"
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
          
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/18 opacity-55 transition-opacity duration-[900ms] ease-out group-hover:opacity-70" />
        </div>

        <div className="px-3.5 pb-2.5 pt-2 border-t border-border/30 bg-card/82">
          <h3
            className="font-medium text-foreground transition-colors duration-[700ms] ease-out group-hover:text-primary font-garamond-narrow leading-tight"
            style={{ fontSize: '9.5px', letterSpacing: '0.085em', textTransform: 'uppercase' }}
          >
            {frontmatter.title}
          </h3>
        </div>
      </div>
    </Link>
  )
}
