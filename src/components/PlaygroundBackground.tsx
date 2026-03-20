'use client'

import dynamic from 'next/dynamic'

const GrainWave = dynamic(() => import('@/components/react-bits/grain-wave'), { ssr: false })

export default function PlaygroundBackground() {
  return (
    <div className="absolute inset-0 z-0 opacity-60">
      <GrainWave
        width="100%"
        height="100%"
        speed={0.3}
        waveCount={18}
        waveAmplitude={0.5}
        waveFrequency={3}
        lineThickness={0.12}
        grainIntensity={35}
        startColor="#3f4f5c"
        endColor="#d4928e"
        lightBackground="#f2f0ec"
        darkBackground="#1e2830"
        brightness={0.4}
        speedVariation={0.004}
        waveWidth={4}
        scale={0.5}
      />
    </div>
  )
}
