'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Info } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { loginErrorMessage } from '@/features/auth/errors'
import { useLogin } from '@/features/auth/hooks'
import { safeFrom } from '@/features/auth/redirect'
import { loginSchema, type LoginValues } from '@/features/auth/schema'
import { useAuthStore } from '@/features/auth/store'
import { useHydrated } from '@/hooks/useHydrated'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const login = useLogin()
  const router = useRouter()
  const searchParams = useSearchParams()
  const hydrated = useHydrated()
  const token = useAuthStore((s) => s.token)
  const alreadySignedIn = hydrated && Boolean(token) && !login.isSuccess

  useEffect(() => {
    if (alreadySignedIn) router.replace(safeFrom(searchParams.get('from')))
  }, [alreadySignedIn, router, searchParams])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } })

  return (
    <form onSubmit={handleSubmit((values) => login.mutate(values))} noValidate className="space-y-5">
      {login.isError && (
        <div role="alert" className="rounded-btn border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {loginErrorMessage(login.error)}
        </div>
      )}
      <Input label="Email" type="email" autoComplete="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
      <Input
        label="Password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        placeholder="••••••••"
        error={errors.password?.message}
        trailing={
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="cursor-pointer rounded-full p-2 text-muted hover:bg-surface-alt hover:text-ink"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        }
        {...register('password')}
      />
      <Button type="submit" size="lg" className="w-full" loading={login.isPending}>
        Log in
      </Button>
      <p className="flex items-start gap-2 rounded-btn bg-brand-50 px-4 py-3 text-xs leading-5 text-brand-800 dark:bg-brand-500/10 dark:text-brand-200">
        <Info className="mt-0.5 size-4 shrink-0" />
        <span>
          Demo account: <strong>eve.holt@reqres.in</strong> · password <strong>cityslicka</strong>
        </span>
      </p>
    </form>
  )
}
