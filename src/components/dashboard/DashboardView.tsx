'use client'

import { LogOut } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { Tabs } from '@/components/ui/Tabs'
import { useCurrentUser, useLogout } from '@/features/auth/hooks'
import { useBookings } from '@/features/bookings/hooks'
import { splitBookings } from '@/features/bookings/split'
import { useSavedStore } from '@/features/saved/store'
import { useHydrated } from '@/hooks/useHydrated'
import { todayISO } from '@/lib/format'
import { BookingsPanel } from './BookingsPanel'
import { ProfileCard } from './ProfileCard'
import { SavedVenues } from './SavedVenues'

type TabId = 'saved' | 'bookings'

export function DashboardView() {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()
  const tab: TabId = sp.get('tab') === 'bookings' ? 'bookings' : 'saved'
  const hydrated = useHydrated()
  const me = useCurrentUser()
  const logout = useLogout()
  const savedCount = useSavedStore((s) => s.ids.length)
  const { data: bookings } = useBookings()
  const upcomingCount = bookings ? splitBookings(bookings, todayISO()).upcoming.length : undefined

  function setTab(next: string) {
    const params = new URLSearchParams(sp.toString())
    params.set('tab', next)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const count = (n: number | undefined) =>
    n === undefined ? null : <span className="ml-1.5 rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-600 dark:bg-brand-500/15">{n}</span>

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 py-8 md:px-8 lg:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Dashboard</p>
          <h1 className="mt-1 text-[28px] leading-9 font-semibold text-ink md:text-4xl">
            {me.data ? `Hi, ${me.data.first_name}` : me.isPending && me.fetchStatus !== 'idle' ? <Skeleton className="h-9 w-40" /> : 'Welcome back'}
          </h1>
        </div>
        <Button variant="outline" onClick={logout}>
          <LogOut className="size-4" /> Log out
        </Button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <ProfileCard user={me.data} loading={me.isPending && me.fetchStatus !== 'idle'} error={me.isError} onRetry={() => me.refetch()} />
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-card bg-[linear-gradient(135deg,#ff5037_0%,#ff7a45_100%)] p-4 text-white">
              <p className="text-2xl font-bold">{hydrated ? savedCount : '–'}</p>
              <p className="text-xs">Saved venues</p>
            </div>
            <div className="rounded-card bg-accent p-4 text-night">
              <p className="text-2xl font-bold">{upcomingCount ?? '–'}</p>
              <p className="text-xs">Upcoming bookings</p>
            </div>
          </div>
        </aside>

        <section aria-label="Your activity" className="min-w-0">
          <Tabs
            label="Dashboard sections"
            variant="underline"
            value={tab}
            onChange={setTab}
            tabs={[
              { id: 'saved', label: <>Saved venues{hydrated && count(savedCount)}</> },
              { id: 'bookings', label: <>My bookings{count(upcomingCount)}</> },
            ]}
          />
          <div className="mt-6 animate-fade-in" key={tab}>
            {tab === 'saved' ? <SavedVenues /> : <BookingsPanel />}
          </div>
        </section>
      </div>
    </main>
  )
}
