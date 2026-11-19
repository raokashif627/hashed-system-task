'use client'

import { Building2, Mic2, Music2, Sparkles } from 'lucide-react'
import { comingSoon } from '@/lib/coming-soon'

interface PromoBannerProps {
  title: string
  description: string
  cta: string
  feature: string
}

export function PromoBanner({ title, description, cta, feature }: PromoBannerProps) {
  return (
    <div className="relative mx-auto flex max-w-[1278px] flex-col gap-6 overflow-hidden rounded-card bg-[linear-gradient(90deg,#ff5037_0%,#ff7a45_55%,#ffb347_100%)] px-6 py-10 md:flex-row md:items-center md:justify-between md:px-12 lg:h-[300px] lg:px-[88px] lg:py-0">
      <div className="relative z-10 max-w-[713px]">
        <h2 className="text-[26px] leading-9 font-semibold text-white md:text-[36px] md:leading-[50px]">{title}</h2>
        <p className="mt-3 max-w-[560px] text-sm leading-6 text-white/95 md:text-base">{description}</p>
        <button
          type="button"
          onClick={() => comingSoon(feature)}
          className="mt-6 inline-flex h-[50px] cursor-pointer items-center rounded-btn bg-night px-6 text-base font-semibold text-white transition-colors hover:bg-black"
        >
          {cta}
        </button>
      </div>
      <div aria-hidden className="relative hidden h-[220px] w-[360px] shrink-0 md:block">
        <svg viewBox="0 0 360 220" className="absolute inset-0 size-full" fill="none">
          <path d="M10 170 C 90 120, 140 210, 220 150 S 330 90, 350 40" stroke="white" strokeOpacity="0.7" strokeWidth="2" strokeDasharray="6 8" />
        </svg>
        <div className="absolute top-6 left-10 flex size-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
          <Building2 className="size-10 text-white" />
        </div>
        <div className="absolute top-2 right-6 flex size-16 items-center justify-center rounded-full bg-white/25">
          <Sparkles className="size-8 text-white" />
        </div>
        <div className="absolute right-20 bottom-4 flex size-24 items-center justify-center rounded-3xl bg-white shadow-xl">
          <Mic2 className="size-11 text-brand-500" />
        </div>
        <div className="absolute bottom-10 left-24 flex size-14 items-center justify-center rounded-full bg-accent shadow-lg">
          <Music2 className="size-7 text-night" />
        </div>
      </div>
    </div>
  )
}
