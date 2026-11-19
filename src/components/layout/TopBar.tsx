'use client'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { useAuthStore } from '@/features/auth/store'
import { useHydrated } from '@/hooks/useHydrated'
import { useScrolled } from '@/hooks/useScrolled'
import { cn } from '@/lib/cn'
import { comingSoon } from '@/lib/coming-soon'
import { CompactSearch } from './CompactSearch'
import { Logo } from './Logo'
import { UserMenu } from './UserMenu'

interface TopBarProps {
  variant: 'overlay' | 'solid'
  showCompactSearch?: boolean
  scrollThreshold?: number
}

const PILL = 'flex h-10 cursor-pointer items-center justify-center gap-2 rounded-btn bg-white text-sm font-semibold text-brand-500 transition-colors hover:bg-brand-50'

export function TopBar({ variant, showCompactSearch = false, scrollThreshold = 520 }: TopBarProps) {
  const hydrated = useHydrated()
  const token = useAuthStore((s) => s.token)
  const scrolled = useScrolled(scrollThreshold)
  const solid = variant === 'solid' || scrolled
  const showSearch = variant === 'overlay' ? scrolled : showCompactSearch

  return (
    <header
      className={cn(
        'inset-x-0 top-0 z-50 h-[88px] transition-[background-color,box-shadow,border-color] duration-300',
        variant === 'overlay' ? 'fixed' : 'sticky',
        solid ? 'border-b border-[#e9e9e9] bg-white shadow-[0_4px_10px_rgba(0,0,0,0.1)] dark:border-line dark:bg-surface' : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-3 px-4 md:px-[14px] lg:px-[25px]">
        <Logo tone={solid ? 'brand' : 'white'} wordmark className={cn(showSearch && 'max-lg:[&>span]:hidden')} />

        {showSearch && (
          <div className="flex min-w-0 flex-1 justify-center">
            <Suspense fallback={null}>
              <CompactSearch />
            </Suspense>
          </div>
        )}

        <nav aria-label="Account" className="flex items-center gap-[11px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">
          <button type="button" onClick={() => comingSoon('Listing your venue')} className={cn(PILL, 'px-4 max-sm:hidden')}>
            Add your listing
            <ChevronDown className="size-4" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            aria-label="Language: English"
            onClick={() => comingSoon('More languages')}
            className={cn(PILL, 'w-16 px-3 max-md:hidden')}
          >
            EN
            <ChevronDown className="size-4" strokeWidth={2.5} />
          </button>
          {!hydrated ? (
            <span aria-hidden className="size-10 rounded-btn bg-white" />
          ) : token ? (
            <UserMenu />
          ) : (
            <Link href="/login" aria-label="Log in" className={cn(PILL, 'w-11')}>
              <img src="/images/icons/user-brand.svg" alt="" width={12} height={17} />
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
