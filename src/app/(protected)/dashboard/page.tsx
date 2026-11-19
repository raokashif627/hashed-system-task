import type { Metadata } from 'next'
import { Suspense } from 'react'
import { DashboardView } from '@/components/dashboard/DashboardView'

export const metadata: Metadata = { title: 'Dashboard' }

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100dvh-88px)]" />}>
      <DashboardView />
    </Suspense>
  )
}
