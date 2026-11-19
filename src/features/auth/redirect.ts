const DEFAULT_AFTER_LOGIN = '/dashboard'
const PROBE_ORIGIN = 'http://venuze.local'

export function safeFrom(from: string | null): string {
  if (!from || !from.startsWith('/') || /[\u0000-\u001f\\]/.test(from)) return DEFAULT_AFTER_LOGIN
  try {
    const url = new URL(from, PROBE_ORIGIN)
    if (url.origin !== PROBE_ORIGIN) return DEFAULT_AFTER_LOGIN
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return DEFAULT_AFTER_LOGIN
  }
}

export function resolveAuthRedirect(pathname: string, search: string, hasToken: boolean): string | null {
  const isProtected = pathname === '/dashboard' || pathname.startsWith('/dashboard/')
  if (isProtected && !hasToken) return `/login?from=${encodeURIComponent(pathname + search)}`
  if (pathname === '/login' && hasToken) return DEFAULT_AFTER_LOGIN
  return null
}
