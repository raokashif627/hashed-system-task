import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RequestBookingForm } from '../RequestBookingForm'

describe('RequestBookingForm', () => {
  it('blocks guests above capacity', async () => {
    const onSubmit = vi.fn()
    render(<RequestBookingForm venueId="v1" capacity={50} today="2026-11-18" onSubmit={onSubmit} />)
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2026-11-20' } })
    await userEvent.clear(screen.getByLabelText('Guests'))
    await userEvent.type(screen.getByLabelText('Guests'), '80')
    await userEvent.click(screen.getByRole('button', { name: /request booking/i }))
    expect(await screen.findByText('This venue fits up to 50 guests')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits a valid request', async () => {
    const onSubmit = vi.fn()
    render(<RequestBookingForm venueId="v1" capacity={50} today="2026-11-18" onSubmit={onSubmit} />)
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2026-11-20' } })
    await userEvent.clear(screen.getByLabelText('Guests'))
    await userEvent.type(screen.getByLabelText('Guests'), '30')
    await userEvent.click(screen.getByRole('button', { name: /request booking/i }))
    await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ venueId: 'v1', date: '2026-11-20', guests: 30 }))
  })
})
