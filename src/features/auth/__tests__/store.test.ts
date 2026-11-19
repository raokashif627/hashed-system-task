import Cookies from 'js-cookie'
import { beforeEach, describe, expect, it } from 'vitest'
import { useAuthStore } from '../store'

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
    localStorage.clear()
    Cookies.remove('venuze_token')
  })

  it('setSession stores the session and mirrors the cookie', () => {
    useAuthStore.getState().setSession('t', 'e@x.com')
    expect(useAuthStore.getState().token).toBe('t')
    expect(useAuthStore.getState().email).toBe('e@x.com')
    expect(Cookies.get('venuze_token')).toBe('t')
  })

  it('logout clears the session and the cookie', () => {
    useAuthStore.getState().setSession('t', 'e@x.com')
    useAuthStore.getState().logout()
    expect(useAuthStore.getState().token).toBeNull()
    expect(useAuthStore.getState().email).toBeNull()
    expect(Cookies.get('venuze_token')).toBeUndefined()
  })

  it('drops a stray cookie when the stored session has no token', async () => {
    Cookies.set('venuze_token', 'orphan')
    localStorage.removeItem('venuze-auth')
    await useAuthStore.persist.rehydrate()
    expect(useAuthStore.getState().token).toBeNull()
    expect(Cookies.get('venuze_token')).toBeUndefined()
  })

  it('re-mirrors the cookie when rehydrating a stored token', async () => {
    localStorage.setItem('venuze-auth', JSON.stringify({ state: { token: 'stored', email: 'e@x.com' }, version: 0 }))
    await useAuthStore.persist.rehydrate()
    expect(useAuthStore.getState().token).toBe('stored')
    expect(Cookies.get('venuze_token')).toBe('stored')
  })
})
