'use client'

import { toast } from 'sonner'
import { useIsSaved } from '@/features/saved/store'
import { useToggleSaved } from '@/features/saved/useToggleSaved'
import type { Venue } from '@/features/venues/types'
import { cn } from '@/lib/cn'
import { formatCapacity, formatPrice, formatSqft } from '@/lib/format'
import { ImageCarousel } from './ImageCarousel'

interface VenueCardProps {
  venue: Venue
  onOpen: (id: string) => void
  className?: string
}

function Pill({ icon, children }: { icon?: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex h-7 items-center gap-[5px] rounded-full bg-chip px-[7px] text-[10px] leading-6 font-medium text-chip-text">
      {icon && <img src={icon} alt="" className="size-[14px] dark:invert" />}
      {children}
    </span>
  )
}

export function VenueCard({ venue, onOpen, className }: VenueCardProps) {
  const saved = useIsSaved(venue.id)
  const toggleSaved = useToggleSaved()
  const extra = Math.max(venue.amenities.length - 1, 0) + venue.occasions.length

  async function share() {
    const url = `${window.location.origin}/search?venue=${venue.id}`
    try {
      if (navigator.share) await navigator.share({ title: venue.title, url })
      else {
        await navigator.clipboard.writeText(url)
        toast.success('Link copied')
      }
    } catch {
      return
    }
  }

  return (
    <article
      className={cn(
        'group/card flex h-[419px] w-full flex-col overflow-hidden rounded-card bg-surface transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)]',
        className,
      )}
    >
      <div className="relative h-[187px] shrink-0 cursor-pointer bg-[#e4e4e4]" onClick={() => onOpen(venue.id)}>
        <ImageCarousel images={venue.images} alt={venue.title} sizes="(min-width: 1280px) 300px, (min-width: 768px) 45vw, 92vw" className="size-full" />
        {venue.verified && (
          <span className="absolute top-[9px] left-2.5 flex h-[30px] items-center rounded-full bg-black/50 px-[15px] text-[11px] font-semibold tracking-[-0.33px] text-white backdrop-blur-[2px]">
            Verified
          </span>
        )}
        <div className="absolute top-[9px] right-2.5 flex gap-[3px]">
          <button
            type="button"
            aria-label="Share"
            onClick={(e) => {
              e.stopPropagation()
              share()
            }}
            className="flex size-[30px] cursor-pointer items-center justify-center rounded-full bg-black/50 backdrop-blur-[2px] transition-colors hover:bg-black/70"
          >
            <img src="/images/card/share.svg" alt="" className="size-[15px]" />
          </button>
          <button
            type="button"
            aria-label={saved ? `Unsave ${venue.title}` : `Save ${venue.title}`}
            aria-pressed={saved}
            onClick={(e) => {
              e.stopPropagation()
              toggleSaved(venue)
            }}
            className={cn(
              'flex size-[30px] cursor-pointer items-center justify-center rounded-full backdrop-blur-[2px] transition-[background-color,transform] active:scale-90',
              saved ? 'bg-brand-500' : 'bg-black/50 hover:bg-black/70',
            )}
          >
            <svg viewBox="0 0 24 24" className="size-[16px]" aria-hidden>
              <path
                d="M12 20.5s-7.5-4.6-9.6-9.3C.9 7.7 3.1 4 6.8 4c2.1 0 3.8 1.2 5.2 3 1.4-1.8 3.1-3 5.2-3 3.7 0 5.9 3.7 4.4 7.2-2.1 4.7-9.6 9.3-9.6 9.3z"
                fill={saved ? 'white' : 'none'}
                stroke="white"
                strokeWidth="1.8"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col rounded-b-card border border-t-0 border-line bg-surface px-[15px] pt-[13px] pb-[15px] shadow-card">
        <h3 className="line-clamp-2 min-h-12 text-base leading-6 font-semibold text-ink">
          <button type="button" onClick={() => onOpen(venue.id)} className="cursor-pointer text-left hover:text-brand-500">
            {venue.title}
          </button>
        </h3>
        <p className="mt-2 flex items-center gap-[4.5px] text-sm font-medium text-brand-500">
          <img src="/images/card/location.svg" alt="" className="size-[18px]" />
          <span className="truncate">
            {venue.area}, {venue.city}
          </span>
        </p>
        <div className="mt-3 flex flex-wrap gap-[5px]">
          <Pill icon="/images/card/capacity.svg">{formatCapacity(venue.capacity)}</Pill>
          <Pill icon="/images/card/size.svg">{formatSqft(venue.sizeSqft)}</Pill>
          <Pill icon="/images/card/parking.svg">{venue.amenities[0]}</Pill>
          {extra > 0 && <Pill>+{extra} more</Pill>}
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-line pt-[10px]">
          <p className="text-xs text-ink">
            <span>From</span> <span className="font-semibold">{formatPrice(venue.pricePerHour)}/hour</span>
          </p>
          <button
            type="button"
            onClick={() => onOpen(venue.id)}
            className="h-8 cursor-pointer rounded-btn border border-brand-500 bg-surface px-[15px] text-[11px] font-medium tracking-[-0.33px] text-brand-500 transition-colors duration-200 hover:bg-brand-500 hover:text-white"
          >
            View details
          </button>
        </div>
      </div>
    </article>
  )
}
