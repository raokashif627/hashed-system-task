import { Bookmark, CalendarX } from 'lucide-react'
import Image from 'next/image'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface EmptyStateProps {
  illustration?: 'search' | 'saved' | 'bookings'
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ illustration = 'search', title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center px-4 py-12 text-center', className)}>
      {illustration === 'search' ? (
        <Image src="/images/empty/search.png" alt="" width={200} height={150} priority={false} />
      ) : (
        <div className="flex size-24 items-center justify-center rounded-full bg-brand-50 text-brand-500 dark:bg-brand-500/15">
          {illustration === 'saved' ? <Bookmark className="size-10" /> : <CalendarX className="size-10" />}
        </div>
      )}
      <h3 className="mt-6 max-w-[252px] text-[15px] leading-4 font-medium text-ink">{title}</h3>
      <p className="mt-[5px] max-w-[252px] text-[13px] leading-4 text-[#616161] dark:text-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
