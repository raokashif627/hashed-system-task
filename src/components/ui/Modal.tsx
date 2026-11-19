'use client'

import { X } from 'lucide-react'
import { useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/cn'
import { useDialog } from './useDialog'

const SIZES = { md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-5xl' } as const

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: keyof typeof SIZES
  hideTitle?: boolean
}

export function Modal({ open, onClose, title, children, size = 'md', hideTitle = false }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  useDialog(open, onClose, panelRef)

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 animate-fade-in bg-black/50 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'relative flex max-h-[92dvh] w-full animate-pop-in flex-col overflow-hidden rounded-t-card bg-surface shadow-2xl outline-none sm:rounded-card',
          SIZES[size],
        )}
      >
        <div className={cn('flex items-center justify-between gap-4 px-6 pt-5', hideTitle ? 'absolute right-0 top-0 z-10' : 'pb-2')}>
          <h2 id={titleId} className={cn('text-lg font-semibold text-ink', hideTitle && 'sr-only')}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer rounded-full bg-surface/90 p-1.5 text-ink shadow-sm hover:bg-surface-alt"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
