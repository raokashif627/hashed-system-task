'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import { HeroSearch } from './HeroSearch'

const SLIDES = [
  '/images/hero/hero-1.jpg',
  '/images/categories-home/celebration.png',
  '/images/venues/v8.png',
  '/images/categories-home/private-party.png',
]

export function Hero() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000)
    return () => clearInterval(id)
  }, [paused])

  return (
    <section
      aria-label="Find a venue"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative isolate z-10 flex min-h-[745px] flex-col items-center bg-[#372321] px-4 pt-[152px] pb-24 md:pt-[242px] lg:pt-[196px]"
    >
      {SLIDES.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={i === 0}
          sizes="100vw"
          className={cn('-z-20 object-cover transition-opacity duration-1000', i === index ? 'opacity-100' : 'opacity-0')}
        />
      ))}
      <div className="absolute inset-0 -z-10 bg-black/40" />

      <h1 className="max-w-[343px] text-center text-[40px] leading-[46px] font-semibold tracking-[-1.2px] text-white md:max-w-[683px] md:text-[64px] md:leading-[70px] lg:max-w-[746px] lg:text-[70px] lg:leading-[80px] lg:tracking-[-2.1px]">
        Celebrate in venues big and small
      </h1>

      <div className="mt-5 w-full md:mt-[22px] lg:mt-[65px]">
        <HeroSearch />
      </div>

      <div className="absolute bottom-[29px] left-1/2 flex -translate-x-1/2 items-center gap-[5px] lg:bottom-[129px]">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={cn(
              'h-2 cursor-pointer rounded-full transition-all duration-300',
              i === index ? 'w-7 bg-accent' : 'w-2 bg-[#d9d9d9]/40 hover:bg-[#d9d9d9]/70',
            )}
          />
        ))}
      </div>
    </section>
  )
}
