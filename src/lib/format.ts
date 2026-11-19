const number = new Intl.NumberFormat('en-US')

export function formatPrice(n: number): string {
  return `$${number.format(n)}`
}

export function formatCapacity(n: number): string {
  return `${number.format(n)}+`
}

export function formatSqft(n: number): string {
  return `${number.format(n)} sq ft`
}

export function formatBookingDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d))
  const weekday = date.toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' })
  const rest = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
  return `${weekday}, ${rest}`
}

export function todayISO(now: Date = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
