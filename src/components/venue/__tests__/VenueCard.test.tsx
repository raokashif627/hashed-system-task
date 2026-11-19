import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '@/features/auth/store'
import { useSavedStore } from '@/features/saved/store'
import type { Venue } from '@/features/venues/types'
import { VenueCard } from '../VenueCard'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/search',
  useSearchParams: () => new URLSearchParams(),
}))

const venue: Venue = {
  id: 'v1',
  title: 'High-Spec Room in Trendy Home',
  city: 'London',
  area: 'Clapham/ Stockwell',
  lat: 0,
  lng: 0,
  images: ['/images/venues/v1.jpg', '/images/venues/v2.png'],
  verified: true,
  capacity: 300,
  sizeSqft: 2000,
  amenities: ['Free parking', 'Wi-Fi', 'Kitchen'],
  pricePerHour: 50,
  type: 'Studio',
  category: 'photo-studio',
  occasions: [],
  featuredTabs: [],
  description: '',
}

describe('VenueCard', () => {
  beforeEach(() => {
    useSavedStore.setState({ ids: [] })
    useAuthStore.setState({ token: null, email: null })
  })

  it('renders the Figma card content', () => {
    render(<VenueCard venue={venue} onOpen={() => {}} />)
    expect(screen.getByRole('heading', { name: 'High-Spec Room in Trendy Home' })).toBeInTheDocument()
    expect(screen.getByText('From')).toBeInTheDocument()
    expect(screen.getByText('$50/hour')).toBeInTheDocument()
    expect(screen.getByText('300+')).toBeInTheDocument()
    expect(screen.getByText('2,000 sq ft')).toBeInTheDocument()
    expect(screen.getByText('Verified')).toBeInTheDocument()
  })

  it('hides the verified badge for unverified venues', () => {
    render(<VenueCard venue={{ ...venue, verified: false }} onOpen={() => {}} />)
    expect(screen.queryByText('Verified')).toBeNull()
  })

  it('calls onOpen with the venue id from View details', async () => {
    const onOpen = vi.fn()
    render(<VenueCard venue={venue} onOpen={onOpen} />)
    await userEvent.click(screen.getByRole('button', { name: /view details/i }))
    expect(onOpen).toHaveBeenCalledWith('v1')
  })

  it('reflects saved state on the heart and toggles it when logged in', async () => {
    useAuthStore.setState({ token: 't', email: 'e@x.com' })
    render(<VenueCard venue={venue} onOpen={() => {}} />)
    const heart = screen.getByRole('button', { name: /save/i })
    expect(heart).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(heart)
    expect(useSavedStore.getState().ids).toEqual(['v1'])
    expect(heart).toHaveAttribute('aria-pressed', 'true')
  })

  it('does not save when logged out', async () => {
    render(<VenueCard venue={venue} onOpen={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: /save/i }))
    expect(useSavedStore.getState().ids).toEqual([])
  })
})
