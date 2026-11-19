import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface ChipProps {
  selected?: boolean
  onClick?: () => void
  onRemove?: () => void
  children: ReactNode
  className?: string
}

export function Chip({ selected = false, onClick, onRemove, children, className }: ChipProps) {
  const base = cn(
    'inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] leading-none transition-colors duration-150',
    selected
      ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/15'
      : 'border-transparent bg-surface-alt text-ink hover:border-line hover:bg-line/60',
    className,
  )

  if (onRemove) {
    return (
      <span className={cn(base, 'border-line bg-surface py-1.5 pr-2 text-[11px]')}>
        {children}
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${typeof children === 'string' ? children : 'filter'}`}
          className="cursor-pointer rounded-full p-0.5 text-muted hover:bg-surface-alt hover:text-ink"
        >
          <X className="size-3" />
        </button>
      </span>
    )
  }

  return (
    <button type="button" aria-pressed={selected} onClick={onClick} className={cn(base, 'cursor-pointer')}>
      {children}
    </button>
  )
}
