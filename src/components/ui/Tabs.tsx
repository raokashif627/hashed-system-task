'use client'

import { useRef, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface TabItem {
  id: string
  label: ReactNode
}

interface TabsProps {
  tabs: TabItem[]
  value: string
  onChange: (id: string) => void
  label: string
  variant?: 'pill' | 'underline' | 'dark'
  className?: string
}

const STYLES = {
  pill: {
    list: 'gap-2',
    tab: 'rounded-full px-4 py-2 text-sm',
    active: 'bg-brand-500 text-white',
    idle: 'bg-surface-alt text-ink hover:bg-line',
  },
  underline: {
    list: 'gap-6 border-b border-line',
    tab: '-mb-px border-b-2 px-1 pb-3 text-[15px]',
    active: 'border-brand-500 font-semibold text-brand-500',
    idle: 'border-transparent text-muted hover:text-ink',
  },
  dark: {
    list: 'gap-2.5',
    tab: 'flex h-10 items-center rounded-btn px-5 text-sm uppercase md:h-[50px] md:px-[30px] md:text-base',
    active: 'bg-brand-500 font-bold text-white',
    idle: 'bg-[rgba(183,183,183,0.5)] text-white hover:bg-[rgba(183,183,183,0.7)]',
  },
} as const

export function Tabs({ tabs, value, onChange, label, variant = 'pill', className }: TabsProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const s = STYLES[variant]

  function onKeyDown(e: KeyboardEvent, index: number) {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!delta) return
    e.preventDefault()
    const next = (index + delta + tabs.length) % tabs.length
    refs.current[next]?.focus()
    onChange(tabs[next].id)
  }

  return (
    <div role="tablist" aria-label={label} className={cn('no-scrollbar flex overflow-x-auto', s.list, className)}>
      {tabs.map((t, i) => {
        const active = t.id === value
        return (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn('shrink-0 cursor-pointer whitespace-nowrap transition-colors duration-200', s.tab, active ? s.active : s.idle)}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}
