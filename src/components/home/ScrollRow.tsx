'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface ScrollRowProps {
  children: ReactNode
  label: string
  className?: string
  arrowsClassName?: string
}

export function ScrollRow({ children, label, className, arrowsClassName }: ScrollRowProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 })
  }, [])

  useEffect(() => {
    update()
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [update, children])

  function scroll(dir: 1 | -1) {
    const el = ref.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <div className={className}>
      <div
        ref={ref}
        onScroll={update}
        role="region"
        aria-label={label}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-[25px] overflow-x-auto scroll-px-4 px-4 pt-1 pb-3 md:mx-0 md:scroll-px-0 md:px-0"
      >
        {children}
      </div>
      <div className={cn('mt-[26px] hidden justify-end gap-2.5 md:flex', arrowsClassName)}>
        {([-1, 1] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            aria-label={dir === -1 ? `Previous ${label}` : `Next ${label}`}
            onClick={() => scroll(dir)}
            disabled={dir === -1 ? edges.start : edges.end}
            className="flex size-[42px] cursor-pointer items-center justify-center rounded-full bg-[#f4f4f4] shadow-arrow transition hover:bg-white disabled:cursor-default disabled:opacity-50"
          >
            <img src={dir === -1 ? '/images/icons/carousel-prev.svg' : '/images/icons/carousel-next.svg'} alt="" width={30} height={30} />
          </button>
        ))}
      </div>
    </div>
  )
}
