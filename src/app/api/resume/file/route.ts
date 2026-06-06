import { readFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import {
  getResumeFilePath,
  getResumeFileResponseHeaders,
  shouldDownloadResumeFile,
} from '@/lib/resume-file'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  let fileBuffer: Buffer
  try {
    fileBuffer = await readFile(getResumeFilePath())
  } catch {
    return NextResponse.json({ error: 'Resume file not found.' }, { status: 404 })
  }

  const download = shouldDownloadResumeFile(request.nextUrl.searchParams)

  return new NextResponse(new Uint8Array(fileBuffer), {
    status: 200,
    headers: getResumeFileResponseHeaders(download),
  })
}
