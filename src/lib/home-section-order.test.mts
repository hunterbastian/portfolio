import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('studio section appears once before projects', () => {
 const source = readFileSync(new URL('../components/AnimatedHomePage.tsx', import.meta.url), 'utf8')
 assert.equal(source.split('<HomeEndeavorsSection').length - 1, 1)
 assert.ok(source.indexOf('<HomeEndeavorsSection') < source.indexOf('<HomeProjectsSection'))
 assert.ok(source.indexOf('<HomeProjectsSection') < source.indexOf('<HomePlaygroundSection'))
})
