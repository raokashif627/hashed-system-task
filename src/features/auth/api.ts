import { reqres } from '@/lib/axios'
import { IncorrectPasswordError } from './errors'
import type { LoginValues } from './schema'

export const DEMO_PASSWORD = 'cityslicka'

export interface ReqresUser {
  id: number
  email: string
  first_name: string
  last_name: string
  avatar: string
}

export async function login(values: LoginValues): Promise<string> {
  const { data } = await reqres.post<{ token: string }>('/login', values)
  if (values.password !== DEMO_PASSWORD) throw new IncorrectPasswordError()
  return data.token
}

export async function getUserByEmail(email: string): Promise<ReqresUser | null> {
  const { data } = await reqres.get<{ data: ReqresUser[] }>('/users', { params: { per_page: 12 } })
  return data.data.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null
}
