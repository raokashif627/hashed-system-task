import { toast } from 'sonner'

export function comingSoon(feature: string): void {
  toast(`${feature} is coming soon`, { description: 'We are putting the finishing touches on it.' })
}
