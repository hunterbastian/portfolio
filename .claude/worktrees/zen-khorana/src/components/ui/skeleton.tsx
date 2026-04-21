import * as React from 'react'

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

export function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-[3px] bg-muted ${className}`}
      {...props}
    />
  )
}

export default Skeleton
