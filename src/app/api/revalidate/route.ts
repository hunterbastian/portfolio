import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

interface RevalidateBody {
  path?: string
  secret?: string
}

const ALLOWED_REVALIDATE_PATHS = [
  '/',
  '/about',
  '/archive',
  '/cv',
  '/logo',
  '/opengraph-image',
  '/robots.txt',
  '/sitemap.xml',
]

function isAllowedRevalidatePath(path: string): boolean {
  return ALLOWED_REVALIDATE_PATHS.includes(path) || /^\/projects\/[a-z0-9-]+(?:\/opengraph-image)?$/.test(path)
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

  if (!isAllowedRevalidatePath(path)) {
    return NextResponse.json(
      { error: 'Path is not allowed for revalidation.' },
      { status: 400 },
    )
  }

  revalidatePath(path)

  return NextResponse.json({ revalidated: true, path })
}
