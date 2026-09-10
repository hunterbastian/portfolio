import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('featured projects appear once before studio endeavors', () => {
 const source = readFileSync(new URL('../components/AnimatedHomePage.tsx', import.meta.url), 'utf8')
 assert.equal(source.split('<HomeProjectsSection').length - 1, 1)
 assert.equal(source.split('<HomeEndeavorsSection').length - 1, 1)
 assert.ok(source.indexOf('<HomeProjectsSection') < source.indexOf('<HomeEndeavorsSection'))
 assert.ok(source.indexOf('<HomeEndeavorsSection') < source.indexOf('<HomePlaygroundSection'))
})

test('homepage projects pair named rows with the collage', () => {
 const source = readFileSync(new URL('../components/home/HomeProjectsSection.tsx', import.meta.url), 'utf8')
 assert.ok(source.includes('<FeaturedProjectList'))
 assert.ok(source.includes('<WorkScatterStack'))
 assert.ok(source.includes('decorative'))
 assert.equal(source.includes('showPlaygroundRow'), false)
 assert.ok(source.indexOf('<FeaturedProjectList') < source.indexOf('<WorkScatterStack'))
})
