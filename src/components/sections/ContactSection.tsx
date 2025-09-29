'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import dynamic from 'next/dynamic'

const ResumePreview = dynamic(() => import('../ResumePreview'), { ssr: false })
const ResumeModal = dynamic(() => import('../ResumeModal'), { ssr: false })

export default function ContactSection() {
  const [showResumePreview, setShowResumePreview] = useState(false)
  const [showResumeModal, setShowResumeModal] = useState(false)

  return (
    <>
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
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-5 sm:gap-6 justify-center items-center sm:items-center">
          {/* LinkedIn */}
          <motion.a
            href="https://linkedin.com/in/hunterbastian"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl w-full sm:w-8 h-10 sm:h-8 px-3 sm:px-0 gap-2 sm:gap-0 font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-white relative overflow-hidden touch-manipulation"
            style={{
              background: `linear-gradient(180deg, rgba(147, 197, 253, 0.9) 0%, rgba(59, 130, 246, 0.8) 50%, rgba(37, 99, 235, 0.9) 100%)`,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid rgba(147, 197, 253, 0.6)`,
              boxShadow: `0 4px 16px rgba(37, 99, 235, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(37, 99, 235, 0.5)`
            }}
            whileHover={{ scale: 1.12, rotate: -2, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span className="text-xs sm:hidden font-medium" style={{ fontSize: '10px' }}>LinkedIn</span>
          </motion.a>

          {/* GitHub */}
          <motion.a
            href="https://github.com/hunterbastian"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl w-full sm:w-8 h-10 sm:h-8 px-3 sm:px-0 gap-2 sm:gap-0 font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-white relative overflow-hidden touch-manipulation"
            style={{
              background: `linear-gradient(180deg, rgba(156, 163, 175, 0.9) 0%, rgba(75, 85, 99, 0.8) 50%, rgba(55, 65, 81, 0.9) 100%)`,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid rgba(156, 163, 175, 0.6)`,
              boxShadow: `0 4px 16px rgba(55, 65, 81, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(55, 65, 81, 0.5)`
            }}
            whileHover={{ scale: 1.08, rotate: -1, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span className="text-xs sm:hidden font-medium" style={{ fontSize: '10px' }}>GitHub</span>
          </motion.a>

          {/* Medium */}
          <motion.a
            href="https://medium.com/@hunterbastian"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl w-full sm:w-8 h-10 sm:h-8 px-3 sm:px-0 gap-2 sm:gap-0 font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-white relative overflow-hidden touch-manipulation"
            style={{
              background: `linear-gradient(180deg, rgba(115, 115, 115, 0.9) 0%, rgba(51, 51, 51, 0.8) 50%, rgba(34, 34, 34, 0.9) 100%)`,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid rgba(115, 115, 115, 0.6)`,
              boxShadow: `0 4px 16px rgba(34, 34, 34, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(34, 34, 34, 0.5)`
            }}
            whileHover={{ scale: 1.08, rotate: -1, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
            </svg>
            <span className="text-xs sm:hidden font-medium" style={{ fontSize: '10px' }}>Medium</span>
          </motion.a>

          {/* Dribbble */}
          <motion.a
            href="https://dribbble.com/hunterbastian"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl w-full sm:w-8 h-10 sm:h-8 px-3 sm:px-0 gap-2 sm:gap-0 font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-white relative overflow-hidden touch-manipulation"
            style={{
              background: `linear-gradient(180deg, rgba(244, 114, 182, 0.9) 0%, rgba(234, 76, 137, 0.8) 50%, rgba(219, 39, 119, 0.9) 100%)`,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid rgba(244, 114, 182, 0.6)`,
              boxShadow: `0 4px 16px rgba(219, 39, 119, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(219, 39, 119, 0.5)`
            }}
            whileHover={{ scale: 1.08, rotate: -1, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.341 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.816zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z"/>
            </svg>
            <span className="text-xs sm:hidden font-medium" style={{ fontSize: '10px' }}>Dribbble</span>
          </motion.a>

          {/* Resume Button */}
          <div className="relative">
            <motion.button
              onClick={() => setShowResumeModal(true)}
              className="inline-flex items-center justify-center rounded-xl px-3 py-2 font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring whitespace-nowrap relative overflow-hidden cursor-pointer text-white"
              style={{
                background: `linear-gradient(180deg, rgba(148, 163, 184, 0.9) 0%, rgba(100, 116, 139, 0.8) 50%, rgba(71, 85, 105, 0.9) 100%)`,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid rgba(148, 163, 184, 0.6)`,
                boxShadow: `0 4px 16px rgba(71, 85, 105, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(71, 85, 105, 0.5)`,
                fontSize: '9px'
              }}
              whileHover={{ scale: 1.08, rotate: -1, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onMouseEnter={() => setShowResumePreview(true)}
              onMouseLeave={() => setShowResumePreview(false)}
            >
              VIEW RESUME
            </motion.button>
            <ResumePreview isVisible={showResumePreview} />
          </div>
        </div>
      </div>
    </motion.section>

    {/* Resume Modal */}
    <ResumeModal 
      isOpen={showResumeModal} 
      onClose={() => setShowResumeModal(false)} 
    />
  </>
  )
}
