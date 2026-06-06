import assert from 'node:assert/strict'
import test from 'node:test'

import { SITE_PERSON_KNOWS_ABOUT, SITE_PERSON_SAME_AS, getSiteStructuredData } from './structured-data.ts'

test('getSiteStructuredData builds person and organization schema from site config', () => {
  const structuredData = getSiteStructuredData({
    personName: 'Hunter Bastian',
    siteDescription: 'Design engineer portfolio.',
    studioName: 'Studio Alpine',
    url: 'https://hunterbastian.com',
  })
  const [person, organization] = structuredData['@graph']

  assert.equal(structuredData['@context'], 'https://schema.org')
  assert.equal(person?.['@type'], 'Person')
  assert.equal(person?.['@id'], 'https://hunterbastian.com/#person')
  assert.equal(person?.name, 'Hunter Bastian')
  assert.equal(person?.jobTitle, 'Design Engineer')
  assert.deepEqual(person?.sameAs, SITE_PERSON_SAME_AS)
  assert.deepEqual(person?.knowsAbout, SITE_PERSON_KNOWS_ABOUT)

  assert.equal(organization?.['@type'], 'Organization')
  assert.equal(organization?.['@id'], 'https://hunterbastian.com/#organization')
  assert.equal(organization?.name, 'Studio Alpine')
  assert.equal(organization?.logo, 'https://hunterbastian.com/images/optimized/studio-alpine-logo.webp')
  assert.deepEqual(organization?.founder, { '@id': 'https://hunterbastian.com/#person' })
})

test('getSiteStructuredData defaults to the production site config', () => {
  const structuredData = getSiteStructuredData()

  assert.equal(structuredData['@graph'][0]?.name, 'Hunter Bastian')
  assert.equal(structuredData['@graph'][1]?.description, 'Photography and design studio founded by Hunter Bastian.')
})
