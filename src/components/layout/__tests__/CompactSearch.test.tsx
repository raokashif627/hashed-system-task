import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CompactSearch } from '../CompactSearch'

const push = vi.fn()
let params = new URLSearchParams()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => params,
}))

describe('CompactSearch', () => {
  beforeEach(() => {
    push.mockReset()
    params = new URLSearchParams('category=gallery')
  })

  it('edits city and guests with the custom dropdowns and keeps other filters', async () => {
    render(<CompactSearch />)
    await userEvent.click(screen.getByRole('button', { name: /edit search/i }))
    await userEvent.click(screen.getByRole('combobox', { name: /where/i }))
    await userEvent.click(screen.getByRole('option', { name: 'London, UK' }))
    await userEvent.click(screen.getByRole('combobox', { name: /guests/i }))
    await userEvent.click(screen.getByRole('option', { name: '20-50' }))
    await userEvent.click(screen.getByRole('button', { name: /^search$/i }))
    expect(push).toHaveBeenCalledWith('/search?city=London&guests=20&category=gallery')
  })

  it('closes only the dropdown on Escape, then the popup', async () => {
    render(<CompactSearch />)
    await userEvent.click(screen.getByRole('button', { name: /edit search/i }))
    await userEvent.click(screen.getByRole('combobox', { name: /where/i }))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).toBeNull()
    expect(screen.getByRole('combobox', { name: /where/i })).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('combobox', { name: /where/i })).toBeNull()
  })
})
