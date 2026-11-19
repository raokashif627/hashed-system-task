import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import type { ReactNode } from 'react'
import { Providers } from './providers'
import './globals.css'

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'Venuze — Celebrate in venues big and small', template: '%s · Venuze' },
  description: 'Find and book the perfect venue for any occasion — from rooftops and ballrooms to studios and galleries.',
  icons: { icon: '/images/logo.png' },
}

export const viewport: Viewport = {
  themeColor: '#ff5037',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={poppins.variable}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
