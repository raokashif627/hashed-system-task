import { Skeleton } from '@/components/ui/Skeleton'
import { VenueCardSkeleton } from '@/components/venue/VenueCardSkeleton'

export function SearchSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading venues" className="min-h-[calc(100dvh-88px)]">
      <div className="h-[60px] border-b border-line" />
      <div className="flex gap-6 overflow-hidden border-b border-line px-4 py-4 md:px-[30px]">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-12 w-16 shrink-0" />
        ))}
      </div>
      <div className="px-4 pt-5 md:px-[30px]">
        <Skeleton className="h-5 w-48" />
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 lg:w-[calc(100%-min(40%,560px))]">
          {Array.from({ length: 6 }, (_, i) => (
            <VenueCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
