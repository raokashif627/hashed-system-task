import { cn } from '@/lib/cn'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'animate-shimmer rounded-md bg-[linear-gradient(90deg,var(--surface-alt)_0%,var(--line)_50%,var(--surface-alt)_100%)] bg-[length:800px_100%]',
        className,
      )}
    />
  )
}
