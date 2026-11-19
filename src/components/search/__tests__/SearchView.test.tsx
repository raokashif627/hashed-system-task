import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getVenues } from '@/features/venues/service'
import type { Venue } from '@/features/venues/types'
import { SearchView } from '../SearchView'

let params = new URLSearchParams()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => '/search',
  useSearchParams: () => params,
}))
vi.mock('../VenueMap', () => ({ VenueMap: () => null }))
vi.mock('@/features/venues/service', () => ({ getVenues: vi.fn() }))

const venue = (id: string): Venue => ({
  id,
  title: `Venue ${id}`,
  city: 'London',
  area: 'Soho',
  lat: 51.5,
  lng: -0.1,
  images: ['/images/venues/v1.jpg'],
  verified: true,
  capacity: 100,
  sizeSqft: 1000,
  amenities: ['Wi-Fi'],
  pricePerHour: 50,
  type: 'Gallery',
  category: 'gallery',
  occasions: [],
  featuredTabs: [],
  description: '',
})

function renderView() {
  return render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <SearchView />
    </QueryClientProvider>,
  )
}

describe('SearchView', () => {
  beforeEach(() => {
    vi.mocked(getVenues).mockReset()
    params = new URLSearchParams()
  })

  it('shows the vendors coming-soon state without fetching', () => {
    params = new URLSearchParams('mode=vendor')
    renderView()
    expect(screen.getByText('Vendors are coming soon')).toBeInTheDocument()
    expect(getVenues).not.toHaveBeenCalled()
  })

  it('shows the Figma empty state when nothing matches', async () => {
    vi.mocked(getVenues).mockResolvedValue({ items: [], total: 0 })
    renderView()
    expect(await screen.findByText('No data found for your search.')).toBeInTheDocument()
    expect(screen.getByText('Explore other options or clear filters to see more results.')).toBeInTheDocument()
  })

  it('shows an error with a working retry', async () => {
    vi.mocked(getVenues).mockRejectedValue(new Error('Failed to load venues'))
    renderView()
    await userEvent.click(await screen.findByRole('button', { name: /try again/i }))
    expect(getVenues).toHaveBeenCalledTimes(2)
  })

  it('keeps the keyword box in sync when q changes outside the input', async () => {
    params = new URLSearchParams('q=loft')
    vi.mocked(getVenues).mockResolvedValue({ items: [], total: 0 })
    const { rerender } = renderView()
    expect(screen.getByRole('searchbox')).toHaveValue('loft')
    params = new URLSearchParams()
    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <SearchView />
      </QueryClientProvider>,
    )
    await vi.waitFor(() => expect(screen.getByRole('searchbox')).toHaveValue(''))
  })

  it('renders result cards and the total in the header', async () => {
    params = new URLSearchParams('city=London&category=gallery')
    vi.mocked(getVenues).mockResolvedValue({ items: [venue('a'), venue('b')], total: 2 })
    renderView()
    expect(await screen.findByText('Venue a')).toBeInTheDocument()
    expect(screen.getByText('Venue b')).toBeInTheDocument()
    expect(screen.getByTestId('results-header')).toHaveTextContent('2 galleries near London')
  })
})
