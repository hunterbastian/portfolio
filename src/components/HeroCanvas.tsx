'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei'
import { Mesh } from 'three'

// Animated sphere component
function AnimatedSphere() {
  const meshRef = useRef<Mesh>(null)
  const isVisibleRef = useRef<boolean>(true)
  const { invalidate } = useThree()

  useFrame(() => {
    if (meshRef.current && isVisibleRef.current) {
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.01
      invalidate() // Trigger next frame in demand mode
    }
  })

  useEffect(() => {
    const handleVisibility = () => {
      isVisibleRef.current = document.visibilityState === 'visible'
    }
    document.addEventListener('visibilitychange', handleVisibility)
    handleVisibility()
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} position={[0, 0, 0]}>
      <MeshDistortMaterial
        color="#4f46e5"
        attach="material"
        distort={0.3}
        speed={2}
        roughness={0.1}
        metalness={0.8}
      />
    </Sphere>
  )
}

// Scene component
function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <AnimatedSphere />
      <OrbitControls enablePan={false} enableZoom={false} autoRotate />
    </>
  )
}

interface HeroCanvasProps {
  className?: string
}

export default function HeroCanvas({ className = '' }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Cleanup Three.js resources on unmount
  useEffect(() => {
    const canvas = canvasRef.current
    return () => {
      // Dispose of any remaining Three.js resources
      if (canvas) {
        const context = canvas.getContext('webgl') || canvas.getContext('webgl2')
        if (context) {
          // Force context loss to free GPU memory
          const ext = context.getExtension('WEBGL_lose_context')
          if (ext) {
            ext.loseContext()
          }
        }
      }
    }
  }, [])

  return (
    <div className={`relative ${className}`}>
      <Canvas
        ref={canvasRef}
        frameloop="demand" // Render only when needed for better performance
        dpr={[1, 1.25]} // Lower DPR on mobile for better perf
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ 
          antialias: false, // Disable antialias for better performance
          alpha: true,
          powerPreference: "default" // Use default instead of high-performance
        }}
        style={{ 
          width: '100%', 
          height: '100%',
          background: 'transparent'
        }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
