'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ProjectFrontmatter } from '@/types/project'

interface ProjectCardProps {
  slug: string
  frontmatter: ProjectFrontmatter
  index: number
}

export default function ProjectCard({ slug, frontmatter, index }: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ 
          y: -8, 
          scale: 1.05,
          transition: { 
            type: "spring", 
            stiffness: 300, 
            damping: 20,
            duration: 0.3
          }
        }}
        whileTap={{ scale: 0.98 }}
        className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-2xl active:shadow-md touch-manipulation"
      >
        <div className="aspect-video relative overflow-hidden">
          {/* Static Image - shown by default */}
          <Image
            src={frontmatter.image}
            alt={frontmatter.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index < 3} // Priority load for first 3 images
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyuw=="
            loading={index < 3 ? "eager" : "lazy"}
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
          
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" />
          
          {/* Tooltip */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-white/20">
              <span className="text-gray-800 font-medium text-sm">View</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="font-semibold uppercase group-hover:text-primary transition-colors duration-300 ease-out" style={{ fontSize: '15px' }}>
            {frontmatter.title}
          </h3>
        </div>
      </motion.div>
    </Link>
  )
}
