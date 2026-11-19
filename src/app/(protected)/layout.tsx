import { Suspense, type ReactNode } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { QuickViewModal } from '@/components/venue/QuickViewModal'

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={<div className="h-[88px] border-b border-line bg-surface" />}>
        <TopBar variant="solid" />
      </Suspense>
      {children}
      <Suspense fallback={null}>
        <QuickViewModal />
      </Suspense>
    </>
  )
}
