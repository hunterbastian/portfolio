'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode, useEffect } from 'react'
import { preloadCriticalResources, setupLazyLoading } from '@/lib/performance'
import dynamic from 'next/dynamic'

// Lazy load heavy components - only load when user scrolls to them for better performance
const ContactSection = dynamic(() => import('./sections/ContactSection'), { 
  ssr: false,
  loading: () => <div className="py-16 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg" />
})
const ExperienceSection = dynamic(() => import('./sections/ExperienceSection'), { 
  ssr: false,
  loading: () => <div className="py-16 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg" />
})
const EducationSection = dynamic(() => import('./sections/EducationSection'), { 
  ssr: false,
  loading: () => <div className="py-16 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg" />
})
const TechStackSection = dynamic(() => import('./sections/TechStackSection'), { 
  ssr: false,
  loading: () => <div className="py-16 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg" />
})

interface AnimatedHomePageProps {
  children: ReactNode
}

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
  const shouldReduceMotion = useReducedMotion()

  // Create optimized animation variants
  const getMotionProps = (delay = 0, duration = 0.5) => {
    if (shouldReduceMotion) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.1 }
      }
    }
    return {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay, duration, ease: "easeOut" }
    }
  }

  useEffect(() => {
    // Performance optimizations
    preloadCriticalResources()
    setupLazyLoading()
  }, [])

  return (
    <div className="container mx-auto max-w-8xl px-4 py-8">
      {/* Hero Section */}
      <motion.section 
        className="py-16 relative"
        {...getMotionProps(0, 0.5)}
      >
        <div className="max-w-2xl mx-auto hero-section relative z-10 px-4 sm:px-6 lg:px-0 text-center">

                {/* Lightweight 3D-style icon above title */}
                <motion.div
                  className="flex justify-center items-center mb-8 mx-auto"
                  {...getMotionProps(0.3, 0.6)}
                  style={{
                    width: 'fit-content',
                    margin: '0 auto'
                  }}
                >
                  <div 
                    className="w-[130px] h-[130px] flex items-center justify-center relative"
                    style={{
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                      borderRadius: '50%',
                      border: '2px solid rgba(99, 102, 241, 0.2)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    {/* Simple geometric icon */}
                    <div className="relative">
                      <div 
                        className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg transform rotate-12 shadow-lg"
                        style={{
                          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)'
                        }}
                      />
                      <div 
                        className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full transform -rotate-12"
                        style={{
                          boxShadow: '0 4px 16px rgba(168, 85, 247, 0.4)'
                        }}
                      />
                    </div>
                  </div>
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
                    <span className="text-gray-800 dark:text-gray-200">Undergraduate at Utah Valley University</span> pursuing a <strong className="text-gray-800 dark:text-gray-200">B.S. in Web Design and Development</strong> with an emphasis in <strong className="text-gray-800 dark:text-gray-200">Interaction Design</strong>. Currently serving as the <em className="text-gray-700 dark:text-gray-300">Digital Media Department Representative</em>, I am passionate about creating <strong className="text-gray-800 dark:text-gray-200">meaningful digital experiences</strong>. I have experience designing for <strong className="text-gray-800 dark:text-gray-200">mobile and web platforms in Figma</strong>, alongside front-end development skills in <span className="text-gray-800 dark:text-gray-200">HTML, CSS, JavaScript</span> with <strong className="text-red-500 dark:text-red-400 font-bold" style={{ color: '#FF3B30', textShadow: '0 0 8px rgba(255, 59, 48, 0.4)' }}>AI first enthusiasm</strong>.
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

   {/* Contact Section - Lazy loaded */}
   <ContactSection />

   {/* Experience Section - Lazy loaded */}
   <ExperienceSection />

   {/* Education Section - Lazy loaded */}
   <EducationSection />


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
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="flex flex-wrap justify-center gap-x-8 gap-y-4 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.5 }}
          >
            {[
              'iPhone 15 Pro Natural Titanium',
              'MacBook Air 15" M2 Starlight', 
              'Apple Trackpad & Logitech G502',
              'AirPods Pro 2',
              'IKEA Desk',
              'Apple Watch',
              'Lego Flowers',
              'Wishlist: Apple Studio Display',
              'Wishlist: Keychron K3'
            ].map((item, index) => (
              <motion.div 
                key={item}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + index * 0.1, duration: 0.3 }}
              >
                <span className={`text-sm font-garamond-narrow tracking-wider uppercase font-medium ${
                  item.startsWith('Wishlist:') 
                    ? 'text-blue-500 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {item}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Tech Stack Section - Lazy loaded */}
      <TechStackSection />
    </div>
  )
}
