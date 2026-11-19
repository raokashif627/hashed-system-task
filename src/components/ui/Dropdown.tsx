'use client'

import { Check } from 'lucide-react'
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { cn } from '@/lib/cn'

export interface DropdownOption<T extends string | number> {
  value: T
  label: string
}

interface DropdownProps<T extends string | number> {
  id: string
  labelId: string
  value: T
  options: DropdownOption<T>[]
  onChange: (value: T) => void
  className?: string
  variant?: 'inline' | 'boxed'
}

const TRIGGER = {
  inline: 'h-6 text-base',
  boxed: 'mt-1 h-11 rounded-btn border border-line bg-surface px-3 text-sm transition-colors hover:border-[#cfcfcf] aria-expanded:border-brand-500 aria-expanded:ring-2 aria-expanded:ring-brand-500/20',
}

const LIST = {
  inline: 'top-[calc(100%+14px)] left-[-10px] min-w-[calc(100%+20px)]',
  boxed: 'top-[calc(100%+6px)] left-0 min-w-full',
}

export function Dropdown<T extends string | number>({ id, labelId, value, options, onChange, className, variant = 'inline' }: DropdownProps<T>) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const listId = useId()
  const valueId = useId()
  const selectedIndex = Math.max(
    options.findIndex((o) => o.value === value),
    0,
  )

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  useEffect(() => {
    if (open) listRef.current?.children[active]?.scrollIntoView?.({ block: 'nearest' })
  }, [open, active])

  function openList() {
    setActive(selectedIndex)
    setOpen(true)
  }

  function choose(index: number) {
    onChange(options[index].value)
    setOpen(false)
  }

  function onKeyDown(e: KeyboardEvent) {
    if (!open) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault()
        openList()
      }
      return
    }
    const last = options.length - 1
    const moves: Record<string, number> = {
      ArrowDown: Math.min(active + 1, last),
      ArrowUp: Math.max(active - 1, 0),
      Home: 0,
      End: last,
    }
    if (e.key in moves) {
      e.preventDefault()
      setActive(moves[e.key])
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      choose(active)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      setOpen(false)
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-labelledby={`${labelId} ${valueId}`}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={cn('flex w-full cursor-pointer items-center justify-between gap-2 text-left outline-none', TRIGGER[variant])}
      >
        <span id={valueId} className={cn('truncate font-medium', variant === 'inline' ? 'text-black' : 'text-ink')}>
          {options[selectedIndex]?.label}
        </span>
        <img
          src="/images/icons/arrow-down.svg"
          alt=""
          width={24}
          height={24}
          className={cn('pointer-events-none shrink-0 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>
      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          tabIndex={-1}
          className={cn(
            'absolute z-40 max-h-72 animate-pop-in overflow-y-auto rounded-btn border border-[#ececec] bg-white p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.16)] dark:border-line dark:bg-surface',
            LIST[variant],
          )}
        >
          {options.map((o, i) => {
            const selected = i === selectedIndex
            return (
              <li
                key={String(o.value)}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(i)}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-3 rounded-[8px] px-4 py-2.5 text-[15px] whitespace-nowrap transition-colors',
                  i === active ? 'bg-brand-50 dark:bg-brand-500/15' : 'bg-transparent',
                  selected ? 'font-semibold text-brand-500' : 'text-black dark:text-ink',
                )}
              >
                {o.label}
                {selected && <Check className="size-4 shrink-0" strokeWidth={2.5} />}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
