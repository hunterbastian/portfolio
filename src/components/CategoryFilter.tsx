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
    router.replace(`/?${params.toString()}`, { scroll: false })
  }

  const allCategories = ['all', ...categories]

  return (
    <div className="flex justify-center mb-8">
      <div className="flex flex-wrap gap-2">
        {allCategories.map((category) => (
          <motion.button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === category
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category === 'all' ? 'All' : category}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
