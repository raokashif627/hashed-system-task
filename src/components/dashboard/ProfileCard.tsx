import { BadgeCheck, Mail } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import type { ReqresUser } from '@/features/auth/api'

interface ProfileCardProps {
  user: ReqresUser | null | undefined
  loading: boolean
  error: boolean
  onRetry: () => void
}

export function ProfileCard({ user, loading, error, onRetry }: ProfileCardProps) {
  return (
    <section aria-label="Profile" className="rounded-card border border-line bg-surface p-6 shadow-card">
      {loading ? (
        <div className="flex items-center gap-4">
          <Skeleton className="size-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ) : error ? (
        <div className="text-center">
          <p className="font-medium text-ink">Couldn&apos;t load your profile</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
            Retry
          </Button>
        </div>
      ) : user ? (
        <div className="flex items-center gap-4">
          <Image src={user.avatar} alt="" width={64} height={64} className="size-16 rounded-full object-cover ring-4 ring-brand-100" />
          <div className="min-w-0">
            <p className="text-lg font-semibold text-ink">
              {user.first_name} {user.last_name}
            </p>
            <p className="flex items-center gap-1.5 truncate text-sm text-body">
              <Mail className="size-3.5" />
              {user.email}
            </p>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-600 dark:bg-brand-500/15">
              <BadgeCheck className="size-3.5" /> Venuze member
            </span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-body">Signed in. Profile details are not available for this demo account.</p>
      )}
    </section>
  )
}
