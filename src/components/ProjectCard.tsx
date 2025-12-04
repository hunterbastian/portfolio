 'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ProjectFrontmatter } from '@/types/project'
import { useState, useRef } from 'react'

interface ProjectCardProps {
  slug: string
  frontmatter: ProjectFrontmatter
  index: number
}

export default function ProjectCard({ slug, frontmatter, index }: ProjectCardProps) {
  const [imgSrc, setImgSrc] = useState(frontmatter.image)
  const cardRef = useRef<HTMLDivElement>(null)
  
  // Motion values for magnetic effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  // Smooth spring animation for the magnetic effect
  const springConfig = { damping: 25, stiffness: 150 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    // Calculate offset from center (limited to small movement)
    const offsetX = (e.clientX - centerX) * 0.08
    const offsetY = (e.clientY - centerY) * 0.08
    
    x.set(offsetX)
    y.set(offsetY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <Link href={`/projects/${slug}`} className="block">
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          type: 'spring', 
          stiffness: 100, 
          damping: 20, 
          mass: 0.8,
          delay: index * 0.08 
        }}
        style={{
          x: xSpring,
          y: ySpring,
        }}
        whileHover={{ 
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
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
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
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out blur-sm group-hover:blur-none"
              autoPlay
              loop
              muted
              playsInline
              preload="none"
            />
          )}
          
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
        </div>
        
        <div className="p-4">
          <h3 className="font-medium tracking-wider group-hover:text-primary transition-all duration-500 ease-out font-garamond-narrow" style={{ fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {frontmatter.title}
          </h3>
        </div>
      </motion.div>
    </Link>
  )
}
