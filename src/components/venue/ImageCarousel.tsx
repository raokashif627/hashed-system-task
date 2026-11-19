'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { cn } from '@/lib/cn'

interface ImageCarouselProps {
  images: string[]
  alt: string
  sizes: string
  className?: string
  priority?: boolean
  rounded?: string
}

export function ImageCarousel({ images, alt, sizes, className, priority = false, rounded = '' }: ImageCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  function go(next: number) {
    const track = trackRef.current
    const i = (next + images.length) % images.length
    if (track) track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' })
    setIndex(i)
  }

  function onScroll() {
    const track = trackRef.current
    if (!track || !track.clientWidth) return
    setIndex(Math.round(track.scrollLeft / track.clientWidth))
  }

  return (
    <div className={cn('group/carousel relative overflow-hidden', rounded, className)}>
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="no-scrollbar flex size-full snap-x snap-mandatory overflow-x-auto"
      >
        {images.map((src, i) => (
          <div key={`${src}-${i}`} className="relative size-full shrink-0 snap-center">
            <Image
              src={src}
              alt={i === 0 ? alt : `${alt} — photo ${i + 1}`}
              fill
              sizes={sizes}
              priority={priority && i === 0}
              className="object-cover transition-transform duration-500 group-hover/card:scale-[1.04]"
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation()
              go(index - 1)
            }}
            className="absolute top-1/2 left-2.5 flex size-[30px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 backdrop-blur-[2px] transition-opacity group-hover/carousel:opacity-100 focus-visible:opacity-100 max-md:opacity-100"
          >
            <img src="/images/card/arrow-left.svg" alt="" width={20} height={20} />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation()
              go(index + 1)
            }}
            className="absolute top-1/2 right-2.5 flex size-[30px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 backdrop-blur-[2px] transition-opacity group-hover/carousel:opacity-100 focus-visible:opacity-100 max-md:opacity-100"
          >
            <img src="/images/card/arrow-right.svg" alt="" width={20} height={20} />
          </button>
          <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1" aria-hidden>
            {images.map((_, i) => (
              <span
                key={i}
                className={cn('size-[5px] rounded-full transition-colors', i === index ? 'bg-white' : 'bg-white/50')}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
