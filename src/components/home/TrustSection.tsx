'use client'

import { Star } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/cn'
import { SectionHeader } from './SectionHeader'

const STATS = [
  { value: '1,500+', label: 'Venues Vetted & Approved' },
  { value: '7,500+', label: 'Events Successfully Hosted' },
  { value: '35+', label: 'Cities Across the Region' },
  { value: '4.9★', label: 'Average Host Rating' },
]

const TESTIMONIALS = [
  { name: 'Michael Carter', role: 'Event planner', quote: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
  { name: 'by Ayesha M.', role: 'Venue host', quote: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
  { name: 'Sofia Ramirez', role: 'Brand manager', quote: 'We booked a rooftop for our launch in two days. The filters made it effortless.' },
  { name: 'Daniel Okafor', role: 'Photographer', quote: 'Finding studios with great natural light used to take weeks. Now it takes minutes.' },
]

function initials(name: string) {
  return name
    .replace(/^by /, '')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
}

export function TrustSection() {
  const [page, setPage] = useState(0)
  const pages = Math.ceil(TESTIMONIALS.length / 2)
  const visible = TESTIMONIALS.slice(page * 2, page * 2 + 2)

  return (
    <section className="bg-[linear-gradient(180deg,#fff3e6_0%,#ffe9e3_100%)] px-4 py-14 md:px-8 lg:px-[82px] lg:pt-[77px] lg:pb-[80px] dark:bg-[linear-gradient(180deg,#231c1a_0%,#1d1513_100%)]">
      <SectionHeader
        title="Trusted by Event Creators Who Demand Excellence"
        subtitle="Join thousands of planners and hosts who love our seamless discovery and booking experience."
      />
      <ul className="mx-auto mt-10 grid max-w-[1277px] grid-cols-2 gap-3 md:gap-6 lg:mt-[53px] lg:grid-cols-4">
        {STATS.map((s, i) => (
          <li
            key={s.value}
            className={cn(
              'flex h-[110px] flex-col items-center justify-center rounded-card text-center md:h-[124px]',
              i === 3 ? 'bg-accent text-night' : 'bg-[linear-gradient(135deg,#ff5037_0%,#ff7a45_100%)] text-white',
            )}
          >
            <span className="text-[26px] leading-9 font-bold md:text-[32px]">{s.value}</span>
            <span className="mt-1 text-xs md:text-sm">{s.label}</span>
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-6 grid max-w-[1277px] gap-6 md:grid-cols-2" aria-live="polite">
        {visible.map((t) => (
          <figure key={t.name} className="flex min-h-[230px] overflow-hidden rounded-card bg-surface shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
            <div className="flex w-[38%] shrink-0 items-center justify-center bg-[linear-gradient(160deg,#ffe1dc_0%,#ffc2b8_100%)] dark:bg-[linear-gradient(160deg,#3a2622_0%,#2a1d1a_100%)]">
              <span className="flex size-24 items-center justify-center rounded-full bg-white text-3xl font-semibold text-brand-500 shadow-md dark:bg-surface">
                {initials(t.name)}
              </span>
            </div>
            <div className="flex flex-col justify-center p-6 md:p-8">
              <blockquote className="text-base leading-7 text-ink md:text-lg">{t.quote}</blockquote>
              <figcaption className="mt-4">
                <p className="text-sm font-semibold text-ink">{t.name}</p>
                <p className="text-xs text-muted">{t.role}</p>
                <div className="mt-2 flex gap-0.5 text-accent" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
              </figcaption>
            </div>
          </figure>
        ))}
      </div>

      <div className="mx-auto mt-[26px] flex max-w-[1277px] justify-end gap-2.5">
        {([-1, 1] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            aria-label={dir === -1 ? 'Previous testimonials' : 'Next testimonials'}
            onClick={() => setPage((p) => (p + dir + pages) % pages)}
            className="flex size-[42px] cursor-pointer items-center justify-center rounded-full bg-[#f4f4f4] shadow-arrow transition hover:bg-white"
          >
            <img src={dir === -1 ? '/images/icons/carousel-prev.svg' : '/images/icons/carousel-next.svg'} alt="" width={30} height={30} />
          </button>
        ))}
      </div>
    </section>
  )
}
