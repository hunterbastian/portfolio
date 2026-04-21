import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

interface RevalidateBody {
  path?: string
  secret?: string
}

export async function POST(request: Request) {
  const expectedSecret = process.env.REVALIDATE_SECRET
  if (!expectedSecret) {
    return NextResponse.json(
      { error: 'REVALIDATE_SECRET not configured.' },
      { status: 503 },
    )
  }

  let body: RevalidateBody
  try {
    body = (await request.json()) as RevalidateBody
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (body.secret !== expectedSecret) {
    return NextResponse.json({ error: 'Invalid secret.' }, { status: 401 })
  }

  const path = body.path?.trim()
  if (!path || !path.startsWith('/')) {
    return NextResponse.json(
      { error: 'Path is required and must start with /.' },
      { status: 400 },
    )
  }

  revalidatePath(path)

  return NextResponse.json({ revalidated: true, path })
}
