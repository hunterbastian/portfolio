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
    { name: 'UX Design', icon: null, color: 'text-gray-700 dark:text-gray-300', dotColor: 'bg-purple-300 shadow-sm shadow-purple-200', orbColor: '#C4A5E7', hoverRotation: -8 },
    { name: 'UI Design', icon: null, color: 'text-gray-700 dark:text-gray-300', dotColor: 'bg-pink-300 shadow-sm shadow-pink-200', orbColor: '#F7A8C4', hoverRotation: 6 },
    { name: 'HTML', icon: null, color: 'text-gray-700 dark:text-gray-300', dotColor: 'bg-orange-300 shadow-sm shadow-orange-200', orbColor: '#FFB366', hoverRotation: -4 },
    { name: 'JavaScript', icon: null, color: 'text-gray-700 dark:text-gray-300', dotColor: 'bg-yellow-300 shadow-sm shadow-yellow-200', orbColor: '#FFD93D', hoverRotation: 9 },
    { name: 'CSS', icon: null, color: 'text-gray-700 dark:text-gray-300', dotColor: 'bg-blue-300 shadow-sm shadow-blue-200', orbColor: '#93C5FD', hoverRotation: -7 },
    { name: 'React', icon: null, color: 'text-gray-700 dark:text-gray-300', dotColor: 'bg-cyan-300 shadow-sm shadow-cyan-200', orbColor: '#67E8F9', hoverRotation: 5 },
    { name: 'Next.js', icon: null, color: 'text-gray-700 dark:text-gray-300', dotColor: 'bg-gray-300 shadow-sm shadow-gray-200', orbColor: '#D1D5DB', hoverRotation: -6 },
    { name: 'Figma', icon: null, color: 'text-gray-700 dark:text-gray-300', dotColor: 'bg-red-300 shadow-sm shadow-red-200', orbColor: '#FCA5A5', hoverRotation: 8 },
    { name: 'Framer', icon: null, color: 'text-gray-700 dark:text-gray-300', dotColor: 'bg-indigo-300 shadow-sm shadow-indigo-200', orbColor: '#A5B4FC', hoverRotation: -5 }
  ]

  const creatingProjects = [
    {
      name: 'Project Name',
      description: 'Brief description of the project.',
      link: '#'
    },
    {
      name: 'Another Project',
      description: 'Brief description of another project.',
      link: '#'
    },
    {
      name: 'Third Project',
      description: 'Brief description of the third project.',
      link: '#'
    }
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
                 className="mb-8 text-black dark:text-white font-playfair italic max-w-2xl mx-auto text-left"
                 style={{ fontSize: '34px', lineHeight: '1.2' }}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1, duration: 0.5 }}
               >
                 I'm Hunter Bastian, <span className="text-gray-600">an Interaction Designer</span>
               </motion.h1>
               
               <motion.div
                 className="mb-8 max-w-2xl mx-auto text-left"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2, duration: 0.5 }}
               >
                 <p className="text-gray-600 dark:text-gray-300 text-justify" style={{ fontSize: '15px', lineHeight: '1.6' }}>
                   Digital designer and student pursuing a B.S. in Web Design and Development at Utah Valley University with an emphasis in <strong style={{ color: '#EC7063' }}>Interaction Design</strong>. Currently in the position of Utah Valley University <strong style={{ color: '#EC7063' }}>Digital Media Department Representative</strong>. Passionate about creating digital experiences and leading creative teams. Experience designing for mobile and web platforms in Figma, as well as front-end development in React and Next.js.
                 </p>
                              </motion.div>

               {/* Availability Indicator */}
               <motion.div
                 className="mb-8 max-w-2xl mx-auto flex justify-start"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.25, duration: 0.5 }}
               >
                                 <div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, #F0FDF4, #DCFCE7, transparent)`,
                    border: `1px solid #BBF7D0`,
                    boxShadow: `0 2px 8px rgba(34, 197, 94, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2)`
                  }}
                 >
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
                                     <span className="text-gray-600 dark:text-gray-300 font-medium" style={{ fontSize: '12px' }}>
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
                 className="mb-12 max-w-2xl mx-auto"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.5, duration: 0.5 }}
               >
                 <h2 className="font-playfair italic text-left" style={{ fontSize: '24px', fontWeight: '400' }}>Projects</h2>
               </motion.div>

              {children}
    </motion.section>

    {/* Collaborations Section */}
    <motion.section
      id="collaborations"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="py-16"
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="font-playfair italic text-left mb-4" style={{ fontSize: '24px', fontWeight: '400' }}>Collaborations</h2>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 justify-start">
          <motion.a
            href="https://linkedin.com/in/hunterbastian"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-[#0A66C2] relative overflow-hidden"
            style={{
              background: `linear-gradient(90deg, #E3F2FD, #D1E7FF, transparent)`,
              border: `1px solid #BBDEFB`,
              position: 'relative',
              overflow: 'hidden'
            }}
            whileHover={{ 
              scale: 1.08, 
              rotate: -3
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `linear-gradient(90deg, #BBDEFB, #90CAF9, transparent)`;
              e.currentTarget.style.boxShadow = `0 4px 20px rgba(13, 102, 194, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `linear-gradient(90deg, #E3F2FD, #D1E7FF, transparent)`;
              e.currentTarget.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
            }}
          >
            <svg 
              className="w-4 h-4 mr-2" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </motion.a>
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
            Resume
          </a>
        </div>
      </div>
    </motion.section>

    {/* Experience Section */}
    <motion.section
      id="experience"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      className="py-16"
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="font-playfair italic text-left mb-4" style={{ fontSize: '24px', fontWeight: '400' }}>Experience</h2>
      </div>
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

                   {/* Tech Stack Section */}
             <motion.section
               id="tech-stack"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.8, duration: 0.5 }}
               className="py-16"
             >
        <div className="max-w-2xl mx-auto">
          <h2 className="font-playfair italic text-left mb-8" style={{ fontSize: '24px', fontWeight: '400' }}>Stack</h2>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between gap-3 mb-3">
            {skills.slice(0, 5).map((skill, index) => (
              <motion.span
                key={skill.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0 + index * 0.1, duration: 0.3 }}
                className={`${skill.color} px-4 py-2 rounded-full font-medium flex items-center gap-2 relative`}
                style={{
                  background: `linear-gradient(90deg, ${skill.orbColor}30, ${skill.orbColor}15, transparent)`,
                  border: `1px solid ${skill.orbColor}20`,
                  fontSize: '12px'
                }}
              >
                <div className="w-2.5 h-2.5 rounded-full relative" style={{
                  background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.6), ${skill.orbColor} 70%)`,
                  boxShadow: `
                    0 2px 6px rgba(0, 0, 0, 0.15),
                    inset 0 1px 0 rgba(255, 255, 255, 0.4)
                  `
                }}></div>
                {skill.icon}
                {skill.name}
              </motion.span>
            ))}
          </div>
          <div className="flex gap-12">
            {skills.slice(5).map((skill, index) => (
              <motion.span
                key={skill.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0 + (index + 5) * 0.1, duration: 0.3 }}
                className={`${skill.color} px-4 py-2 rounded-full font-medium flex items-center gap-2 relative`}
                style={{
                  background: `linear-gradient(90deg, ${skill.orbColor}30, ${skill.orbColor}15, transparent)`,
                  border: `1px solid ${skill.orbColor}20`,
                  fontSize: '12px'
                }}
              >
                <div className="w-2.5 h-2.5 rounded-full relative" style={{
                  background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.6), ${skill.orbColor} 70%)`,
                  boxShadow: `
                    0 2px 6px rgba(0, 0, 0, 0.15),
                    inset 0 1px 0 rgba(255, 255, 255, 0.4)
                  `
                }}></div>
                {skill.icon}
                {skill.name}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Creating Section */}
      <motion.section 
        id="creating" 
        className="py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="font-playfair italic text-left mb-8" style={{ fontSize: '24px', fontWeight: '400' }}>Creating</h2>
          
          <div className="space-y-6">
            {creatingProjects.map((project, index) => (
              <div key={project.name}>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                  {project.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {project.description}
                </p>
              </div>
            ))}
          </div>
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
              background: '#EC7063',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              border: '1.5px solid rgba(236, 112, 99, 0.6)',
              borderRadius: '20px',
              padding: '14px',
              boxShadow: '0 12px 48px rgba(236, 112, 99, 0.25), 0 3px 12px rgba(236, 112, 99, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 0 0 1px rgba(236, 112, 99, 0.2)',
            }}
            whileHover={{ 
              scale: 1.08,
              background: '#F1948A',
              boxShadow: '0 16px 60px rgba(236, 112, 99, 0.35), 0 4px 16px rgba(236, 112, 99, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 0 0 1px rgba(236, 112, 99, 0.3)',
            }}
            whileTap={{ scale: 0.92 }}
          >
            <motion.svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
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
