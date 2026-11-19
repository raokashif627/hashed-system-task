import { describe, expect, it } from 'vitest'
import { cn } from '../cn'

describe('cn', () => {
  it('lets later tailwind classes win', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('drops falsy values', () => {
    const flag = false
    expect(cn('a', flag && 'b', 'c')).toBe('a c')
  })
})
