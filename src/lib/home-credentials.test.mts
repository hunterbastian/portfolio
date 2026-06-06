import assert from 'node:assert/strict'
import test from 'node:test'

import {
  getHomeEducationDescription,
  getHomeEducationDisplayItem,
  getHomeEducationKey,
  getHomeEducationTitle,
  getHomeExperienceDisplayItem,
  getHomeExperienceKey,
  getHomeExperienceTitle,
} from './home-credentials.ts'

const experience = {
  year: '2026 - Present',
  company: 'Studio Alpine',
  title: 'Founder',
  description: 'Founder of Studio Alpine, a photography and design project.',
}

const educationWithNote = {
  year: '2023 - 2027',
  institution: 'Utah Valley University',
  degree: 'B.S. Interaction Design',
  level: "Bachelor's Degree",
  note: "ProdUX at UVU · Dean's List Fall 2024",
}

const educationWithoutNote = {
  year: '2026',
  institution: 'Replit',
  degree: 'Platform Builder',
  level: 'Certification',
}

test('home experience helpers preserve keys and titles', () => {
  assert.equal(getHomeExperienceKey(experience), 'Studio Alpine-2026 - Present')
  assert.equal(getHomeExperienceTitle(experience), 'Founder — Studio Alpine')
  assert.deepEqual(getHomeExperienceDisplayItem(experience), {
    description: 'Founder of Studio Alpine, a photography and design project.',
    eyebrow: '2026 - Present',
    key: 'Studio Alpine-2026 - Present',
    title: 'Founder — Studio Alpine',
  })
})

test('home education helpers preserve keys, titles, and note punctuation', () => {
  assert.equal(getHomeEducationKey(educationWithNote), 'Utah Valley University-2023 - 2027')
  assert.equal(getHomeEducationTitle(educationWithNote), 'B.S. Interaction Design — Utah Valley University')
  assert.equal(
    getHomeEducationDescription(educationWithNote),
    "Bachelor's Degree. ProdUX at UVU · Dean's List Fall 2024.",
  )
  assert.equal(getHomeEducationDescription(educationWithoutNote), 'Certification')
  assert.deepEqual(getHomeEducationDisplayItem(educationWithNote), {
    description: "Bachelor's Degree. ProdUX at UVU · Dean's List Fall 2024.",
    eyebrow: '2023 - 2027',
    key: 'Utah Valley University-2023 - 2027',
    title: 'B.S. Interaction Design — Utah Valley University',
  })
})
