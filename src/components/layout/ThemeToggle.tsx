'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useHydrated } from '@/hooks/useHydrated'
import { cn } from '@/lib/cn'

export function ThemeToggle({ className, withLabel = false }: { className?: string; withLabel?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme()
  const hydrated = useHydrated()
  const dark = hydrated && resolvedTheme === 'dark'
  const label = dark ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={withLabel ? undefined : label}
      className={cn('inline-flex cursor-pointer items-center gap-2 transition-colors', className)}
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      {withLabel && <span>{dark ? 'Light mode' : 'Dark mode'}</span>}
    </button>
  )
}
