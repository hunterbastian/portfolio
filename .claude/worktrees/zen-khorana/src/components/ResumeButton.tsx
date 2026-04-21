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
        className="group inline-flex items-center gap-1.5 text-xs tracking-[0.08em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-200"
        style={{ fontFamily: 'inherit' }}
      >
        Resume
        <AnimatedDashedArrow size={14} />
      </button>
      <ResumeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
