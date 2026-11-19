'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { Button, buttonClasses } from '@/components/ui/Button'

export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-[70dvh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold tracking-widest text-brand-500">Oops</p>
      <h1 className="mt-2 text-3xl font-semibold text-ink">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-sm text-body">An unexpected error stopped this page from loading. You can try again or head back home.</p>
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link href="/" className={buttonClasses('outline', 'md')}>
          Go home
        </Link>
      </div>
    </main>
  )
}
