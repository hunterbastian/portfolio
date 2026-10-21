import type { CSSProperties, ReactNode } from 'react'
import { deviceShellAspect, type DeviceFrameSpec } from '@/lib/device-frames'
import './device-frame.css'

interface DeviceFrameProps {
  children: ReactNode
  className?: string
  spec: DeviceFrameSpec
}

export default function DeviceFrame({ children, className = '', spec }: DeviceFrameProps) {
  const style = {
    '--device-aspect': deviceShellAspect(spec.kind, spec.aspect),
    '--screen-aspect': spec.aspect,
    '--crop-x': spec.crop.x,
    '--crop-y': spec.crop.y,
    '--crop-w': spec.crop.w,
    '--crop-h': spec.crop.h,
  } as CSSProperties

  return (
    <div className={`device device-${spec.kind} ${className}`.trim()} data-fit={spec.fit ?? 'fill'} style={style}>
      {spec.kind === 'iphone' ? (
        <>
          <span className="device-button device-button-action" />
          <span className="device-button device-button-volume-up" />
          <span className="device-button device-button-volume-down" />
          <span className="device-button device-button-power" />
        </>
      ) : null}
      {spec.kind === 'ipad' ? <span className="device-button device-button-top" /> : null}
      <div className="device-body">
        <div className="device-screen">
          {children}
          {spec.kind === 'iphone' ? <span className="device-island" /> : null}
        </div>
      </div>
    </div>
  )
}
