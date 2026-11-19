import { cn } from '@/lib/cn'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  tone?: 'dark' | 'light'
  className?: string
}

export function SectionHeader({ title, subtitle, tone = 'dark', className }: SectionHeaderProps) {
  return (
    <div className={cn('mx-auto flex max-w-[1200px] flex-col gap-2.5 text-center', className)}>
      <h2
        className={cn(
          'text-[28px] leading-9 font-semibold md:text-[36px] md:leading-[44px] lg:text-[44px] lg:leading-[50px]',
          tone === 'light' ? 'text-white' : 'text-ink',
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn('text-base leading-6 md:text-xl md:leading-[30px]', tone === 'light' ? 'text-white/90' : 'text-ink')}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
