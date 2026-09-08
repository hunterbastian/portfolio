export interface StudioWorkExample {
  title: string
  type: string
  image: string
  alt: string
  href: string
}

export const studioWork: Record<string, StudioWorkExample[]> = {
  'Studio Alpine': [
    { title: 'Alpine 01', type: 'AI-assisted poster study', image: '/images/projects/alpine-01.jpeg', alt: 'Alpine 01 mountain poster', href: '/projects/alpine-01' },
    { title: 'Iceland Graphics', type: 'Graphic exploration', image: '/images/optimized/projects/iceland-graphics.webp', alt: 'Iceland-inspired graphic study', href: '/projects/iceland-graphics' },
    { title: 'Sunset Graphic', type: 'Graphic exploration', image: '/images/optimized/projects/sunset-graphic.webp', alt: 'Sunset graphic exploration', href: '/projects/sunset-graphic' },
  ],
  'Studio Cala': [
    { title: 'Alder', type: 'Outdoor editorial · Website concept', image: '/images/studio-work/alder.webp', alt: 'Alder outdoor editorial website preview', href: 'https://studio-cala.vercel.app/work/alder.html' },
    { title: 'Form', type: 'Local services · Website concept', image: '/images/studio-work/form.webp', alt: 'Form auto detailing website preview', href: 'https://studio-cala.vercel.app/work/form.html' },
  ],
}
