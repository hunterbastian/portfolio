/**
 * Regenerates public/hunter-bastian-resume.pdf from the resume data in
 * src/content/homepage.ts and src/lib/cv-page.ts.
 *
 * Run: npm run generate:resume
 * npm run build runs this first so the downloadable file stays in sync.
 */
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'

import { cvSelectedWork, cvTools, educationItems, experienceItems } from '../src/content/homepage.ts'
import {
  CV_EMAIL_ADDRESS,
  CV_LINKEDIN_URL,
  CV_LOCATION_LABEL,
  CV_PORTFOLIO_LABEL,
  CV_RESUME_PDF_FILENAME,
  formatCvEducationDetail,
  getCvEntryDate,
  getCvEntryDetail,
} from '../src/lib/cv-page.ts'
import { HOME_SHOWCASE_ROLE } from '../src/lib/home-showcase.ts'
import { siteConfig } from '../src/lib/site.ts'

const PAGE_WIDTH = 612
const PAGE_HEIGHT = 792
const MARGIN = 40
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2
const INK = rgb(0.08, 0.08, 0.07)
const MUTED = rgb(0.33, 0.32, 0.3)
const RULE = rgb(0.82, 0.81, 0.78)
const FIXED_DATE = new Date('2026-01-01T00:00:00.000Z')

export function toPdfText(value: string) {
  return value
    .replaceAll('’', "'")
    .replaceAll('‘', "'")
    .replaceAll('“', '"')
    .replaceAll('”', '"')
    .replaceAll('–', '-')
    .replaceAll('—', '-')
    .replaceAll('↗︎', '')
    .replaceAll('↗', '')
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const words = toPdfText(text).split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ''

  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (font.widthOfTextAtSize(next, size) > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }

  if (line) lines.push(line)
  return lines.length > 0 ? lines : ['']
}

interface PdfCursor {
  page: PDFPage
  y: number
}

function drawLines(
  cursor: PdfCursor,
  lines: string[],
  font: PDFFont,
  size: number,
  color: ReturnType<typeof rgb>,
  x = MARGIN,
  leading = size + 2,
) {
  for (const line of lines) {
    cursor.page.drawText(line, { x, y: cursor.y - size, size, font, color })
    cursor.y -= leading
  }
}

function drawRule(cursor: PdfCursor) {
  cursor.y -= 4
  cursor.page.drawLine({
    start: { x: MARGIN, y: cursor.y },
    end: { x: PAGE_WIDTH - MARGIN, y: cursor.y },
    thickness: 0.6,
    color: RULE,
  })
  cursor.y -= 8
}

function drawSection(cursor: PdfCursor, title: string, font: PDFFont) {
  cursor.y -= 8
  drawLines(cursor, [title.toUpperCase()], font, 8, MUTED, MARGIN, 12)
  drawRule(cursor)
}

export async function renderResumePdf() {
  const doc = await PDFDocument.create()
  doc.setTitle(`${siteConfig.personName} resume`)
  doc.setAuthor(siteConfig.personName)
  doc.setCreationDate(FIXED_DATE)
  doc.setModificationDate(FIXED_DATE)

  const regular = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)
  const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  const cursor: PdfCursor = { page, y: PAGE_HEIGHT - MARGIN }

  drawLines(cursor, [siteConfig.personName], bold, 16, INK, MARGIN, 20)
  drawLines(cursor, [`${HOME_SHOWCASE_ROLE}  ·  ${CV_LOCATION_LABEL}`], regular, 9, MUTED, MARGIN, 13)
  drawLines(
    cursor,
    [`${CV_EMAIL_ADDRESS}  ·  ${CV_PORTFOLIO_LABEL}  ·  ${CV_LINKEDIN_URL.replace('https://', '')}`],
    regular,
    8,
    MUTED,
    MARGIN,
    12,
  )

  drawSection(cursor, 'Experience', bold)
  for (const item of experienceItems) {
    const date = getCvEntryDate(item.year)
    const title = `${item.company} · ${item.title}`
    const titleWidth = bold.widthOfTextAtSize(toPdfText(title), 9)
    const dateWidth = date ? regular.widthOfTextAtSize(toPdfText(date), 8) : 0
    if (titleWidth + dateWidth + 12 < CONTENT_WIDTH) {
      cursor.page.drawText(toPdfText(title), { x: MARGIN, y: cursor.y - 9, size: 9, font: bold, color: INK })
      if (date) {
        cursor.page.drawText(toPdfText(date), {
          x: PAGE_WIDTH - MARGIN - dateWidth,
          y: cursor.y - 8,
          size: 8,
          font: regular,
          color: MUTED,
        })
      }
      cursor.y -= 12
    } else {
      drawLines(cursor, wrapText(title, bold, 9, CONTENT_WIDTH), bold, 9, INK)
      if (date) drawLines(cursor, [date], regular, 8, MUTED)
    }
    const detail = getCvEntryDetail(item.description)
    if (detail) drawLines(cursor, wrapText(detail, regular, 8, CONTENT_WIDTH), regular, 8, MUTED, MARGIN, 10)
    cursor.y -= 4
  }

  drawSection(cursor, 'Selected work', bold)
  for (const item of cvSelectedWork) {
    drawLines(cursor, wrapText(item.title, bold, 9, CONTENT_WIDTH), bold, 9, INK)
    drawLines(cursor, wrapText(item.summary, regular, 8, CONTENT_WIDTH), regular, 8, MUTED, MARGIN, 10)
    cursor.y -= 3
  }

  drawSection(cursor, 'Education', bold)
  for (const item of educationItems) {
    const date = getCvEntryDate(item.year)
    const title = `${item.institution} · ${item.degree}`
    const dateWidth = date ? regular.widthOfTextAtSize(toPdfText(date), 8) : 0
    cursor.page.drawText(toPdfText(title), { x: MARGIN, y: cursor.y - 9, size: 9, font: bold, color: INK })
    if (date) {
      cursor.page.drawText(toPdfText(date), {
        x: PAGE_WIDTH - MARGIN - dateWidth,
        y: cursor.y - 8,
        size: 8,
        font: regular,
        color: MUTED,
      })
    }
    cursor.y -= 12
    drawLines(cursor, wrapText(formatCvEducationDetail(item), regular, 8, CONTENT_WIDTH), regular, 8, MUTED, MARGIN, 10)
    cursor.y -= 2
  }

  drawSection(cursor, 'Tools', bold)
  drawLines(cursor, wrapText(cvTools.join(' · '), regular, 8, CONTENT_WIDTH), regular, 8, INK)

  if (cursor.y < MARGIN) {
    throw new Error(`Resume PDF overflowed the page by ${Math.ceil(MARGIN - cursor.y)}pt`)
  }

  return doc.save()
}

export async function writeResumePdf(destination = path.join(process.cwd(), 'public', CV_RESUME_PDF_FILENAME)) {
  const bytes = await renderResumePdf()
  writeFileSync(destination, bytes)
  return destination
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href
if (isDirectRun) {
  const destination = await writeResumePdf()
  console.log(`Wrote ${destination}`)
}
