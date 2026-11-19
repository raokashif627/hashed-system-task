'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { toast } from 'sonner'
import { getUserByEmail, login } from './api'
import { isServiceFailure, loginErrorMessage } from './errors'
import { safeFrom } from './redirect'
import type { LoginValues } from './schema'
import { useAuthStore } from './store'

export function useLogin() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const setSession = useAuthStore((s) => s.setSession)

  return useMutation({
    mutationFn: (values: LoginValues) => login(values),
    onSuccess: (token, values) => {
      setSession(token, values.email.trim().toLowerCase())
      toast.success('Welcome back!')
      router.replace(safeFrom(searchParams.get('from')))
    },
    onError: (err) => {
      if (isServiceFailure(err)) toast.error(loginErrorMessage(err))
    },
  })
}

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const logout = useAuthStore((s) => s.logout)

  return useCallback(() => {
    logout()
    queryClient.removeQueries({ queryKey: ['me'] })
    toast('Logged out')
    router.replace('/')
  }, [logout, queryClient, router])
}

export function useCurrentUser() {
  const email = useAuthStore((s) => s.email)
  return useQuery({
    queryKey: ['me', email],
    queryFn: () => getUserByEmail(email as string),
    enabled: Boolean(email),
    staleTime: Infinity,
  })
}
