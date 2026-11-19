import type { InternalAxiosRequestConfig } from 'axios'
import { describe, expect, it } from 'vitest'
import { useAuthStore } from '@/features/auth/store'
import { reqres } from '../axios'

describe('reqres client', () => {
  it('sends the API key but never a bearer token, which reqres rejects with 401', async () => {
    useAuthStore.setState({ token: 'QpwL5tke4Pnpja7X4', email: 'eve.holt@reqres.in' })
    let seen: InternalAxiosRequestConfig | undefined
    await reqres.get('/users', {
      adapter: async (config) => {
        seen = config
        return { data: { data: [] }, status: 200, statusText: 'OK', headers: {}, config }
      },
    })
    expect(seen?.headers['x-api-key']).toBeTruthy()
    expect(seen?.headers.Authorization).toBeUndefined()
  })

  it('keeps the session when reqres answers 401', async () => {
    useAuthStore.setState({ token: 't', email: 'e@x.com' })
    await reqres
      .get('/users', {
        adapter: async (config) => {
          const err = Object.assign(new Error('Unauthorized'), {
            isAxiosError: true,
            config,
            response: { status: 401, data: {}, headers: {}, statusText: '', config },
          })
          throw err
        },
      })
      .catch(() => undefined)
    expect(useAuthStore.getState().token).toBe('t')
  })
})
