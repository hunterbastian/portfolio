import { readFile } from 'fs/promises'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'

const RESUME_FILE_NAME = 'Hunter Bastian Resume.pdf'
const RESUME_FILE_PATH = path.join(process.cwd(), 'private', 'resume', RESUME_FILE_NAME)

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  let fileBuffer: Buffer
  try {
    fileBuffer = await readFile(RESUME_FILE_PATH)
  } catch {
    return NextResponse.json({ error: 'Resume file not found.' }, { status: 404 })
  }

  const download = request.nextUrl.searchParams.get('download') === '1'
  const dispositionType = download ? 'attachment' : 'inline'

  return new NextResponse(new Uint8Array(fileBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${dispositionType}; filename="Hunter_Bastian_Resume.pdf"`,
      'Cache-Control': 'private, no-store, max-age=0',
    },
  })
}
