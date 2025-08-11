'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import CategoryFilter from './CategoryFilter'

interface ClientWrapperProps {
  categories: string[]
  children: React.ReactNode
}

function CategoryFilterWrapper({ categories }: { categories: string[] }) {
  return <CategoryFilter categories={categories} />
}

export default function ClientWrapper({ categories, children }: ClientWrapperProps) {
  return (
    <>
      <Suspense fallback={<div>Loading filters...</div>}>
        <CategoryFilterWrapper categories={categories} />
      </Suspense>
      {children}
    </>
  )
}
