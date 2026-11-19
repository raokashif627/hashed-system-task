import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useHydrated } from '../useHydrated'

function Probe({ log }: { log: boolean[] }) {
  const hydrated = useHydrated()
  log.push(hydrated)
  return <span>{hydrated ? 'yes' : 'no'}</span>
}

describe('useHydrated', () => {
  it('is false on the first render and true after mount', async () => {
    const log: boolean[] = []
    render(<Probe log={log} />)
    expect(log[0]).toBe(false)
    expect(await screen.findByText('yes')).toBeInTheDocument()
  })
})
