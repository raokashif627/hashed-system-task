import { describe, expect, it } from 'vitest'
import { formatBookingDate, formatCapacity, formatPrice, formatSqft } from '../format'

describe('format', () => {
  it('formats price in dollars', () => {
    expect(formatPrice(50)).toBe('$50')
    expect(formatPrice(1250)).toBe('$1,250')
  })

  it('formats capacity with a plus', () => {
    expect(formatCapacity(300)).toBe('300+')
  })

  it('formats square feet with grouping', () => {
    expect(formatSqft(2000)).toBe('2,000 sq ft')
  })

  it('formats a booking date', () => {
    expect(formatBookingDate('2026-11-21')).toBe('Sat, 21 Nov 2026')
  })
})
