import { describe, expect, it } from 'vitest'
import { resolveAuthRedirect, safeFrom } from '../redirect'

describe('safeFrom', () => {
  it('keeps same-origin paths', () => {
    expect(safeFrom('/dashboard?tab=bookings')).toBe('/dashboard?tab=bookings')
  })

  it.each(['//evil.com', 'https://evil.com', '/\\evil.com', 'dashboard', '', '/\t/evil.com', '/\n/evil.com', '/\r//evil.com'])('rejects %j', (from) => {
    expect(safeFrom(from)).toBe('/dashboard')
  })

  it('defaults null to the dashboard', () => {
    expect(safeFrom(null)).toBe('/dashboard')
  })
})

describe('resolveAuthRedirect', () => {
  it('sends a logged-out visitor from the dashboard to login', () => {
    expect(resolveAuthRedirect('/dashboard', '', false)).toBe('/login?from=%2Fdashboard')
  })

  it('keeps the query string in from', () => {
    expect(resolveAuthRedirect('/dashboard', '?tab=bookings', false)).toBe('/login?from=%2Fdashboard%3Ftab%3Dbookings')
  })

  it('sends a logged-in visitor away from login', () => {
    expect(resolveAuthRedirect('/login', '', true)).toBe('/dashboard')
  })

  it('lets a logged-out visitor see login', () => {
    expect(resolveAuthRedirect('/login', '', false)).toBeNull()
  })

  it('lets a logged-in visitor see the dashboard', () => {
    expect(resolveAuthRedirect('/dashboard', '', true)).toBeNull()
  })
})
