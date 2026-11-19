import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { getFeaturedVenues } from '@/features/venues/service'
import type { Venue } from '@/features/venues/types'
import { FeaturedVenues } from '../FeaturedVenues'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

const make = (id: string): Venue => ({
  id,
  title: `Venue ${id}`,
  city: 'London',
  area: 'Soho',
  lat: 0,
  lng: 0,
  images: ['/images/venues/v1.jpg'],
  verified: true,
  capacity: 100,
  sizeSqft: 1000,
  amenities: ['Wi-Fi'],
  pricePerHour: 50,
  type: 'Gallery',
  category: 'gallery',
  occasions: [],
  featuredTabs: ['Gallery'],
  description: '',
})

vi.mock('@/features/venues/service', () => ({
  getFeaturedVenues: vi.fn((tab: string) => Promise.resolve(tab === 'Gallery' ? [make('a'), make('b')] : [make('c')])),
}))

describe('FeaturedVenues', () => {
  it('shows skeletons, then cards, and refetches on tab change', async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <FeaturedVenues />
      </QueryClientProvider>,
    )
    expect(screen.getAllByTestId('venue-card-skeleton')).toHaveLength(4)
    expect(await screen.findByText('Venue a')).toBeInTheDocument()
    expect(screen.getByText('Venue b')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('tab', { name: /rooftop/i }))
    expect(await screen.findByText('Venue c')).toBeInTheDocument()
    expect(getFeaturedVenues).toHaveBeenCalledWith('Rooftop')
  })
})
