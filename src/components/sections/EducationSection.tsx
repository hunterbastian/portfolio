'use client'

import { motion } from 'framer-motion'

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

export default function EducationSection() {
  return (
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
  )
}
