'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode, useState, useEffect } from 'react'
import Image from 'next/image'

import ResumePreview from './ResumePreview'
import ResumeModal from './ResumeModal'

// Lazy load components that are below the fold
// Note: Sections are now implemented directly in this component

interface AnimatedHomePageProps {
  children: ReactNode
}

const experience = [
  {
    year: '2024 - Present',
    company: 'Catapult',
    title: 'Video Producer',
    description: 'Produce and edit marketing videos for Catapult products including banner stands, from planning and filming to post-production in Final Cut Pro. Deliver optimized content for YouTube to support marketing campaigns and ensure alignment with brand standards.'
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

const education = [
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

  const skills = [
    { name: 'Figma', icon: null, color: 'text-gray-700 dark:text-gray-300', dotColor: 'bg-red-300 shadow-sm shadow-red-200', orbColor: '#FCA5A5', hoverRotation: 8 },
    { name: 'Framer', icon: null, color: 'text-gray-700 dark:text-gray-300', dotColor: 'bg-indigo-300 shadow-sm shadow-indigo-200', orbColor: '#A5B4FC', hoverRotation: -5 },
    { name: 'UX Design', icon: null, color: 'text-gray-700 dark:text-gray-300', dotColor: 'bg-purple-300 shadow-sm shadow-purple-200', orbColor: '#C4A5E7', hoverRotation: -8 },
    { name: 'UI Design', icon: null, color: 'text-gray-700 dark:text-gray-300', dotColor: 'bg-pink-300 shadow-sm shadow-pink-200', orbColor: '#F7A8C4', hoverRotation: 6 },
    { name: 'HTML', icon: null, color: 'text-gray-700 dark:text-gray-300', dotColor: 'bg-orange-300 shadow-sm shadow-orange-200', orbColor: '#FFB366', hoverRotation: -4 },
    { name: 'JavaScript', icon: null, color: 'text-gray-700 dark:text-gray-300', dotColor: 'bg-yellow-300 shadow-sm shadow-yellow-200', orbColor: '#FFD93D', hoverRotation: 9 },
    { name: 'CSS', icon: null, color: 'text-gray-700 dark:text-gray-300', dotColor: 'bg-blue-300 shadow-sm shadow-blue-200', orbColor: '#93C5FD', hoverRotation: -7 },
    { name: 'AI Models', icon: null, color: 'text-gray-700 dark:text-gray-300', dotColor: 'bg-violet-300 shadow-sm shadow-violet-200', orbColor: '#A78BFA', hoverRotation: 4 }
  ]

  const creatingProjects = [
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

export default function AnimatedHomePage({ children }: AnimatedHomePageProps) {
  const [showResumePreview, setShowResumePreview] = useState(false)
  const [showResumeModal, setShowResumeModal] = useState(false)
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
    <div className="container mx-auto max-w-8xl px-4 py-8">
      {/* Hero Section */}
      <motion.section 
        className="py-16 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-2xl mx-auto hero-section relative z-10 px-4 sm:px-6 lg:px-0 text-center">

                {/* 3D Object above title */}
                <motion.div
                  className="flex justify-center items-center mb-8 mx-auto"
                  initial={{ opacity: 0, y: -30, rotate: -15 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    rotate: 0
                  }}
                  transition={{ 
                    opacity: { delay: 0.3, duration: 0.8, ease: "easeOut" },
                    y: { delay: 0.3, duration: 0.8, ease: "easeOut" },
                    rotate: { delay: 0.3, duration: 0.8, ease: "easeOut" }
                  }}
                  style={{
                    width: 'fit-content',
                    margin: '0 auto'
                  }}
                >
                  <iframe
                    style={{ 
                      width: '130px', 
                      height: '130px', 
                      backgroundColor: 'transparent',
                      border: 'none'
                    }}
                    src="https://app.endlesstools.io/embed/b6f39d54-23c2-429f-a315-4ea4eb90320b"
                    title="3D Model"
                    allow="clipboard-write; encrypted-media; gyroscope; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </motion.div>

                <motion.div
                 className="mb-6"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1, duration: 0.5 }}
               >
                 <h1 className="text-black dark:text-white font-playfair italic font-semibold text-center motion-element text-fluid-3xl lg:text-fluid-4xl" style={{ lineHeight: '1.2' }}>
                   Hunter Bastian
                 </h1>
                 <motion.p
                   className="text-gray-600 dark:text-gray-400 text-center font-garamond-narrow mt-2"
                   style={{ fontSize: '14px', letterSpacing: '0.5px' }}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2, duration: 0.5 }}
                 >
                   Interaction designer
                 </motion.p>

               </motion.div>
               
               <motion.div
                 className="mb-4 text-center flex items-center justify-center gap-2"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.15, duration: 0.5 }}
               >
                 <svg 
                   className="w-4 h-4 text-gray-500 dark:text-gray-400" 
                   fill="currentColor" 
                   viewBox="0 0 24 24"
                 >
                   <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                 </svg>
                 <span className="text-gray-500 dark:text-gray-400 font-garamond-narrow" style={{ fontSize: '14px' }}>
                   Lehi, UT
                 </span>
               </motion.div>

               
                                                            <motion.div
                className="mb-2 text-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="space-y-3">
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-garamond-narrow" style={{ lineHeight: '1.6' }}>
                    <span className="text-gray-800 dark:text-gray-200">Undergraduate at Utah Valley University</span> pursuing a <strong className="text-gray-800 dark:text-gray-200">B.S. in Web Design and Development</strong> with an emphasis in <strong className="text-gray-800 dark:text-gray-200">Interaction Design</strong>. Currently serving as the <em className="text-gray-700 dark:text-gray-300">Digital Media Department Representative</em>, I am passionate about creating meaningful digital experiences. My background blends design and development.
                  </p>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-garamond-narrow" style={{ lineHeight: '1.6' }}>
                    I have experience designing for <strong className="text-gray-800 dark:text-gray-200">mobile and web platforms in Figma</strong>, alongside front-end development skills in <span className="text-gray-800 dark:text-gray-200">HTML, CSS, JavaScript</span> with <strong className="text-red-500 dark:text-red-400 font-bold" style={{ color: '#FF3B30', textShadow: '0 0 8px rgba(255, 59, 48, 0.4)' }}>AI first enthusiasm</strong>.
                  </p>
                </div>
              </motion.div>

              

 
 
 
        </div>
      </motion.section>

      {/* Case Studies Section */}
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
                <h2 className="font-playfair italic text-center mb-6 sm:mb-8 text-fluid-lg lg:text-fluid-2xl" style={{ fontWeight: '400' }}>Case Studies</h2>
              </motion.div>

             {children}
   </motion.section>

   

   {/* Contact Section */}
   <motion.section
     id="contact"
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ delay: 0.4, duration: 0.5 }}
     className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-0 relative"
   >


     <div className="max-w-2xl mx-auto">
       <h2 className="font-playfair italic text-center mb-6 sm:mb-8 text-fluid-lg lg:text-fluid-2xl" style={{ fontWeight: '400' }}>Contact</h2>
     </div>

     

     <div className="max-w-2xl mx-auto">
               <div className="grid grid-cols-2 sm:flex sm:flex-row gap-4 sm:gap-4 justify-center items-center sm:items-center">
         <motion.a
           href="https://linkedin.com/in/hunterbastian"
           target="_blank"
           rel="noopener noreferrer"
           className="inline-flex items-center justify-center rounded-md w-full sm:w-10 h-12 sm:h-10 px-4 sm:px-0 gap-2 sm:gap-0 font-medium shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-[#0A66C2] relative overflow-hidden touch-manipulation"
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
           whileTap={{ scale: 0.95 }}
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
             className="w-5 h-5 flex-shrink-0" 
             viewBox="0 0 24 24" 
             fill="currentColor"
           >
             <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
           </svg>
           <span className="text-xs sm:hidden font-medium">LinkedIn</span>
         </motion.a>
         <motion.a
           href="https://github.com/hunterbastian"
           target="_blank"
           rel="noopener noreferrer"
           className="inline-flex items-center justify-center rounded-md w-full sm:w-10 h-12 sm:h-10 px-4 sm:px-0 gap-2 sm:gap-0 font-medium shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-[#333] relative overflow-hidden touch-manipulation"
           style={{
             background: `linear-gradient(90deg, #f6f8fa, #e1e4e8, transparent)`,
             border: `1px solid #d0d7de`,
             position: 'relative',
             overflow: 'hidden'
           }}
           whileHover={{ 
             scale: 1.08, 
             rotate: -3
           }}
           whileTap={{ scale: 0.95 }}
           transition={{ duration: 0.2, ease: "easeOut" }}
           onMouseEnter={(e) => {
             e.currentTarget.style.background = `linear-gradient(90deg, #e1e4e8, #d0d7de, transparent)`;
             e.currentTarget.style.boxShadow = `0 4px 20px rgba(51, 51, 51, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)`;
           }}
           onMouseLeave={(e) => {
             e.currentTarget.style.background = `linear-gradient(90deg, #f6f8fa, #e1e4e8, transparent)`;
             e.currentTarget.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
           }}
         >
           <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
             <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
           </svg>
           <span className="text-xs sm:hidden font-medium">GitHub</span>
         </motion.a>
         <motion.a
           href="https://medium.com/@hunterbastian"
           target="_blank"
           rel="noopener noreferrer"
           className="inline-flex items-center justify-center rounded-md w-full sm:w-10 h-12 sm:h-10 px-4 sm:px-0 gap-2 sm:gap-0 font-medium shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-[#000] relative overflow-hidden touch-manipulation"
           style={{
             background: `linear-gradient(90deg, #f8f9fa, #e9ecef, transparent)`,
             border: `1px solid #dee2e6`,
             position: 'relative',
             overflow: 'hidden'
           }}
           whileHover={{ 
             scale: 1.08, 
             rotate: -3
           }}
           whileTap={{ scale: 0.95 }}
           transition={{ duration: 0.2, ease: "easeOut" }}
           onMouseEnter={(e) => {
             e.currentTarget.style.background = `linear-gradient(90deg, #e9ecef, #dee2e6, transparent)`;
             e.currentTarget.style.boxShadow = `0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)`;
           }}
           onMouseLeave={(e) => {
             e.currentTarget.style.background = `linear-gradient(90deg, #f8f9fa, #e9ecef, transparent)`;
             e.currentTarget.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
           }}
         >
           <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
             <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
           </svg>
           <span className="text-xs sm:hidden font-medium">Medium</span>
         </motion.a>
         <motion.a
           href="https://dribbble.com/hunterbastian"
           target="_blank"
           rel="noopener noreferrer"
           className="inline-flex items-center justify-center rounded-md w-full sm:w-10 h-12 sm:h-10 px-4 sm:px-0 gap-2 sm:gap-0 font-medium shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-[#ea4c89] relative overflow-hidden touch-manipulation"
           style={{
             background: `linear-gradient(90deg, #fdf2f8, #fce7f3, transparent)`,
             border: `1px solid #f9a8d4`,
             position: 'relative',
             overflow: 'hidden'
           }}
           whileHover={{ 
             scale: 1.08, 
             rotate: -3
           }}
           whileTap={{ scale: 0.95 }}
           transition={{ duration: 0.2, ease: "easeOut" }}
           onMouseEnter={(e) => {
             e.currentTarget.style.background = `linear-gradient(90deg, #fce7f3, #f9a8d4, transparent)`;
             e.currentTarget.style.boxShadow = `0 4px 20px rgba(234, 76, 137, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)`;
           }}
           onMouseLeave={(e) => {
             e.currentTarget.style.background = `linear-gradient(90deg, #fdf2f8, #fce7f3, transparent)`;
             e.currentTarget.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
           }}
         >
           <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
             <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.341 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.816zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z"/>
           </svg>
           <span className="text-xs sm:hidden font-medium">Dribbble</span>
         </motion.a>
                 <div className="relative">
          <motion.button
            onClick={() => setShowResumeModal(true)}
            className="inline-flex items-center justify-center rounded-md px-5 py-2.5 font-medium shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring whitespace-nowrap relative overflow-hidden cursor-pointer"
            style={{
              background: `linear-gradient(90deg, #F8FAFC, #E2E8F0, transparent)`,
              border: `1px solid #CBD5E1`,
              color: '#475569',
              fontSize: '10px'
            }}
            whileHover={{ 
              scale: 1.08, 
              rotate: -3
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `linear-gradient(90deg, #CBD5E1, #94A3B8, transparent)`;
              e.currentTarget.style.boxShadow = `0 4px 20px rgba(71, 85, 105, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)`;
              setShowResumePreview(true);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `linear-gradient(90deg, #F8FAFC, #E2E8F0, transparent)`;
              e.currentTarget.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
              setShowResumePreview(false);
            }}
          >
            VIEW RESUME
          </motion.button>
          <ResumePreview isVisible={showResumePreview} />
        </div>
      </div>
    </div>


  </motion.section>

       {/* Experience Section */}
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

   {/* Education Section */}
   <motion.section
      id="education"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="py-16"
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="font-playfair italic text-center mb-6 sm:mb-8 text-fluid-lg lg:text-fluid-2xl" style={{ fontWeight: '400' }}>Education</h2>
        
        <div className="rounded-lg p-6 space-y-6" style={{ backgroundColor: 'rgba(222, 220, 219, 0.7)' }}>
          {education.map((edu, index) => (
            <motion.div
              key={index}
              className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-6 last:pb-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1, duration: 0.3 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="text-gray-500 dark:text-gray-400 text-sm font-medium min-w-[100px] font-garamond-narrow">
                  {edu.year}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base mb-1 font-garamond-narrow">
                    {edu.institution}
                  </h3>
                  <p className="text-gray-800 dark:text-gray-200 text-sm mb-1 font-garamond-narrow">
                    {edu.degree}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-garamond-narrow">
                    {edu.level}
                  </p>
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


      {/* Creating Section */}
      <motion.section 
        id="creating" 
        className="py-16 px-4 sm:px-6 lg:px-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.5 }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="font-playfair italic text-center mb-6 sm:mb-8 text-fluid-lg lg:text-fluid-2xl" style={{ fontWeight: '400' }}>Creating</h2>
          
          <motion.ul 
            className="space-y-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            {creatingProjects.map((project, index) => (
              <motion.li 
                key={project.name}
                className="flex items-center justify-center gap-3 text-gray-600 dark:text-gray-300 text-sm font-garamond-narrow"
                style={{ lineHeight: '1.6' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + index * 0.1, duration: 0.3 }}
              >
                <span className="text-gray-400">•</span>
                <span><strong>{project.name}:</strong> {project.description}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </motion.section>

      {/* Everyday Tech Section */}
      <motion.section
        id="everyday-tech"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-0"
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="font-playfair italic text-center mb-6 sm:mb-8 text-fluid-lg lg:text-fluid-2xl" style={{ fontWeight: '400' }}>Everyday tech</h2>
        </div>
        <div className="max-w-2xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.5 }}
          >
            <motion.div 
              className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg p-3 border border-gray-200/30 dark:border-gray-700/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.3 }}
            >
              <div className="text-xs text-gray-500 dark:text-gray-400 font-garamond-narrow mb-1">Phone</div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-200 font-garamond-narrow">iPhone 15 Pro Natural Titanium</div>
            </motion.div>
            
            <motion.div 
              className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg p-3 border border-gray-200/30 dark:border-gray-700/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.3 }}
            >
              <div className="text-xs text-gray-500 dark:text-gray-400 font-garamond-narrow mb-1">Laptop</div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-200 font-garamond-narrow">MacBook Air 15&quot; M2 Starlight</div>
            </motion.div>

            <motion.div 
              className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg p-3 border border-gray-200/30 dark:border-gray-700/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.3 }}
            >
              <div className="text-xs text-gray-500 dark:text-gray-400 font-garamond-narrow mb-1">Mouse</div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-200 font-garamond-narrow">Apple Trackpad & Logitech G502</div>
            </motion.div>
            
            <motion.div 
              className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg p-3 border border-gray-200/30 dark:border-gray-700/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.3 }}
            >
              <div className="text-xs text-gray-500 dark:text-gray-400 font-garamond-narrow mb-1">Headphones</div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-200 font-garamond-narrow">AirPods Pro 2</div>
            </motion.div>

            <motion.div 
              className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg p-3 border border-gray-200/30 dark:border-gray-700/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9, duration: 0.3 }}
            >
              <div className="text-xs text-gray-500 dark:text-gray-400 font-garamond-narrow mb-1">Desk</div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-200 font-garamond-narrow">IKEA</div>
            </motion.div>
            
            <motion.div 
              className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg p-3 border border-gray-200/30 dark:border-gray-700/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0, duration: 0.3 }}
            >
              <div className="text-xs text-gray-500 dark:text-gray-400 font-garamond-narrow mb-1">Watch</div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-200 font-garamond-narrow">Apple Watch</div>
            </motion.div>

            <motion.div 
              className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg p-3 border border-gray-200/30 dark:border-gray-700/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.1, duration: 0.3 }}
            >
              <div className="text-xs text-gray-500 dark:text-gray-400 font-garamond-narrow mb-1">Decoration</div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-200 font-garamond-narrow">Lego Flowers</div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-r from-blue-25 to-purple-25 dark:from-blue-900/10 dark:to-purple-900/10 backdrop-blur-sm rounded-lg p-3 border border-blue-100/30 dark:border-blue-800/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2, duration: 0.3 }}
              style={{ backgroundColor: 'rgba(239, 246, 255, 0.3)' }}
            >
              <div className="text-xs text-blue-400 dark:text-blue-500 font-garamond-narrow font-medium mb-1">Wishlist</div>
              <div className="text-sm font-medium text-blue-500 dark:text-blue-400 font-garamond-narrow">Apple Studio Display</div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-r from-blue-25 to-purple-25 dark:from-blue-900/10 dark:to-purple-900/10 backdrop-blur-sm rounded-lg p-3 border border-blue-100/30 dark:border-blue-800/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.3, duration: 0.3 }}
              style={{ backgroundColor: 'rgba(239, 246, 255, 0.3)' }}
            >
              <div className="text-xs text-blue-400 dark:text-blue-500 font-garamond-narrow font-medium mb-1">Wishlist</div>
              <div className="text-sm font-medium text-blue-500 dark:text-blue-400 font-garamond-narrow">Keychron K3</div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Tech Stack Section */}
      <motion.section
        id="tech-stack"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="py-16"
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="font-playfair italic text-center mb-8 text-fluid-lg lg:text-fluid-2xl" style={{ fontWeight: '400' }}>Stack</h2>
        </div>
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="flex flex-wrap justify-center gap-x-8 gap-y-4 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            {skills.map((skill, index) => (
              <motion.div 
                key={skill.name}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + index * 0.1, duration: 0.3 }}
              >
                <span className="text-sm font-garamond-narrow text-gray-700 dark:text-gray-300 tracking-wider uppercase font-medium">
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      

      {/* Back-to-top button disabled per request */}

      {/* Resume Modal */}
      <ResumeModal 
        isOpen={showResumeModal} 
        onClose={() => setShowResumeModal(false)} 
      />
    </div>
  )
}
