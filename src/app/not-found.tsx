import Image from 'next/image'
import Link from 'next/link'
import { buttonClasses } from '@/components/ui/Button'
import { Logo } from '@/components/layout/Logo'

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-surface px-4 text-center">
      <Logo />
      <Image src="/images/empty/search.png" alt="" width={200} height={150} className="mt-12" />
      <p className="mt-6 text-sm font-semibold tracking-widest text-brand-500">404</p>
      <h1 className="mt-2 text-3xl font-semibold text-ink">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-body">The page you are looking for has moved or never existed. Let&apos;s get you back to finding venues.</p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className={buttonClasses('primary', 'md')}>
          Back to home
        </Link>
        <Link href="/search" className={buttonClasses('outline', 'md')}>
          Browse venues
        </Link>
      </div>
    </main>
  )
}
