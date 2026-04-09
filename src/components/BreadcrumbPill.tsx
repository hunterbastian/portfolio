import Link from 'next/link'
import IconArrowBackUp from '@/components/IconArrowBackUp'

interface BreadcrumbPillProps {
  href: string
  parentLabel: string
  currentLabel: string
}

export default function BreadcrumbPill({ href, parentLabel, currentLabel }: BreadcrumbPillProps) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 rounded-full backdrop-blur-xl px-5 py-2.5 top-meta-pill font-mono text-[11px] tracking-[0.12em] text-muted-foreground hover:text-foreground transition-colors duration-200"
    >
      <IconArrowBackUp size={11} className="shrink-0 opacity-60 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1" aria-hidden />
      <span className="text-foreground opacity-90">{parentLabel}</span>
      <span aria-hidden className="text-muted-foreground/30">/</span>
      <span>{currentLabel}</span>
    </Link>
  )
}
