import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DEFAULT_SEARCH_STATE } from '@/features/search/params'
import { FiltersDrawer } from '../FiltersDrawer'

const ranges = { capMin: 10, capMax: 1500, priceMin: 10, priceMax: 30000 }

describe('FiltersDrawer', () => {
  it('applies selected types and verified while keeping default ranges', async () => {
    const onApply = vi.fn()
    render(<FiltersDrawer open onClose={() => {}} value={DEFAULT_SEARCH_STATE} onApply={onApply} />)
    await userEvent.click(screen.getByRole('button', { name: 'Bar' }))
    await userEvent.click(screen.getByRole('switch', { name: /verified only/i }))
    await userEvent.click(screen.getByRole('button', { name: /apply filters/i }))
    expect(onApply).toHaveBeenCalledWith({ types: ['Bar'], occasions: [], verified: true, ...ranges })
  })

  it('clear all resets the draft before applying', async () => {
    const onApply = vi.fn()
    render(
      <FiltersDrawer
        open
        onClose={() => {}}
        value={{ ...DEFAULT_SEARCH_STATE, types: ['Loft'], occasions: ['Wedding'], verified: true, capMin: 100 }}
        onApply={onApply}
      />,
    )
    expect(screen.getByText('Showing venues for 100 - 1500 guests')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /clear all/i }))
    await userEvent.click(screen.getByRole('button', { name: /apply filters/i }))
    expect(onApply).toHaveBeenCalledWith({ types: [], occasions: [], verified: false, ...ranges })
  })
})
