import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'glass' | 'light' | 'white'

const TONES: Record<Tone, string> = {
  glass: 'bg-black/50 text-white backdrop-blur-[2px] hover:bg-black/70',
  light: 'bg-[#f4f4f4] text-ink shadow-arrow hover:bg-white dark:bg-surface-alt',
  white: 'bg-white text-brand-500 hover:bg-brand-50',
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  tone?: Tone
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, tone = 'glass', className, type = 'button', children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40',
        TONES[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
})
