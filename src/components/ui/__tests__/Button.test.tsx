import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from '../Button'

describe('Button', () => {
  it('is disabled and busy while loading', () => {
    render(<Button loading>Log in</Button>)
    const btn = screen.getByRole('button', { name: /log in/i })
    expect(btn).toBeDisabled()
    expect(btn).toHaveAttribute('aria-busy', 'true')
  })

  it('is enabled by default', () => {
    render(<Button>Go</Button>)
    expect(screen.getByRole('button', { name: 'Go' })).toBeEnabled()
  })
})
