'use client'

import { motion } from 'framer-motion'

const skills = [
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

export default function TechStackSection() {
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
