import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('homepage philosophy beat appears after the hero and before projects', () => {
 const source = readFileSync(new URL('../components/AnimatedHomePage.tsx', import.meta.url), 'utf8')
 assert.equal(source.split('<HomePhilosophySection').length - 1, 1)
 assert.ok(source.indexOf('<HomeHeroSection') < source.indexOf('<HomePhilosophySection'))
 assert.ok(source.indexOf('<HomePhilosophySection') < source.indexOf('<HomeProjectsSection'))
})

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

test('homepage uses a short background timeline instead of resume lists', () => {
 const source = readFileSync(new URL('../components/AnimatedHomePage.tsx', import.meta.url), 'utf8')
 assert.equal(source.split('<HomeBackgroundSection').length - 1, 1)
 assert.equal(source.includes('<HomeExperienceSection'), false)
 assert.equal(source.includes('<HomeEducationSection'), false)
 assert.ok(source.indexOf('<HomePlaygroundSection') < source.indexOf('<HomeBackgroundSection'))
 assert.equal(source.includes('<HomeContactSection'), false)
})

test('homepage contact lives in the hero top instead of a separate section', () => {
 const home = readFileSync(new URL('../components/AnimatedHomePage.tsx', import.meta.url), 'utf8')
 const hero = readFileSync(new URL('../components/home/HomeHeroSection.tsx', import.meta.url), 'utf8')
 assert.equal(home.includes('<HomeContactSection'), false)
 assert.match(hero, /id="contact"/)
 assert.match(hero, /ContactLinks/)
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
 assert.match(source, /If you have a project in mind, email me/)
})
