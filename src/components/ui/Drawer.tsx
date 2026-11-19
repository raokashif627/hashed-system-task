'use client'

import { X } from 'lucide-react'
import { useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useDialog } from './useDialog'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
}

export function Drawer({ open, onClose, title, children, footer }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  useDialog(open, onClose, panelRef)

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-[1000]">
      <div className="absolute inset-0 animate-fade-in bg-black/40" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex w-full animate-slide-in-right flex-col bg-surface shadow-2xl outline-none md:w-[654px] md:rounded-l-[10px]"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-6 md:px-6">
          <h2 id={titleId} className="text-xl font-medium text-ink">
            {title}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" className="cursor-pointer rounded-full p-1 text-ink hover:bg-surface-alt">
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6">{children}</div>
        {footer && <div className="flex items-center justify-between border-t border-line px-6 py-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
