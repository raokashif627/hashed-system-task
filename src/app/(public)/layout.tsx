import { Suspense, type ReactNode } from 'react'
import { Footer } from '@/components/layout/Footer'
import { QuickViewModal } from '@/components/venue/QuickViewModal'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Footer />
      <Suspense fallback={null}>
        <QuickViewModal />
      </Suspense>
    </>
  )
}
