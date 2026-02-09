'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import type { ReactNode } from 'react'
import { useState } from 'react'
import ResumePreview from './ResumePreview'
import TextType from './TextType'

const ResumeModal = dynamic(() => import('./ResumeModal'), { ssr: false })

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

const socialLinkClassName =
  'inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-code font-medium tracking-[0.1em] uppercase text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'

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

const everydayTech = [
  'iPhone 15 Pro Natural Titanium',
  'MacBook Air 15" M2 Starlight',
  'Apple Trackpad & Logitech G502',
  'AirPods Pro 2',
  'IKEA Desk',
  'Apple Watch',
  'Wishlist: Apple Studio Display',
  'Wishlist: Keychron K3',
]

const skills = ['Figma', 'Framer', 'UX Design', 'UI Design', 'HTML', 'JavaScript', 'CSS', 'ChatGPT']

const contactLinks: ContactLinkItem[] = [
  { label: 'Instagram', href: 'https://instagram.com/studio.alpine' },
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
      className={socialLinkClassName}
    >
      <span>{link.label}</span>
    </a>
  )
}

function SectionHeading({ children }: { children: ReactNode }) {
  return <h2 className="section-heading font-code text-sm mb-6 sm:mb-8">{children}</h2>
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
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <section className="pt-12 pb-0 relative animate-fade-in">
        <div className="max-w-2xl mx-auto hero-section relative z-10 px-4 sm:px-6 lg:px-0">
          <div className="mb-6 flex items-center gap-4">
            <Image
              src="/images/profilepicture.jpg"
              alt="Hunter Bastian // Studio Alpine"
              width={72}
              height={72}
              className="h-[72px] w-[72px] rounded-full object-cover border border-border shadow-sm"
              priority
            />
            <div>
              <h1 className="text-foreground font-garamond-narrow font-semibold text-[clamp(1.35rem,4.2vw,2.25rem)] leading-tight">
                <TextType
                  text="Hunter Bastian // Studio Alpine"
                  className="block whitespace-nowrap"
                  typingSpeed={46}
                  deletingSpeed={35}
                  pauseDuration={2200}
                  loop={false}
                  cinematic
                />
              </h1>
              <div className="font-code text-muted-foreground mt-2 flex items-center gap-3 text-xs tracking-[0.12em]">
                <span>Interaction designer</span>
                <span className="opacity-50">|</span>
                <span>Lehi, UT</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground text-sm font-garamond-narrow leading-relaxed m-0">
              Interaction Design student at UVU with experience designing and building digital products.
              I work in Figma and front-end code at <span className="font-semibold text-primary">Studio Alpine</span>, and
              I&apos;m focused on clear, meaningful interfaces with an AI-first mindset.
            </p>
          </div>

        </div>
      </section>

      <section id="contact" className="pt-4 pb-10 px-4 sm:px-6 lg:px-0 relative z-20 animate-fade-in">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-wrap gap-3 items-stretch sm:items-center">
            {contactLinks.map((link) => (
              <ContactLink key={link.label} link={link} />
            ))}

            <div className="relative overflow-visible">
              <button
                onClick={() => setShowResumeModal(true)}
                className={socialLinkClassName}
                onMouseEnter={() => setShowResumePreview(true)}
                onMouseLeave={() => setShowResumePreview(false)}
                onFocus={() => setShowResumePreview(true)}
                onBlur={() => setShowResumePreview(false)}
              >
                <span>Resume</span>
              </button>
              <ResumePreview isVisible={showResumePreview} />
            </div>
          </div>
        </div>
      </section>

      <section id="creating" className="py-16 px-4 sm:px-6 lg:px-0 relative z-10">
        <div className="max-w-2xl mx-auto">
          <SectionHeading>Creating</SectionHeading>
          <div className="text-left">
            <a
              href="https://instagram.com/studio.alpine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-code tracking-[0.08em] uppercase font-medium text-muted-foreground hover:text-primary underline underline-offset-4"
            >
              Photography Studio: Studio Alpine
            </a>
          </div>
        </div>
      </section>

      <section id="case-studies" className="pt-[4.5rem] pb-16 px-4 sm:px-6 lg:px-0 relative z-10">
        <div className="max-w-2xl mx-auto">
          <SectionHeading>Case Studies</SectionHeading>
        </div>

        {children}

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-0">
          <div className="flex justify-start mt-12">
            <a
              href="/archive"
              className="social-button nord-button inline-flex items-center justify-center gap-1.5 px-4 py-2 font-medium text-xs rounded-sm transition-transform transition-shadow duration-300 relative overflow-hidden hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="font-code font-light tracking-[0.08em] relative z-10">Other</span>
            </a>
          </div>
        </div>
      </section>

      <section id="experience" className="py-16">
        <div className="max-w-2xl mx-auto">
          <SectionHeading>Experience</SectionHeading>

          <div className="nord-panel rounded-lg p-4 sm:p-6 space-y-2">
            {experience.map((job, index) => {
              const isExpanded = expandedJobs.has(index)

              return (
                <div key={job.company} className="border-b border-border last:border-b-0">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-4 px-2 text-left"
                    onClick={() => toggleJob(index)}
                  >
                    <div className="flex items-center space-x-6">
                      <span className="text-muted-foreground text-xs font-code w-16">{job.year}</span>
                      <span className="font-medium font-garamond-narrow">{job.company}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-muted-foreground text-sm font-garamond-narrow hidden sm:block">{job.title}</span>
                      <div
                        className="w-5 h-5 flex items-center justify-center transition-transform duration-200 text-muted-foreground"
                        style={{ transform: isExpanded ? 'rotate(45deg)' : 'rotate(0deg)' }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </div>
                  </button>
                  <div
                    className="overflow-hidden transition-[max-height,opacity] duration-300"
                    style={{ maxHeight: isExpanded ? '460px' : '0px', opacity: isExpanded ? 1 : 0 }}
                  >
                    <div className="pb-4 pl-2 sm:pl-[5.5rem] pr-2">
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
          <SectionHeading>Education</SectionHeading>

          <div className="nord-panel rounded-lg p-6 space-y-6">
            {education.map((edu) => (
              <div key={edu.institution} className="border-b border-border last:border-b-0 pb-6 last:pb-0">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="text-muted-foreground text-xs font-code min-w-[100px]">{edu.year}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-base mb-1 font-garamond-narrow">{edu.institution}</h3>
                    <p className="text-foreground text-sm mb-1 font-garamond-narrow">{edu.degree}</p>
                    <p className="text-muted-foreground text-sm font-garamond-narrow">{edu.level}</p>
                    {edu.note && (
                      <p className="text-muted-foreground text-xs mt-1 font-code tracking-[0.08em]" style={{ opacity: 0.7 }}>
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

      <section id="everyday-tech" className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-0">
        <div className="max-w-2xl mx-auto">
          <SectionHeading>Everyday Tech</SectionHeading>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-wrap justify-start gap-x-8 gap-y-4">
            {everydayTech.map((item) => (
              <div key={item} className="text-left">
                <span
                  className={`text-sm font-code tracking-[0.08em] uppercase font-medium ${
                    item.startsWith('Wishlist:') ? 'text-primary' : 'text-muted-foreground'
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
          <SectionHeading>Stack</SectionHeading>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-start gap-x-6 gap-y-3 max-w-2xl mx-auto">
            {skills.map((skill) => (
              <div key={skill} className="text-center">
                <span className="text-sm font-code text-muted-foreground tracking-[0.08em] uppercase font-medium whitespace-nowrap">
                  {skill}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ResumeModal isOpen={showResumeModal} onClose={() => setShowResumeModal(false)} />
    </div>
  )
}
