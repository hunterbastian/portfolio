import { NextRequest, NextResponse } from 'next/server'
import { getResumePassword, RESUME_COOKIE_NAME, verifyResumeAccessToken } from '@/lib/resumeAuth'

export async function GET(request: NextRequest) {
  const resumePassword = getResumePassword()
  if (!resumePassword) {
    return NextResponse.json({ configured: false, unlocked: false })
  }

  const token = request.cookies.get(RESUME_COOKIE_NAME)?.value
  const unlocked = verifyResumeAccessToken(token, resumePassword)

  return NextResponse.json({ configured: true, unlocked })
}
