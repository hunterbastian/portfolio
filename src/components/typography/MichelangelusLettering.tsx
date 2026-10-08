import { michelangelusArtwork } from './michelangelus-artwork'

interface MichelangelusLetteringProps {
  phrase?: keyof typeof michelangelusArtwork
  className?: string
}

/** Fixed lettering artwork, with equivalent HTML text for assistive technology. */
export default function MichelangelusLettering({
  phrase = 'name',
  className = '',
}: MichelangelusLetteringProps) {
  const artwork = michelangelusArtwork[phrase]

  return (
    <span className={`michelangelus-lettering ${className}`.trim()}>
      <span className="sr-only">{artwork.text}</span>
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox={artwork.viewBox}
        width={`${artwork.width}em`}
        height={`${artwork.height}em`}
        fill="currentColor"
      >
        <path d={artwork.path} />
      </svg>
    </span>
  )
}
