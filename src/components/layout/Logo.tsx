import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/cn'

interface LogoProps {
  tone?: 'brand' | 'white'
  className?: string
  wordmark?: boolean
}

export function Logo({ tone = 'brand', className, wordmark = true }: LogoProps) {
  return (
    <Link href="/" aria-label="Venuze home" className={cn('flex shrink-0 items-center gap-[19px]', className)}>
      <Image src="/images/logo.png" alt="" width={48} height={32} priority className="h-8 w-12 object-contain" />
      {wordmark && (
        <span
          aria-hidden
          className={cn('block h-[19px] w-[124px]', tone === 'white' ? 'bg-white' : 'bg-brand-500')}
          style={{
            maskImage: 'url(/images/logo-text-mask.png)',
            WebkitMaskImage: 'url(/images/logo-text-mask.png)',
            maskSize: '100% 100%',
            WebkitMaskSize: '100% 100%',
          }}
        />
      )}
    </Link>
  )
}
