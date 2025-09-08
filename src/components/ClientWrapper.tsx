'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'
import { setupLazyLoading } from '@/lib/performance'
import CategoryFilter from './CategoryFilter'

interface ClientWrapperProps {
  categories: string[]
  children: React.ReactNode
}

function CategoryFilterWrapper({ categories }: { categories: string[] }) {
  return <CategoryFilter categories={categories} />
}

export default function ClientWrapper({ categories, children }: ClientWrapperProps) {
  useEffect(() => {
    setupLazyLoading()
  }, [])
  return (
    <>
      <Suspense fallback={<div>Loading filters...</div>}>
        <CategoryFilterWrapper categories={categories} />
      </Suspense>
      {children}
    </>
  )
}
