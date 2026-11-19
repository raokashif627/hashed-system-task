'use client'

interface RangeSliderProps {
  min: number
  max: number
  step?: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  ariaLabel: string
  formatLabel?: (n: number) => string
}

const THUMB =
  'pointer-events-none absolute inset-0 h-6 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-[22px] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand-500 [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-[18px] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-brand-500 [&::-moz-range-thumb]:bg-white'

export function RangeSlider({ min, max, step = 1, value, onChange, ariaLabel, formatLabel }: RangeSliderProps) {
  const [lo, hi] = value
  const pct = (n: number) => ((n - min) / (max - min)) * 100

  return (
    <div>
      {formatLabel && (
        <div className="mb-2 flex justify-between text-xs text-body">
          <span>{formatLabel(lo)}</span>
          <span>{formatLabel(hi)}</span>
        </div>
      )}
      <div className="relative h-6">
        <div className="absolute top-1/2 h-[3px] w-full -translate-y-1/2 rounded-full bg-line" />
        <div
          className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-brand-500"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
        />
        <input
          type="range"
          aria-label={`${ariaLabel} minimum`}
          min={min}
          max={max}
          step={step}
          value={lo}
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi), hi])}
          className={THUMB}
        />
        <input
          type="range"
          aria-label={`${ariaLabel} maximum`}
          min={min}
          max={max}
          step={step}
          value={hi}
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo)])}
          className={THUMB}
        />
      </div>
    </div>
  )
}
