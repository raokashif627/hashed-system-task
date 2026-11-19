'use client'

import { LayoutDashboard, LogOut } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useCurrentUser, useLogout } from '@/features/auth/hooks'
import { ThemeToggle } from './ThemeToggle'

export function UserMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { data: user } = useCurrentUser()
  const logout = useLogout()

  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const initials = user ? `${user.first_name[0]}${user.last_name[0]}` : '…'

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-btn bg-white text-xs font-semibold text-brand-500 ring-brand-500/30 transition hover:ring-2"
      >
        {user?.avatar ? (
          <Image src={user.avatar} alt="" width={40} height={40} className="size-full object-cover" />
        ) : (
          initials
        )}
      </button>
      {open && (
        <div
          role="menu"
          aria-label="Account"
          className="absolute right-0 z-50 mt-2 w-56 animate-pop-in overflow-hidden rounded-btn border border-line bg-surface py-1 text-sm text-ink shadow-xl"
        >
          {user && (
            <div className="border-b border-line px-4 py-3">
              <p className="font-semibold">
                {user.first_name} {user.last_name}
              </p>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
          )}
          <Link
            role="menuitem"
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 hover:bg-surface-alt"
          >
            <LayoutDashboard className="size-4" /> Dashboard
          </Link>
          <ThemeToggle withLabel className="w-full px-4 py-2.5 hover:bg-surface-alt" />
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              setOpen(false)
              logout()
            }}
            className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left text-brand-600 hover:bg-surface-alt"
          >
            <LogOut className="size-4" /> Log out
          </button>
        </div>
      )}
    </div>
  )
}
