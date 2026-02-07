'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import type { ReactNode } from 'react'
import { useState } from 'react'
import ResumePreview from './ResumePreview'

const ResumeModal = dynamic(() => import('./ResumeModal'), { ssr: false })
const LazyDinosaur = dynamic(() => import('./LazyDinosaur'), {
  ssr: false,
  loading: () => null,
})

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

interface ContactLinkItem {
  label: string
  href: string
}

const experience: ExperienceItem[] = [
  {
    year: '2024 - Present',
    company: 'Catapult',
    title: 'Video Producer',
    description:
      'Produce and edit marketing videos for Catapult products including banner stands, from planning and filming to post-production in Final Cut Pro. Deliver optimized content for YouTube to support marketing campaigns and ensure alignment with brand standards.',
  },
  {
    year: '2024 - Present',
    company: 'Utah Valley University',
    title: 'Department Representative',
    description:
      'Helped new students with internship opportunities, helping design students in the Web Design and Development program, working on ongoing topics and issues within our department. Responsibilities include finding internship opportunities for students and assisting at school sponsored events, as well as content creation for UVU CET social media and marketing.',
  },
  {
    year: '2023',
    company: 'Nutricost',
    title: 'Graphic Design Intern',
    description:
      'At Nutricost, I assisted the marketing team and strengthened my knowledge as I worked in the graphic design queue. Assisted the marketing team with their design queue and helped with production. Edited product mockups in Photoshop and Illustrator for Nutricost online product images. Worked on and edited Amazon online product images.',
  },
  {
    year: '2017',
    company: 'Clutch.',
    title: 'Digital Design Intern',
    description:
      'At Clutch, I helped with design branding and further improved my knowledge about the UX design process.',
  },
]

const education: EducationItem[] = [
  {
    year: '2023 - 2027',
    institution: 'Utah Valley University',
    degree: 'Interaction Design',
    level: "Bachelor's Degree",
  },
  {
    year: '2021',
    institution: 'Columbus State Community College',
    degree: 'Graphic Design',
    level: "Associate's Degree",
    note: 'TRANSFERRED TO UVU',
  },
]

const creatingProjects = [
  { name: 'Project on Instagram', description: 'COMING SOON' },
  { name: 'Digital Studio', description: 'in the works' },
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
  'Wishlist: Keychron K3',
]

const skills = [
  'Figma',
  'Framer',
  'UX Design',
  'UI Design',
  'HTML',
  'JavaScript',
  'CSS',
  'ChatGPT',
  'AI Models',
]

const contactLinks: ContactLinkItem[] = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/hunterbastian' },
  { label: 'GitHub', href: 'https://github.com/hunterbastian' },
  { label: 'Medium', href: 'https://medium.com/@hunterbastian' },
  { label: 'Dribbble', href: 'https://dribbble.com/hunterbastian' },
]

function ContactLink({ link }: { link: ContactLinkItem }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="social-button inline-flex items-center justify-center gap-1.5 px-4 py-2 font-medium text-xs text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-sm transition-all duration-300 relative overflow-hidden hover:-translate-y-0.5 hover:shadow-md"
    >
      <span className="font-light tracking-wide relative z-10">{link.label}</span>
    </a>
  )
}

export default function AnimatedHomePage({ children }: AnimatedHomePageProps) {
  const [showResumePreview, setShowResumePreview] = useState(false)
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [expandedJobs, setExpandedJobs] = useState<Set<number>>(new Set())

  const toggleJob = (index: number) => {
    setExpandedJobs((prev) => {
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
      <section className="pt-16 pb-0 relative animate-fade-in">
        <div className="max-w-2xl mx-auto hero-section relative z-10 px-4 sm:px-6 lg:px-0">
          <div className="mb-6 flex items-center gap-4">
            <Image
              src="/images/profilepicture.jpg"
              alt="Hunter Bastian"
              width={72}
              height={72}
              className="h-[72px] w-[72px] rounded-full object-cover border border-gray-300 dark:border-gray-700 shadow-sm"
              priority
            />
            <div>
              <h1
                className="text-black dark:text-white font-playfair italic font-semibold text-fluid-3xl lg:text-fluid-4xl"
                style={{ lineHeight: '1.2' }}
              >
                Hunter Bastian
              </h1>
              <div
                className="text-gray-600 dark:text-gray-400 font-garamond-narrow mt-2 flex items-center gap-3"
                style={{ fontSize: '14px', letterSpacing: '0.5px' }}
              >
                <span>Interaction designer</span>
                <span className="text-gray-400 dark:text-gray-500">|</span>
                <span>Lehi, UT</span>
              </div>
            </div>
          </div>

          <div className="mb-0">
            <p
              className="text-gray-600 dark:text-gray-300 text-sm font-garamond-narrow mb-0"
              style={{ lineHeight: '1.6', margin: 0, padding: 0 }}
            >
              Interaction Design student at UVU with experience designing and building digital
              products. I work in Figma and front-end code, and I&apos;m passionate about creating
              clean, meaningful user experiences, with an{' '}
              <span className="font-bold text-emerald-900 dark:text-emerald-400">AI first mindset</span>.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="pt-8 pb-8 px-4 sm:px-6 lg:px-0 relative z-20 animate-fade-in">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              {contactLinks.map((link) => (
                <ContactLink key={link.label} link={link} />
              ))}
            </div>

            <div className="relative overflow-visible">
              <button
                onClick={() => setShowResumeModal(true)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 font-medium text-xs text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-sm transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-900 hover:-translate-y-0.5"
                style={{ borderColor: '#1e3a8a', color: '#1e3a8a' }}
                onMouseEnter={() => setShowResumePreview(true)}
                onMouseLeave={() => setShowResumePreview(false)}
                onFocus={() => setShowResumePreview(true)}
                onBlur={() => setShowResumePreview(false)}
              >
                <span className="font-light tracking-wide">RESUME</span>
              </button>
              <ResumePreview isVisible={showResumePreview} />
            </div>
          </div>
        </div>
      </section>

      <section id="case-studies" className="py-16 px-4 sm:px-6 lg:px-0 relative z-10">
        <div className="max-w-2xl mx-auto">
          <h2
            className="font-playfair italic text-left mb-6 sm:mb-8 text-fluid-base lg:text-fluid-xl"
            style={{ fontWeight: '500' }}
          >
            Case Studies
          </h2>
        </div>

        {children}

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-0">
          <div className="flex justify-start mt-12">
            <a
              href="/archive"
              className="social-button inline-flex items-center justify-center gap-1.5 px-4 py-2 font-medium text-xs text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-sm transition-all duration-300 relative overflow-hidden hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="font-light tracking-wide relative z-10">Other</span>
            </a>
          </div>
        </div>
      </section>

      <section id="experience" className="py-16">
        <div className="max-w-2xl mx-auto">
          <h2
            className="font-playfair italic text-left mb-6 sm:mb-8 text-fluid-base lg:text-fluid-xl"
            style={{ fontWeight: '500' }}
          >
            Experience
          </h2>

          <div className="rounded-lg p-6 space-y-6" style={{ backgroundColor: 'rgba(222, 220, 219, 0.7)' }}>
            {experience.map((job, index) => {
              const isExpanded = expandedJobs.has(index)

              return (
                <div key={job.company} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-4 px-3 text-left"
                    onClick={() => toggleJob(index)}
                  >
                    <div className="flex items-center space-x-8">
                      <span className="text-muted-foreground text-sm font-mono w-12 font-garamond-narrow">
                        {job.year}
                      </span>
                      <span className="font-medium font-garamond-narrow">{job.company}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-muted-foreground text-sm font-garamond-narrow">{job.title}</span>
                      <div
                        className="w-5 h-5 flex items-center justify-center transition-transform duration-200"
                        style={{ transform: isExpanded ? 'rotate(45deg)' : 'rotate(0deg)' }}
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
                      </div>
                    </div>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{ maxHeight: isExpanded ? '500px' : '0px', opacity: isExpanded ? 1 : 0 }}
                  >
                    <div className="pb-4 pl-20 pr-4">
                      <p className="text-muted-foreground text-sm leading-relaxed">{job.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="education" className="py-16">
        <div className="max-w-2xl mx-auto">
          <h2
            className="font-playfair italic text-left mb-6 sm:mb-8 text-fluid-base lg:text-fluid-xl"
            style={{ fontWeight: '500' }}
          >
            Education
          </h2>

          <div className="rounded-lg p-6 space-y-6" style={{ backgroundColor: 'rgba(222, 220, 219, 0.7)' }}>
            {education.map((edu) => (
              <div key={edu.institution} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-6 last:pb-0">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="text-gray-500 dark:text-gray-400 text-sm font-medium min-w-[100px] font-garamond-narrow">
                    {edu.year}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base mb-1 font-garamond-narrow">
                      {edu.institution}
                    </h3>
                    <p className="text-gray-800 dark:text-gray-200 text-sm mb-1 font-garamond-narrow">{edu.degree}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-garamond-narrow">{edu.level}</p>
                    {edu.note && (
                      <p
                        className="text-gray-500 dark:text-gray-500 text-xs mt-1 font-medium font-garamond-narrow"
                        style={{ opacity: 0.6 }}
                      >
                        {edu.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="creating" className="py-16 px-4 sm:px-6 lg:px-0 relative z-10">
        <div className="max-w-2xl mx-auto">
          <h2
            className="font-playfair italic text-left mb-6 sm:mb-8 text-fluid-base lg:text-fluid-xl"
            style={{ fontWeight: '500' }}
          >
            Creating
          </h2>

          <div className="flex flex-wrap justify-start gap-x-8 gap-y-4">
            {creatingProjects.map((project) => (
              <div key={project.name} className="text-left">
                <span className="text-sm font-garamond-narrow tracking-wider uppercase font-medium text-gray-700 dark:text-gray-300">
                  {project.name}: {project.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="everyday-tech" className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-0">
        <div className="max-w-2xl mx-auto">
          <h2
            className="font-playfair italic text-left mb-6 sm:mb-8 text-fluid-base lg:text-fluid-xl"
            style={{ fontWeight: '500' }}
          >
            Everyday tech
          </h2>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-wrap justify-start gap-x-8 gap-y-4">
            {everydayTech.map((item) => (
              <div key={item} className="text-left">
                <span
                  className={`text-sm font-garamond-narrow tracking-wider uppercase font-medium ${
                    item.startsWith('Wishlist:') ? 'text-blue-500 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tech-stack" className="py-16">
        <div className="max-w-2xl mx-auto">
          <h2
            className="font-playfair italic text-left mb-8 text-fluid-base lg:text-fluid-xl"
            style={{ fontWeight: '500' }}
          >
            Stack
          </h2>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-start gap-x-6 gap-y-3 max-w-2xl mx-auto">
            {skills.map((skill) => (
              <div key={skill} className="text-center">
                <span className="text-sm font-garamond-narrow text-gray-700 dark:text-gray-300 tracking-wider uppercase font-medium whitespace-nowrap">
                  {skill}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LazyDinosaur />
      <ResumeModal isOpen={showResumeModal} onClose={() => setShowResumeModal(false)} />
    </div>
  )
}
