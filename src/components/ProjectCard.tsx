 'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
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
    <Link href={`/projects/${slug}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          type: 'spring', 
          stiffness: 100, 
          damping: 20, 
          mass: 0.8,
          delay: index * 0.08 
        }}
        whileHover={{ 
          y: -6, 
          scale: 1.02,
          transition: { 
            type: 'spring', 
            stiffness: 80, 
            damping: 25,
            mass: 1.2,
            duration: 0.6
          }
        }}
        whileTap={{ 
          scale: 0.98,
          transition: { duration: 0.1 }
        }}
        className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-2xl active:shadow-md touch-manipulation"
      >
        <div className="aspect-video relative overflow-hidden">
          {/* Static Image - shown by default */}
          <Image
            src={imgSrc}
            alt={frontmatter.title}
            fill
            className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
            style={{ 
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
              willChange: 'transform'
            }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index < 3} // Priority load for first 3 images
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyuw=="
            loading={index < 3 ? "eager" : "lazy"}
            onError={() => setImgSrc('/images/placeholder.svg')}
          />
          
          {/* Video overlay - shown on hover for Porsche App only */}
          {frontmatter.title === "Porsche App" && (
            <video
              src="/images/projects/porscheapp.mp4"
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out blur-sm group-hover:blur-none"
              autoPlay
              loop
              muted
              playsInline
            />
          )}
          
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
        </div>
        
        <div className="p-5 space-y-3">
          <div>
            <h3 className="font-medium tracking-wider group-hover:text-primary transition-all duration-500 ease-out font-garamond-narrow mb-2" style={{ fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {frontmatter.title}
            </h3>
            {frontmatter.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 font-garamond-narrow line-clamp-2" style={{ fontSize: '12px', lineHeight: '1.5' }}>
                {frontmatter.description}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            {frontmatter.category && (
              <span className="text-xs text-gray-500 dark:text-gray-500 font-light tracking-wide">
                {frontmatter.category}
              </span>
            )}
            {frontmatter.tags && frontmatter.tags.length > 0 && (
              <span className="text-xs text-gray-400 dark:text-gray-600">
                {frontmatter.tags.slice(0, 2).join(' • ')}
                {frontmatter.tags.length > 2 && ' • ...'}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
