import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HeroSearch } from '../HeroSearch'

const push = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }))

describe('HeroSearch', () => {
  beforeEach(() => push.mockReset())

  it('pushes a search URL with city and guests', async () => {
    render(<HeroSearch />)
    await userEvent.click(screen.getByRole('combobox', { name: /where/i }))
    await userEvent.click(screen.getByRole('option', { name: 'London, UK' }))
    await userEvent.click(screen.getByRole('combobox', { name: /guests/i }))
    await userEvent.click(screen.getByRole('option', { name: '10-20' }))
    await userEvent.click(screen.getByRole('button', { name: /^search$/i }))
    expect(push).toHaveBeenCalledWith('/search?city=London&guests=10')
  })

  it('supports choosing an option with the keyboard and closes on Escape', async () => {
    render(<HeroSearch />)
    const where = screen.getByRole('combobox', { name: /where/i })
    where.focus()
    await userEvent.keyboard('{Enter}')
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    await userEvent.keyboard('{ArrowDown}{Enter}')
    expect(where).toHaveTextContent('London, UK')
    expect(screen.queryByRole('listbox')).toBeNull()
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('ignores a date in the past', () => {
    render(<HeroSearch />)
    const when = screen.getByLabelText('When')
    fireEvent.change(when, { target: { value: '2000-01-01' } })
    expect(when).toHaveValue('')
    expect(screen.getByText('Anytime')).toBeInTheDocument()
  })

  it('adds mode=vendor when Vendors is selected', async () => {
    render(<HeroSearch />)
    await userEvent.click(screen.getByRole('radio', { name: /vendors/i }))
    await userEvent.click(screen.getByRole('button', { name: /^search$/i }))
    expect(push.mock.calls[0][0]).toContain('mode=vendor')
  })
})
