import Cookies from 'js-cookie'

export const AUTH_COOKIE = 'venuze_token'

export function setAuthCookie(token: string): void {
  Cookies.set(AUTH_COOKIE, token, { path: '/', sameSite: 'Lax', expires: 7 })
}

export function clearAuthCookie(): void {
  Cookies.remove(AUTH_COOKIE, { path: '/' })
}

export function hasAuthCookie(): boolean {
  return Boolean(Cookies.get(AUTH_COOKIE))
}
