'use client'

import { useState } from 'react'
import ResumeModal from './ResumeModal'
import AnimatedDashedArrow from './AnimatedDashedArrow'

export default function ResumeButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="playground-joy group relative overflow-hidden inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-medium tracking-[0.06em] uppercase transition-[box-shadow,background,border-color,opacity] duration-400 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
        style={{ fontFamily: 'inherit' }}
      >
        <span className="relative z-10">Resume</span>
        <AnimatedDashedArrow size={14} />
      </button>
      <ResumeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
