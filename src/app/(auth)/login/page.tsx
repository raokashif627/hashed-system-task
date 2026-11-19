import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { Logo } from '@/components/layout/Logo'

export const metadata: Metadata = { title: 'Log in' }

export default function LoginPage() {
  return (
    <main className="relative grid min-h-dvh lg:grid-cols-2">
      <div className="absolute inset-0 lg:relative">
        <Image src="/images/hero/hero-1.jpg" alt="" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative hidden h-full flex-col justify-between p-12 text-white lg:flex">
          <Logo tone="white" />
          <div className="max-w-[520px]">
            <p className="text-[52px] leading-[60px] font-semibold tracking-[-1.5px]">Make it memorable.</p>
            <p className="mt-4 text-lg leading-8 text-white/90">
              Book the perfect venue and the pros who make it shine — your saved spaces and bookings are waiting.
            </p>
          </div>
          <p className="text-sm text-white/70">© 2026 Venuze. All rights reserved.</p>
        </div>
      </div>

      <div className="relative flex items-center justify-center px-4 py-10 lg:bg-surface">
        <div className="w-full max-w-[440px] rounded-card bg-surface p-7 shadow-2xl sm:p-10 lg:shadow-none">
          <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted hover:text-brand-500">
            <ArrowLeft className="size-4" /> Back to home
          </Link>
          <div className="lg:hidden">
            <Logo />
          </div>
          <h1 className="mt-6 text-[28px] leading-9 font-semibold text-ink lg:mt-0">Welcome back</h1>
          <p className="mt-1.5 mb-8 text-sm text-body">Log in to manage your saved venues and bookings.</p>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
