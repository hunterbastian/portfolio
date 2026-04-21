import type { SVGProps } from 'react'

interface IconArrowBackUpProps extends SVGProps<SVGSVGElement> {
  size?: number | string
}

export default function IconArrowBackUp({ size = 24, ...props }: IconArrowBackUpProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 14l-4 -4l4 -4" />
      <path d="M5 10h11a4 4 0 1 1 0 8h-1" />
    </svg>
  )
}
