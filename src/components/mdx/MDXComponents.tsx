import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ComparisonSlider from './ComparisonSlider'

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement>
type ParagraphProps = React.HTMLAttributes<HTMLParagraphElement>
type ListProps = React.HTMLAttributes<HTMLUListElement>
type OrderedListProps = React.HTMLAttributes<HTMLOListElement>
type ListItemProps = React.HTMLAttributes<HTMLLIElement>
type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>
type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  width?: number
  height?: number
}

export const H1: React.FC<HeadingProps> = ({ children, ...props }) => (
  <h1 className="text-3xl md:text-4xl font-bold mt-8 mb-4" {...props}>{children}</h1>
)

export const H2: React.FC<HeadingProps> = ({ children, ...props }) => (
  <h2 className="text-2xl md:text-3xl font-semibold mt-6 mb-3" {...props}>{children}</h2>
)

export const H3: React.FC<HeadingProps> = ({ children, ...props }) => (
  <h3 className="text-xl md:text-2xl font-semibold mt-4 mb-2" {...props}>{children}</h3>
)

export const P: React.FC<ParagraphProps> = ({ children, ...props }) => (
  <p className="mb-4 font-inter leading-relaxed" {...props}>{children}</p>
)

export const UL: React.FC<ListProps> = ({ children, ...props }) => (
  <ul className="mb-4 list-disc pl-6 font-inter leading-relaxed" {...props}>{children}</ul>
)

export const OL: React.FC<OrderedListProps> = ({ children, ...props }) => (
  <ol className="mb-4 list-decimal pl-6 font-inter leading-relaxed" {...props}>{children}</ol>
)

export const LI: React.FC<ListItemProps> = ({ children, ...props }) => (
  <li className="mb-1 font-inter" {...props}>{children}</li>
)

export const A: React.FC<AnchorProps> = ({ href = '', children, ...props }) => {
  const isExternal = /^https?:\/\//.test(href)
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4" {...props}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className="text-primary underline underline-offset-4" {...(props as any)}>
      {children}
    </Link>
  )
}

export const Img: React.FC<ImageProps> = ({ src = '', alt = '', width = 1200, height = 675, ...props }) => (
  <div className="mb-8 mt-8">
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="w-full rounded-lg shadow-lg"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
      priority={false}
      {...props as any}
    />
  </div>
)

export const Video: React.FC<React.VideoHTMLAttributes<HTMLVideoElement>> = ({ className = '', ...props }) => (
  <div className="mb-8 mt-8">
    <video
      controls
      playsInline
      className={`w-full rounded-lg shadow-lg ${className}`}
      {...props}
    />
  </div>
)

const mdxComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  p: P,
  ul: UL,
  ol: OL,
  li: LI,
  a: A,
  img: Img,
  video: Video,
  ComparisonSlider,
}

export default mdxComponents
