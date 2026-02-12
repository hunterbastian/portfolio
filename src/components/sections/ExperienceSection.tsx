'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const experience = [
  {
    year: '2026 - Present',
    company: 'studio alpine',
    title: 'Founder',
    description: "Founder of studio alpine. I am at the front of a visionary studio that involves photography and design. I'm excited to see where this will go into the future."
  },
  {
    year: '2024 - Present',
    company: 'catapult',
    title: 'Video Producer',
    description: 'Produce and edit marketing videos for catapult products including banner stands, from planning and filming to post-production in Final Cut Pro. Deliver optimized content for YouTube to support marketing campaigns and ensure alignment with brand standards.'
  },
  {
    year: '2024 - Present',
    company: 'utah valley university',
    title: 'Department Representative',
    description: 'Helped new students with internship opportunities, helping design students in the Web Design and Development program, working on ongoing topics and issues within our department. Responsibilities include finding internship opportunities for students and assisting at school sponsored events, as well as content creation for UVU CET social media and marketing.'
  },
  {
    year: '2023',
    company: 'nutricost',
    title: 'Graphic Design Intern',
    description: 'At nutricost, I assisted the marketing team and strengthened my knowledge as I worked in the graphic design queue. Assisted the marketing team with their design queue and helped with production. Edited product mockups in Photoshop and Illustrator, for nutricost online product images. Worked on and edited Amazon online product images.'
  },
  {
    year: '2017',
    company: 'clutch.',
    title: 'Digital Design Intern',
    description: 'At clutch, I helped with design branding and further improved my knowledge about the UX design process.'
  }
]

export default function ExperienceSection() {
  const [expandedJobs, setExpandedJobs] = useState<Set<number>>(new Set())

  const toggleJob = (index: number) => {
    setExpandedJobs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  return (
    <motion.section
      id="experience"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="py-16"
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="font-playfair italic text-center mb-6 sm:mb-8 text-fluid-lg lg:text-fluid-2xl" style={{ fontWeight: '400' }}>Experience</h2>
        
        <div className="rounded-lg p-6 space-y-6" style={{ backgroundColor: 'rgba(222, 220, 219, 0.7)' }}>
          {experience.map((job, index) => {
            const isExpanded = expandedJobs.has(index)
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.05, duration: 0.3 }}
                className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
              >
                <div 
                  className="flex items-center justify-between py-4 px-3 cursor-pointer"
                  onClick={() => toggleJob(index)}
                >
                  <div className="flex items-center space-x-8">
                    <span className="text-muted-foreground text-sm font-mono w-12 font-garamond-narrow">
                      {job.year}
                    </span>
                    <span className="font-medium font-garamond-narrow">
                      {job.company}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-muted-foreground text-sm font-garamond-narrow">
                      {job.title}
                    </span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-5 h-5 flex items-center justify-center"
                    >
                      <svg
                        className="w-4 h-4 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </motion.div>
                  </div>
                </div>
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
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {job.description}
                        </p>
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
