'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'

interface CategoryFilterProps {
  categories: string[]
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category') || 'all'

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category === 'all') {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    const queryString = params.toString()
    router.replace(queryString ? `/?${queryString}` : '/', { scroll: false })
  }

  const uniqueCategories = Array.from(new Set(categories))
  const allCategories = ['all', ...uniqueCategories]

  const renderCategoryButton = (category: string) => {
    const isActive = activeCategory === category

    return (
      <motion.button
        key={category}
        type="button"
        onClick={() => handleCategoryChange(category)}
        className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 ${
          isActive
            ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
            : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
        aria-pressed={isActive}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        {category.replace(/-/g, ' ')}
      </motion.button>
    )
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mx-auto max-w-6xl">
        <div
          className="flex w-full items-center gap-3 overflow-x-auto rounded-2xl border border-slate-200 bg-white/60 p-3 backdrop-blur supports-[backdrop-filter]:bg-white/70"
          data-animate
        >
          {allCategories.map(renderCategoryButton)}
        </div>
      </div>
    </div>
  )
}
