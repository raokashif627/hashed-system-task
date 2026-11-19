import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { TrustSection } from '../TrustSection'

describe('TrustSection', () => {
  it('renders the four stats', () => {
    render(<TrustSection />)
    for (const value of ['1,500+', '7,500+', '35+', '4.9★']) expect(screen.getByText(value)).toBeInTheDocument()
    expect(screen.getByText('Venues Vetted & Approved')).toBeInTheDocument()
  })

  it('moves the testimonials forward with the next arrow', async () => {
    render(<TrustSection />)
    expect(screen.getByText('Michael Carter')).toBeVisible()
    await userEvent.click(screen.getByRole('button', { name: /next testimonials/i }))
    expect(screen.queryByText('Michael Carter')).toBeNull()
    expect(screen.getByText('Sofia Ramirez')).toBeInTheDocument()
  })
})
