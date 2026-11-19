import { Skeleton } from '@/components/ui/Skeleton'

export function VenueCardSkeleton() {
  return (
    <div data-testid="venue-card-skeleton" className="flex h-[419px] w-full flex-col overflow-hidden rounded-card border border-line bg-surface">
      <Skeleton className="h-[187px] rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-[15px]">
        <Skeleton className="h-5 w-11/12" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-14 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-line pt-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-24 rounded-btn" />
        </div>
      </div>
    </div>
  )
}
