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
    router.push(`/?${params.toString()}`)
  }

  const allCategories = ['all', ...categories]

  return (
    <div className="flex flex-wrap gap-2 mb-8 max-w-2xl mx-auto">
      {allCategories.map((category) => (
        <motion.button
          key={category}
          onClick={() => handleCategoryChange(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === category
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {category === 'all' ? 'All Projects' : category}
        </motion.button>
      ))}
    </div>
  )
}
