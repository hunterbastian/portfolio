import assert from 'node:assert/strict'
import test from 'node:test'

import {
  RESUME_DOWNLOAD_FILE_NAME,
  RESUME_FILE_CACHE_CONTROL,
  RESUME_FILE_CONTENT_TYPE,
  RESUME_SOURCE_FILE_NAME,
  getResumeFileDispositionType,
  getResumeFilePath,
  getResumeFileResponseHeaders,
  shouldDownloadResumeFile,
} from './resume-file.ts'

test('resume file constants preserve source, download, and cache contracts', () => {
  assert.equal(RESUME_SOURCE_FILE_NAME, 'Hunter Bastian Resume.pdf')
  assert.equal(RESUME_DOWNLOAD_FILE_NAME, 'Hunter_Bastian_Resume.pdf')
  assert.equal(RESUME_FILE_CONTENT_TYPE, 'application/pdf')
  assert.equal(RESUME_FILE_CACHE_CONTROL, 'public, max-age=3600, must-revalidate')
})

test('getResumeFilePath resolves the private resume file from the project root', () => {
  assert.equal(
    getResumeFilePath('/site/root'),
    '/site/root/private/resume/Hunter Bastian Resume.pdf',
  )
})

test('resume file download helpers map query and headers consistently', () => {
  assert.equal(shouldDownloadResumeFile(new URLSearchParams('download=1')), true)
  assert.equal(shouldDownloadResumeFile(new URLSearchParams('download=0')), false)
  assert.equal(shouldDownloadResumeFile(new URLSearchParams('')), false)
  assert.equal(getResumeFileDispositionType(true), 'attachment')
  assert.equal(getResumeFileDispositionType(false), 'inline')
  assert.deepEqual(getResumeFileResponseHeaders(true), {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="Hunter_Bastian_Resume.pdf"',
    'Cache-Control': 'public, max-age=3600, must-revalidate',
  })
  assert.deepEqual(getResumeFileResponseHeaders(false), {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="Hunter_Bastian_Resume.pdf"',
    'Cache-Control': 'public, max-age=3600, must-revalidate',
  })
})
