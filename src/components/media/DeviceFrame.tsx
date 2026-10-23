import type { CSSProperties, ReactNode } from 'react'
import { deviceFrameVars } from '@/lib/device-frames'
import type { MediaCrop } from '@/lib/media-crops'
import './device-frame.css'

interface DeviceFrameProps {
  children: ReactNode
  className?: string
  spec: MediaCrop
}

export default function DeviceFrame({ children, className = '', spec }: DeviceFrameProps) {
  const style = deviceFrameVars(spec.frame, spec.aspect) as CSSProperties

  return (
    <div className={`device device-${spec.frame} ${className}`.trim()} data-frame={spec.frame} style={style}>
      {spec.frame === 'iphone' ? (
        <>
          <span className="device-button device-button-silent" />
          <span className="device-button device-button-volume" />
          <span className="device-button device-button-power" />
        </>
      ) : null}
      <div className="device-body">
        <div className="device-screen">
          {children}
          {spec.frame === 'iphone' ? <span className="device-island" /> : null}
        </div>
      </div>
    </div>
  )
}
