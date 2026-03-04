'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ProjectFrontmatter } from '@/types/project'

interface ProjectCardProps {
  slug: string
  frontmatter: ProjectFrontmatter
  index: number
}

export default function ProjectCard({ slug, frontmatter, index }: ProjectCardProps) {
  const [imgSrc, setImgSrc] = useState(frontmatter.image)
  const displayTitle = frontmatter.displayTitle ?? frontmatter.title

  return (
    <Link href={`/projects/${slug}`} className="group block h-full w-full">
      <div
        className="relative isolate overflow-hidden rounded-md border text-card-foreground transition-all duration-300 active:scale-[0.998] touch-manipulation shadow-sm hover:-translate-y-0.5 hover:shadow-md"
        style={{
          animationDelay: `${index * 80}ms`,
          borderColor: 'var(--border)',
          background: 'var(--card)',
        }}
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={imgSrc}
            alt={frontmatter.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.015]"
            style={{
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) calc((100vw - 5rem) / 2), 280px"
            priority={index === 0}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyuw=="
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'low'}
            onError={() => setImgSrc('/images/placeholder.svg')}
          />

          {frontmatter.video && (
            <video
              src={frontmatter.video}
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[800ms] ease-out group-hover:opacity-100"
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
            className="block w-full truncate whitespace-nowrap font-medium leading-tight text-foreground transition-colors duration-300 group-hover:text-foreground/80"
            style={{ fontSize: '13px' }}
            title={displayTitle}
          >
            {displayTitle}
          </h3>
        </div>
      </div>
    </Link>
  )
}
