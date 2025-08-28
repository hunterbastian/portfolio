import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Force fresh content for main production domain
  if (request.nextUrl.hostname === 'portfolio-hunterbastians-projects.vercel.app') {
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
    response.headers.set('CDN-Cache-Control', 'public, max-age=60')
    // Add a timestamp to ensure freshness
    response.headers.set('X-Cache-Timestamp', Date.now().toString())
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
