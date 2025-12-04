'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface ResumePreviewProps {
  isVisible: boolean
}

export default function ResumePreview({ isVisible }: ResumePreviewProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute left-1/2 z-50 pointer-events-none"
          style={{ 
            transform: 'translate(-50%, -50%)',
            top: '50%',
            willChange: 'transform, opacity'
          }}
        >
          {/* Preview Container */}
          <div 
            className="bg-white border border-gray-300 rounded-lg shadow-2xl overflow-hidden"
            style={{ width: '200px', height: '260px' }} // Half size of a typical resume preview
          >
            {/* Header */}
            <div className="bg-gray-100 px-3 py-2 border-b border-gray-200">
              <div className="text-[8px] font-semibold text-gray-700">HUNTER BASTIAN</div>
              <div className="text-[6px] text-gray-500">Resume Preview</div>
            </div>
            
            {/* Content */}
            <div className="p-3 space-y-2">
              {/* Profile Section */}
              <div className="space-y-1">
                <div className="h-1 bg-gray-800 rounded w-3/4"></div>
                <div className="h-0.5 bg-gray-400 rounded w-full"></div>
                <div className="h-0.5 bg-gray-400 rounded w-5/6"></div>
              </div>
              
              {/* Experience Section */}
              <div className="space-y-1">
                <div className="h-0.5 bg-gray-600 rounded w-1/2"></div>
                <div className="space-y-0.5">
                  <div className="h-0.5 bg-gray-300 rounded w-full"></div>
                  <div className="h-0.5 bg-gray-300 rounded w-4/5"></div>
                  <div className="h-0.5 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
              
              {/* Skills Section */}
              <div className="space-y-1">
                <div className="h-0.5 bg-gray-600 rounded w-1/3"></div>
                <div className="flex gap-1">
                  <div className="h-3 w-6 bg-blue-200 rounded text-[4px] flex items-center justify-center">JS</div>
                  <div className="h-3 w-8 bg-green-200 rounded text-[4px] flex items-center justify-center">React</div>
                  <div className="h-3 w-6 bg-purple-200 rounded text-[4px] flex items-center justify-center">TS</div>
                </div>
              </div>
              
              {/* Education Section */}
              <div className="space-y-1">
                <div className="h-0.5 bg-gray-600 rounded w-2/5"></div>
                <div className="h-0.5 bg-gray-300 rounded w-4/5"></div>
                <div className="h-0.5 bg-gray-300 rounded w-3/5"></div>
              </div>
              
              {/* Contact Section */}
              <div className="space-y-1">
                <div className="h-0.5 bg-gray-600 rounded w-1/4"></div>
                <div className="h-0.5 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
            
            {/* Bottom indicator */}
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
              <div className="text-[6px] text-gray-400">Click to view full resume</div>
            </div>
          </div>
          
        </motion.div>
      )}
    </AnimatePresence>
  )
}
