'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ProjectFrontmatter } from '@/types/project'
import { useState } from 'react'

interface ProjectCardProps {
  slug: string
  frontmatter: ProjectFrontmatter
  index: number
  isFeatured?: boolean
}

export default function ProjectCard({ slug, frontmatter, index, isFeatured = false }: ProjectCardProps) {
  const [imgSrc, setImgSrc] = useState(frontmatter.image)

  return (
    <Link href={`/projects/${slug}`} className="group block h-full w-full">
      <div
        className={`relative isolate overflow-hidden rounded-[14px] border text-card-foreground transition-transform transition-shadow duration-[550ms] active:scale-[0.995] touch-manipulation ${
          isFeatured
            ? 'shadow-[0_22px_40px_rgba(46,52,64,0.22)] hover:-translate-y-1 hover:shadow-[0_28px_48px_rgba(46,52,64,0.26)]'
            : 'shadow-[0_8px_20px_rgba(46,52,64,0.08)] hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(46,52,64,0.15)]'
        }`}
        style={{
          opacity: 1,
          animationDelay: `${index * 80}ms`,
          borderColor: 'color-mix(in srgb, var(--border) 78%, white)',
          background:
            'linear-gradient(180deg, color-mix(in srgb, var(--card) 84%, white 16%) 0%, color-mix(in srgb, var(--card) 96%, transparent) 100%)',
        }}
      >
        <div className="aspect-[16/9] relative overflow-hidden">
          {/* Static Image - shown by default */}
          <Image
            src={imgSrc}
            alt={frontmatter.title}
            fill
            className="object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-[1.035]"
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
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-[800ms] ease-out"
              autoPlay
              loop
              muted
              playsInline
              preload="none"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/16 opacity-55 transition-opacity duration-[850ms] ease-out group-hover:opacity-68" />
        </div>

        <div className="border-t border-border/30 bg-card/96 px-3.5 pb-3 pt-2.5">
          <h3
            className="font-code font-medium text-foreground transition-colors duration-[700ms] ease-out group-hover:text-primary leading-tight"
            style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase' }}
          >
            {frontmatter.title}
          </h3>
        </div>
      </div>
    </Link>
  )
}
