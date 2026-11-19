import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'sonner'
import { describe, expect, it, vi } from 'vitest'
import { ContactForm } from '../ContactForm'

vi.mock('sonner', () => ({ toast: Object.assign(vi.fn(), { success: vi.fn() }) }))

describe('ContactForm', () => {
  it('shows validation errors and does not toast on an empty submit', async () => {
    render(<ContactForm />)
    await userEvent.click(screen.getByRole('button', { name: /send/i }))
    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument()
    expect(screen.getByText('Message must be at least 10 characters')).toBeInTheDocument()
    expect(toast.success).not.toHaveBeenCalled()
  })

  it('toasts and resets after a valid submit', async () => {
    render(<ContactForm />)
    await userEvent.type(screen.getByLabelText('Email Address'), 'me@example.com')
    await userEvent.type(screen.getByLabelText('Message'), 'Hello there, I need a venue.')
    await userEvent.click(screen.getByRole('button', { name: /send/i }))
    await vi.waitFor(() => expect(toast.success).toHaveBeenCalledWith("Thanks! We'll be in touch."), { timeout: 2000 })
    expect(screen.getByLabelText('Email Address')).toHaveValue('')
  })
})
