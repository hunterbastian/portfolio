'use client'

import { AnimatePresence, motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { CSSProperties, ReactNode, useState } from 'react'

import ResumePreview from './ResumePreview'

const ResumeModal = dynamic(() => import('./ResumeModal'), { ssr: false })

interface AnimatedHomePageProps {
  children: ReactNode
}

interface ExperienceItem {
  year: string
  company: string
  title: string
  description: string
}

interface EducationItem {
  year: string
  institution: string
  degree: string
  level: string
  note?: string
}

interface SkillItem {
  name: string
}

interface CreatingProject {
  name: string
  description: string
  link: string
}

interface ContactLinkItem {
  href: string
  label: string
  gradient: string
  hoverGradient: string
  border: string
  shadow: string
  hoverShadow: string
  icon: ReactNode
  hoverMotion: {
    scale: number
    rotate: number
    y: number
  }
}

const experience: ExperienceItem[] = [
  {
    year: '2024 - Present',
    company: 'Catapult',
    title: 'Video Producer',
    description:
      'Produce and edit marketing videos for Catapult products including banner stands, from planning and filming to post-production in Final Cut Pro. Deliver optimized content for YouTube to support marketing campaigns and ensure alignment with brand standards.'
  },
  {
    year: '2024 - Present',
    company: 'Utah Valley University',
    title: 'Department Representative',
    description:
      'Helped new students with internship opportunities, helping design students in the Web Design and Development program, working on ongoing topics and issues within our department. Responsibilities include finding internship opportunities for students and assisting at school sponsored events, as well as content creation for UVU CET social media and marketing.'
  },
  {
    year: '2023',
    company: 'Nutricost',
    title: 'Graphic Design Intern',
    description:
      'At Nutricost, I assisted the marketing team and strengthened my knowledge as I worked in the graphic design queue. Assisted the marketing team with their design queue and helped with production. Edited product mockups in Photoshop and Illustrator, for Nutricost online product images. Worked on and edited Amazon online product images.'
  },
  {
    year: '2017',
    company: 'Clutch.',
    title: 'Digital Design Intern',
    description:
      'At Clutch, I helped with design branding and further improved my knowledge about the UX design process.'
  }
]

const education: EducationItem[] = [
  {
    year: '2023 - 2027',
    institution: 'Utah Valley University',
    degree: 'Interaction Design',
    level: "Bachelor's Degree"
  },
  {
    year: '2021',
    institution: 'Columbus State Community College',
    degree: 'Graphic Design',
    level: "Associate's Degree",
    note: 'TRANSFERRED TO UVU'
  }
]

const skills: SkillItem[] = [
  { name: 'Figma' },
  { name: 'Framer' },
  { name: 'UX Design' },
  { name: 'UI Design' },
  { name: 'HTML' },
  { name: 'JavaScript' },
  { name: 'CSS' },
  { name: 'ChatGPT' },
  { name: 'AI Models' }
]

const creatingProjects: CreatingProject[] = [
  {
    name: 'Project on Instagram',
    description: 'COMING SOON',
    link: '#'
  },
  {
    name: 'Digital Studio',
    description: 'in the works',
    link: '#'
  }
]

const everydayTech = [
  'iPhone 15 Pro Natural Titanium',
  'MacBook Air 15" M2 Starlight',
  'Apple Trackpad & Logitech G502',
  'AirPods Pro 2',
  'IKEA Desk',
  'Apple Watch',
  'Lego Flowers',
  'Wishlist: Apple Studio Display',
  'Wishlist: Keychron K3'
]

const contactLinks: ContactLinkItem[] = [
  {
    href: 'https://linkedin.com/in/hunterbastian',
    label: 'LinkedIn',
    gradient: 'linear-gradient(180deg, rgba(147, 197, 253, 0.9) 0%, rgba(59, 130, 246, 0.8) 50%, rgba(37, 99, 235, 0.9) 100%)',
    hoverGradient: 'linear-gradient(180deg, rgba(147, 197, 253, 1) 0%, rgba(59, 130, 246, 0.9) 50%, rgba(37, 99, 235, 1) 100%)',
    border: 'rgba(147, 197, 253, 0.6)',
    shadow: '0 4px 16px rgba(37, 99, 235, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(37, 99, 235, 0.5)',
    hoverShadow: '0 6px 20px rgba(37, 99, 235, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 0 -1px 0 rgba(37, 99, 235, 0.7)',
    icon: (
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    hoverMotion: { scale: 1.12, rotate: -2, y: -2 }
  },
  {
    href: 'https://github.com/hunterbastian',
    label: 'GitHub',
    gradient: 'linear-gradient(180deg, rgba(156, 163, 175, 0.9) 0%, rgba(75, 85, 99, 0.8) 50%, rgba(55, 65, 81, 0.9) 100%)',
    hoverGradient: 'linear-gradient(180deg, rgba(156, 163, 175, 1) 0%, rgba(75, 85, 99, 0.9) 50%, rgba(55, 65, 81, 1) 100%)',
    border: 'rgba(156, 163, 175, 0.6)',
    shadow: '0 4px 16px rgba(55, 65, 81, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(55, 65, 81, 0.5)',
    hoverShadow: '0 6px 20px rgba(55, 65, 81, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 0 -1px 0 rgba(55, 65, 81, 0.7)',
    icon: (
      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    hoverMotion: { scale: 1.08, rotate: -1, y: -1 }
  },
  {
    href: 'https://medium.com/@hunterbastian',
    label: 'Medium',
    gradient: 'linear-gradient(180deg, rgba(115, 115, 115, 0.9) 0%, rgba(51, 51, 51, 0.8) 50%, rgba(34, 34, 34, 0.9) 100%)',
    hoverGradient: 'linear-gradient(180deg, rgba(115, 115, 115, 1) 0%, rgba(51, 51, 51, 0.9) 50%, rgba(34, 34, 34, 1) 100%)',
    border: 'rgba(115, 115, 115, 0.6)',
    shadow: '0 4px 16px rgba(34, 34, 34, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(34, 34, 34, 0.5)',
    hoverShadow: '0 6px 20px rgba(34, 34, 34, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 0 -1px 0 rgba(34, 34, 34, 0.7)',
    icon: (
      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
      </svg>
    ),
    hoverMotion: { scale: 1.08, rotate: -1, y: -1 }
  },
  {
    href: 'https://dribbble.com/hunterbastian',
    label: 'Dribbble',
    gradient: 'linear-gradient(180deg, rgba(244, 114, 182, 0.9) 0%, rgba(234, 76, 137, 0.8) 50%, rgba(219, 39, 119, 0.9) 100%)',
    hoverGradient: 'linear-gradient(180deg, rgba(244, 114, 182, 1) 0%, rgba(234, 76, 137, 0.9) 50%, rgba(219, 39, 119, 1) 100%)',
    border: 'rgba(244, 114, 182, 0.6)',
    shadow: '0 4px 16px rgba(219, 39, 119, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(219, 39, 119, 0.5)',
    hoverShadow: '0 6px 20px rgba(219, 39, 119, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 0 -1px 0 rgba(219, 39, 119, 0.7)',
    icon: (
      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.341 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.816zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z" />
      </svg>
    ),
    hoverMotion: { scale: 1.08, rotate: -1, y: -1 }
  }
]

function HeroSection() {
  return (
    <motion.section
      className="py-16 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-2xl mx-auto hero-section relative z-10 px-4 sm:px-6 lg:px-0">
        <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
          <h1
            className="text-black dark:text-white font-playfair italic font-semibold motion-element text-fluid-3xl lg:text-fluid-4xl"
            style={{ lineHeight: '1.2' }}
          >
            Hunter Bastian
          </h1>
          <motion.div
            className="text-gray-600 dark:text-gray-400 font-garamond-narrow mt-4 flex items-center gap-3"
            style={{ fontSize: '14px', letterSpacing: '0.5px' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span>Interaction designer</span>
            <span className="text-gray-400 dark:text-gray-500">|</span>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span>Lehi, UT</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="mb-2 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="space-y-3">
            <p
              className="text-gray-600 dark:text-gray-300 text-sm font-garamond-narrow"
              style={{ lineHeight: '1.6' }}
            >
              Interaction Design student at UVU with experience designing and building digital products. I work in Figma and front-end code, and I&apos;m passionate about creating clean, meaningful user experiences, with an{' '}
              <span 
                className="font-bold" 
                style={{ 
                  color: '#1e3a8a'
                }}
              >
                AI first mindset
              </span>
              .
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

interface HeroContactProps {
  links: ContactLinkItem[]
  showResumePreview: boolean
  onResumeOpen: () => void
  onResumeHover: () => void
  onResumeLeave: () => void
}

function HeroContactSection({ links, showResumePreview, onResumeOpen, onResumeHover, onResumeLeave }: HeroContactProps) {
  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="py-8 px-4 sm:px-6 lg:px-0"
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col gap-4">
          {/* Social Links Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {links.map((link) => (
              <ContactLink key={link.label} link={link} />
            ))}
          </div>
          
          {/* Resume Button Row */}
          <div className="relative">
            <motion.button
              onClick={onResumeOpen}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 font-medium text-xs text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-sm transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-900"
              style={{
                borderColor: '#1e3a8a',
                color: '#1e3a8a'
              }}
              whileHover={{ y: -1 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onMouseEnter={onResumeHover}
              onMouseLeave={onResumeLeave}
              onFocus={onResumeHover}
              onBlur={onResumeLeave}
            >
              <span className="font-light tracking-wide">RESUME</span>
            </motion.button>
            <ResumePreview isVisible={showResumePreview} />
          </div>
        </div>
      </div>
    </motion.section>
  )
}

function CaseStudiesSection({ children }: { children: ReactNode }) {
  return (
    <motion.section
      id="case-studies"
      className="py-16 px-4 sm:px-6 lg:px-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h2 className="font-playfair italic text-left mb-6 sm:mb-8 text-fluid-base lg:text-fluid-xl" style={{ fontWeight: '400' }}>
          Case Studies
        </h2>
      </motion.div>

      {children}

      {/* Archive Button */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-0">
        <motion.div
          className="flex justify-start mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <a
            href="/archive"
            className="text-xs text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors font-light tracking-wide"
          >
            Archive
          </a>
        </motion.div>
      </div>
    </motion.section>
  )
}

function ContactLink({ link }: { link: ContactLinkItem }) {
  return (
    <motion.a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 font-medium text-xs text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-sm transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-gray-900"
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {link.icon}
      <span className="font-light tracking-wide">{link.label}</span>
    </motion.a>
  )
}


interface ExperienceSectionProps {
  experienceItems: ExperienceItem[]
  expandedJobs: Set<number>
  onToggle: (index: number) => void
}

function ExperienceSection({ experienceItems, expandedJobs, onToggle }: ExperienceSectionProps) {
  return (
    <motion.section
      id="experience"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="py-16"
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="font-playfair italic text-left mb-6 sm:mb-8 text-fluid-base lg:text-fluid-xl" style={{ fontWeight: '400' }}>
          Experience
        </h2>

        <div className="rounded-lg p-6 space-y-6" style={{ backgroundColor: 'rgba(222, 220, 219, 0.7)' }}>
          {experienceItems.map((job, index) => {
            const isExpanded = expandedJobs.has(index)

            return (
              <motion.div
                key={job.company}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.05, duration: 0.3 }}
                className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-4 px-3 text-left"
                  onClick={() => onToggle(index)}
                >
                  <div className="flex items-center space-x-8">
                    <span className="text-muted-foreground text-sm font-mono w-12 font-garamond-narrow">{job.year}</span>
                    <span className="font-medium font-garamond-narrow">{job.company}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-muted-foreground text-sm font-garamond-narrow">{job.title}</span>
                    <motion.div animate={{ rotate: isExpanded ? 45 : 0 }} transition={{ duration: 0.2 }} className="w-5 h-5 flex items-center justify-center">
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </motion.div>
                  </div>
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-4 pl-20 pr-4">
                        <p className="text-muted-foreground text-sm leading-relaxed">{job.description}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}

function EducationSection({ educationItems }: { educationItems: EducationItem[] }) {
  return (
    <motion.section
      id="education"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="py-16"
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="font-playfair italic text-left mb-6 sm:mb-8 text-fluid-base lg:text-fluid-xl" style={{ fontWeight: '400' }}>
          Education
        </h2>

        <div className="rounded-lg p-6 space-y-6" style={{ backgroundColor: 'rgba(222, 220, 219, 0.7)' }}>
          {educationItems.map((edu, index) => (
            <motion.div
              key={edu.institution}
              className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-6 last:pb-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1, duration: 0.3 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="text-gray-500 dark:text-gray-400 text-sm font-medium min-w-[100px] font-garamond-narrow">{edu.year}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base mb-1 font-garamond-narrow">{edu.institution}</h3>
                  <p className="text-gray-800 dark:text-gray-200 text-sm mb-1 font-garamond-narrow">{edu.degree}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-garamond-narrow">{edu.level}</p>
                  {edu.note && (
                    <p className="text-gray-500 dark:text-gray-500 text-xs mt-1 font-medium font-garamond-narrow" style={{ opacity: 0.6 }}>
                      {edu.note}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

function CreatingSection({ projects }: { projects: CreatingProject[] }) {
  return (
    <motion.section
      id="creating"
      className="py-16 px-4 sm:px-6 lg:px-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.5 }}
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="font-playfair italic text-left mb-6 sm:mb-8 text-fluid-base lg:text-fluid-xl" style={{ fontWeight: '400' }}>
          Creating
        </h2>

        <motion.ul className="space-y-4 text-left" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.5 }}>
          {projects.map((project, index) => (
            <motion.li
              key={project.name}
              className="flex items-center justify-start gap-3 text-gray-600 dark:text-gray-300 text-sm font-garamond-narrow"
              style={{ lineHeight: '1.6' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 + index * 0.1, duration: 0.3 }}
            >
              <span className="text-gray-400">•</span>
              <span>
                <strong>{project.name}:</strong> {project.description}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.section>
  )
}

function EverydayTechSection({ items }: { items: string[] }) {
  return (
    <motion.section
      id="everyday-tech"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.5 }}
      className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-0"
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="font-playfair italic text-left mb-6 sm:mb-8 text-fluid-base lg:text-fluid-xl" style={{ fontWeight: '400' }}>
          Everyday tech
        </h2>
      </div>
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="flex flex-wrap justify-start gap-x-8 gap-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          {items.map((item, index) => (
            <motion.div
              key={item}
              className="text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 + index * 0.1, duration: 0.3 }}
            >
              <span
                className={`text-sm font-garamond-narrow tracking-wider uppercase font-medium ${
                  item.startsWith('Wishlist:') ? 'text-blue-500 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {item}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

function TechStackSection({ skills: skillItems }: { skills: SkillItem[] }) {
  return (
    <motion.section
      id="tech-stack"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      className="py-16"
      data-animate
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="font-playfair italic text-left mb-8 text-fluid-base lg:text-fluid-xl" style={{ fontWeight: '400' }}>
          Stack
        </h2>
      </div>
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="flex flex-wrap justify-start gap-x-6 gap-y-3 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          {skillItems.map((skill, index) => (
            <motion.div
              key={skill.name}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 + index * 0.1, duration: 0.3 }}
            >
              <span className="text-sm font-garamond-narrow text-gray-700 dark:text-gray-300 tracking-wider uppercase font-medium whitespace-nowrap">
                {skill.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

export default function AnimatedHomePage({ children }: AnimatedHomePageProps) {
  const [showResumePreview, setShowResumePreview] = useState(false)
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [expandedJobs, setExpandedJobs] = useState<Set<number>>(new Set())

  const toggleJob = (index: number) => {
    setExpandedJobs(prev => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  return (
    <div className="container mx-auto max-w-8xl px-4 py-8">
      <HeroSection />
      <HeroContactSection
        links={contactLinks}
        showResumePreview={showResumePreview}
        onResumeOpen={() => setShowResumeModal(true)}
        onResumeHover={() => setShowResumePreview(true)}
        onResumeLeave={() => setShowResumePreview(false)}
      />
      <CaseStudiesSection>{children}</CaseStudiesSection>
      <ExperienceSection experienceItems={experience} expandedJobs={expandedJobs} onToggle={toggleJob} />
      <EducationSection educationItems={education} />
      <CreatingSection projects={creatingProjects} />
      <EverydayTechSection items={everydayTech} />
      <TechStackSection skills={skills} />

      {/* Floating Dinosaur at Bottom */}
      <motion.div
        className="flex justify-center items-center py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          opacity: { delay: 1.8, duration: 0.8, ease: 'easeOut' },
          y: { delay: 1.8, duration: 0.8, ease: 'easeOut' }
        }}
      >
        <iframe
          style={{ width: '130px', height: '130px', backgroundColor: 'transparent', border: 'none' }}
          src="https://app.endlesstools.io/embed/b6f39d54-23c2-429f-a315-4ea4eb90320b"
          title="3D Model"
          allow="clipboard-write; encrypted-media; gyroscope; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </motion.div>

      <ResumeModal isOpen={showResumeModal} onClose={() => setShowResumeModal(false)} />
    </div>
  )
}
