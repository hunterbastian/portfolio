import { NextResponse } from 'next/server'
import {
  createResumeAccessToken,
  getResumePassword,
  RESUME_COOKIE_MAX_AGE_SECONDS,
  RESUME_COOKIE_NAME,
} from '@/lib/resumeAuth'

interface UnlockRequestBody {
  password?: string
}

export async function POST(request: Request) {
  const resumePassword = getResumePassword()
  if (!resumePassword) {
    return NextResponse.json(
      { error: 'Resume password is not configured on the server.' },
      { status: 503 }
    )
  }

  let body: UnlockRequestBody
  try {
    body = (await request.json()) as UnlockRequestBody
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const submittedPassword = body.password?.trim()
  if (!submittedPassword) {
    return NextResponse.json({ error: 'Password is required.' }, { status: 400 })
  }

  if (submittedPassword !== resumePassword) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
  }

  const token = createResumeAccessToken(resumePassword)
  const response = NextResponse.json({ unlocked: true })
  response.cookies.set({
    name: RESUME_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: RESUME_COOKIE_MAX_AGE_SECONDS,
  })

  return response
}
