'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode, useState, useEffect } from 'react'

interface AnimatedHomePageProps {
  children: ReactNode
}

const experience = [
  {
    year: '2024 - Present',
    company: 'Catapult',
    title: 'Video Producer',
    description: 'Description coming soon.'
  },
  {
    year: '2024 - Present',
    company: 'Utah Valley University',
    title: 'Department Representative',
    description: 'Helped new students with internship opportunities, helping design students in the Web Design and Development program, working on ongoing topics and issues within our department. Responsibilities include finding internship opportunities for students and assisting at school sponsored events, as well as content creation for UVU CET social media and marketing.'
  },
  {
    year: '2023',
    company: 'Nutricost',
    title: 'Graphic Design Intern',
    description: 'At Nutricost, I assisted the marketing team and strengthened my knowledge as I worked in the graphic design queue. Assisted the marketing team with their design queue and helped with production. Edited product mockups in Photoshop and Illustrator, for Nutricost online product images. Worked on and edited Amazon online product images.'
  },
  {
    year: '2017',
    company: 'Clutch.',
    title: 'Digital Design Intern',
    description: 'At Clutch, I helped with design branding and further improved my knowledge about the UX design process.'
  }
]

const skills = [
  { name: 'UX Design', icon: null },
  { name: 'UI Design', icon: null },
  { name: 'HTML', icon: null },
  { name: 'JavaScript', icon: null },
  { name: 'CSS', icon: null },
  { name: 'React', icon: null },
  { name: 'Next.js', icon: null },
  { name: 'Figma', icon: null },
  { name: 'Framer', icon: null }
]

export default function AnimatedHomePage({ children }: AnimatedHomePageProps) {
  const [expandedJobs, setExpandedJobs] = useState<Set<number>>(new Set())
  const [showBackToTop, setShowBackToTop] = useState(false)

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

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Hero Section */}
      <motion.section 
        className="text-center py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
                                      <motion.h1
                 className="font-bold mb-8 text-black dark:text-white"
                 style={{ fontSize: '16px', lineHeight: '1.2' }}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1, duration: 0.5 }}
               >
                 HUNTER BASTIAN
               </motion.h1>
               
               <motion.div
                 className="mb-8 max-w-2xl mx-auto text-left"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2, duration: 0.5 }}
               >
                 <p className="text-gray-600 dark:text-gray-300 text-justify" style={{ fontSize: '15px', lineHeight: '1.6' }}>
                   Digital designer and student pursuing a B.S. in Web Design and Development at Utah Valley University with an emphasis in <strong>Interaction Design</strong>. Currently in the position of Utah Valley University <strong>Digital Media Department Representative</strong>. Passionate about creating digital experiences and leading creative teams. Experience designing for mobile and web platforms in Figma, as well as front-end development in React and Next.js.
                 </p>
               </motion.div>

               {/* Availability Indicator */}
               <motion.div
                 className="mb-8 max-w-2xl mx-auto flex justify-center"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.25, duration: 0.5 }}
               >
                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full shadow-lg shadow-green-100/50 dark:shadow-green-900/20">
                   <div className="relative flex items-center justify-center">
                     <motion.div 
                       className="absolute w-1.5 h-1.5 bg-green-400 rounded-full z-0"
                       animate={{
                         scale: [1.3, 3.2, 3.2, 3.2],
                         opacity: [0.6, 0.2, 0, 0, 0]
                       }}
                       transition={{
                         duration: 3,
                         repeat: Infinity,
                         ease: [0.4, 0.0, 0.2, 1],
                         repeatDelay: 0
                       }}
                     ></motion.div>
                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full relative z-20"></div>
                   </div>
                   <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                     Accepting clients
                   </span>
                 </div>
               </motion.div>

                                             <motion.div
                className="flex flex-col sm:flex-row justify-between gap-4 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                 <a
                   href="#projects"
                   className="inline-flex items-center justify-center rounded-md border border-input bg-gray-50 px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                 >
                   Projects
                 </a>
                 <a
                   href="#experience"
                   className="inline-flex items-center justify-center rounded-md border border-input bg-gray-50 px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                 >
                   Experience
                 </a>
                 <a
                   href="#collaborations"
                   className="inline-flex items-center justify-center rounded-md border border-input bg-gray-50 px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                 >
                   Collaborations
                 </a>
                 <a
                   href="#tech-stack"
                   className="inline-flex items-center justify-center rounded-md border border-input bg-gray-50 px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                 >
                   Stack
                 </a>
               </motion.div>
      </motion.section>

      {/* Projects Section */}
      <motion.section 
        id="projects" 
        className="py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
                       <motion.div
                 className="text-center mb-12"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.5, duration: 0.5 }}
               >
                 <h2 className="font-bold mb-4 font-inter" style={{ fontSize: '26px' }}>Projects</h2>
               </motion.div>

              {children}
    </motion.section>

    {/* Experience Section */}
    <motion.section
      id="experience"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="py-16"
    >
                     <h2 className="font-bold mb-4 font-inter text-center" style={{ fontSize: '26px' }}>Experience</h2>
      <div className="space-y-6 max-w-2xl mx-auto">
        {experience.map((job, index) => {
          const isExpanded = expandedJobs.has(index)
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.05, duration: 0.3 }}
              className="border-b border-gray-200 dark:border-gray-700"
            >
              <div 
                className="flex items-center justify-between py-4 cursor-pointer"
                onClick={() => toggleJob(index)}
              >
                <div className="flex items-center space-x-8">
                  <span className="text-muted-foreground text-sm font-mono w-12">
                    {job.year}
                  </span>
                  <span className="font-medium">
                    {job.company}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-muted-foreground text-sm">
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
    </motion.section>

                 {/* Collaborations Section */}
             <motion.section
               id="collaborations"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.8, duration: 0.5 }}
               className="py-16 text-center"
             >
               <h2 className="font-bold mb-4 font-inter" style={{ fontSize: '26px' }}>Collaborations</h2>
        
        {/* LinkedIn Button */}
        <div className="mb-8">
          <a
            href="https://linkedin.com/in/hunterbastian"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-[#E3F2FD] text-[#0A66C2] border border-[#BBDEFB] hover:bg-[#D1E7FF] hover:border-[#90CAF9]"
          >
            LinkedIn
          </a>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                           <a
                   href="mailto:hello@hunterbastian.com"
                   className="inline-flex items-center justify-center rounded-md border border-input bg-gray-50 px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                 >
                   Contact
                 </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md border border-input bg-gray-50 px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            View Resume
          </a>
        </div>
      </motion.section>

                   {/* Tech Stack Section */}
             <motion.section
               id="tech-stack"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.9, duration: 0.5 }}
               className="py-16"
             >
        <h2 className="font-bold mb-4 font-inter text-center" style={{ fontSize: '26px' }}>Tech Stack</h2>
        <div className="flex flex-wrap gap-3 justify-center max-w-2xl mx-auto">
          {skills.map((skill, index) => (
            <motion.span
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0 + index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium flex items-center"
            >
              {skill.icon}
              {skill.name}
            </motion.span>
          ))}
        </div>
      </motion.section>

      {/* Vision Pro Style Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 group"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              border: '1.5px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '24px',
              padding: '18px',
              boxShadow: '0 16px 64px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 0 0 1px rgba(0, 0, 0, 0.1)',
            }}
            whileHover={{ 
              scale: 1.08,
              background: 'rgba(255, 255, 255, 0.22)',
              boxShadow: '0 20px 80px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 0 0 1px rgba(0, 0, 0, 0.15)',
            }}
            whileTap={{ scale: 0.92 }}
          >
            <motion.svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-800 dark:text-white"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))' }}
              animate={{ y: [0, -2, 0] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <path d="m18 15-6-6-6 6"/>
            </motion.svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
