import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { RangeSlider } from '../RangeSlider'

describe('RangeSlider', () => {
  it('clamps the min thumb to the max value', () => {
    const onChange = vi.fn()
    render(<RangeSlider min={10} max={1500} step={10} value={[100, 500]} onChange={onChange} ariaLabel="Capacity" />)
    fireEvent.change(screen.getByLabelText('Capacity minimum'), { target: { value: '900' } })
    expect(onChange).toHaveBeenCalledWith([500, 500])
  })

  it('clamps the max thumb to the min value', () => {
    const onChange = vi.fn()
    render(<RangeSlider min={10} max={1500} step={10} value={[100, 500]} onChange={onChange} ariaLabel="Capacity" />)
    fireEvent.change(screen.getByLabelText('Capacity maximum'), { target: { value: '50' } })
    expect(onChange).toHaveBeenCalledWith([100, 100])
  })
})
