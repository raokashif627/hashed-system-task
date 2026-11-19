import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Modal } from '../Modal'

describe('Modal', () => {
  it('renders a labelled dialog, moves focus inside and closes on Escape', async () => {
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} title="Cancel this booking?">
        <button>Keep booking</button>
      </Modal>,
    )
    const dialog = screen.getByRole('dialog', { name: 'Cancel this booking?' })
    expect(dialog).toBeVisible()
    expect(dialog.contains(document.activeElement)).toBe(true)
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders nothing when closed', () => {
    render(
      <Modal open={false} onClose={() => {}} title="Hidden">
        x
      </Modal>,
    )
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
