import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('studio section appears once before projects', () => {
 const source = readFileSync(new URL('../components/AnimatedHomePage.tsx', import.meta.url), 'utf8')
 assert.equal(source.split('<HomeEndeavorsSection').length - 1, 1)
 assert.ok(source.indexOf('<HomeEndeavorsSection') < source.indexOf('<HomeProjectsSection'))
 assert.ok(source.indexOf('<HomeProjectsSection') < source.indexOf('<HomePlaygroundSection'))
})

test('homepage uses a short background timeline instead of resume lists', () => {
 const source = readFileSync(new URL('../components/AnimatedHomePage.tsx', import.meta.url), 'utf8')
 assert.equal(source.split('<HomeBackgroundSection').length - 1, 1)
 assert.equal(source.includes('<HomeExperienceSection'), false)
 assert.equal(source.includes('<HomeEducationSection'), false)
 assert.ok(source.indexOf('<HomePlaygroundSection') < source.indexOf('<HomeBackgroundSection'))
 assert.ok(source.indexOf('<HomeBackgroundSection') < source.indexOf('<HomeContactSection'))
})

test('homepage contact config keeps secondary social URLs without featuring them', () => {
 const source = readFileSync(new URL('../content/homepage.ts', import.meta.url), 'utf8')
 const contactStart = source.indexOf('export const contactSocialLinks')
 const featuredStart = source.indexOf('export const homepageContactSocialLabels')
 const contactBlock = source.slice(contactStart, featuredStart)

 assert.ok(contactBlock.includes("label: 'Email'"))
 assert.ok(contactBlock.includes("label: 'LinkedIn'"))
 assert.ok(contactBlock.includes("label: 'Instagram'"))
 assert.ok(contactBlock.includes("label: 'X'"))
 assert.ok(contactBlock.includes("label: 'GitHub'"))
 assert.ok(contactBlock.includes("label: 'YouTube'"))
 assert.match(source, /export const homepageContactSocialLabels = \['LinkedIn', 'GitHub'\]/)
})
