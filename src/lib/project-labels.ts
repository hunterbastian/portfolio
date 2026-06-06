const CATEGORY_LABELS: Record<string, string> = {
  'Mobile Design': 'UX/UI, MOBILE',
  'Web Design': 'UX/UI, WEB',
  'Product Design': 'UX/UI, PRODUCT',
  'UI and Web Design': 'UX/UI, WEB',
  'Graphic Design': 'GRAPHIC DESIGN',
  'Brand Identity': 'BRAND IDENTITY',
  'Creative Coding': 'CREATIVE CODING',
  Photography: 'PHOTOGRAPHY',
  AI: 'AI',
}

export function formatProjectCategoryLabel(category?: string): string {
  if (!category) return ''

  return CATEGORY_LABELS[category] ?? category.toUpperCase()
}
