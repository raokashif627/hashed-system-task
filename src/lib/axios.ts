import axios from 'axios'

export const REQRES_API_KEY = process.env.NEXT_PUBLIC_REQRES_API_KEY ?? 'reqres-free-v1'

export const reqres = axios.create({
  baseURL: 'https://reqres.in/api',
  headers: { 'x-api-key': REQRES_API_KEY },
  timeout: 15_000,
})
