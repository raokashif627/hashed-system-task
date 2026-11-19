import { NextResponse, type NextRequest } from 'next/server'
import { resolveAuthRedirect } from '@/features/auth/redirect'
import { AUTH_COOKIE } from '@/lib/cookies'

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const target = resolveAuthRedirect(pathname, search, req.cookies.has(AUTH_COOKIE))
  return target ? NextResponse.redirect(new URL(target, req.url)) : NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
