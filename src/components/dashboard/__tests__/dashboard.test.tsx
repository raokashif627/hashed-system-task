import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { toast } from 'sonner'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '@/features/auth/store'
import { cancelBooking, getBookings } from '@/features/bookings/service'
import type { BookingWithVenue } from '@/features/bookings/types'
import { useSavedStore } from '@/features/saved/store'
import type { Venue } from '@/features/venues/types'
import { BookingsPanel } from '../BookingsPanel'
import { ProfileCard } from '../ProfileCard'
import { SavedVenues } from '../SavedVenues'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams(),
}))
vi.mock('sonner', () => ({ toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }) }))

const venue = (id: string): Venue => ({
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
  featuredTabs: [],
  description: '',
})

vi.mock('@/features/venues/service', () => ({
  getVenues: vi.fn(() => Promise.resolve({ items: [venue('v1'), venue('v2'), venue('v3')], total: 3 })),
}))
vi.mock('@/features/bookings/service', () => ({
  getBookings: vi.fn(),
  cancelBooking: vi.fn(),
  requestBooking: vi.fn(),
}))

function wrap(ui: ReactNode) {
  return render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>{ui}</QueryClientProvider>,
  )
}

describe('SavedVenues', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: 't', email: 'eve.holt@reqres.in' })
    vi.mocked(toast).mockClear()
  })

  it('shows an empty state with a link to search', async () => {
    useSavedStore.setState({ ids: [] })
    wrap(<SavedVenues />)
    expect(await screen.findByText('No saved venues yet')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /explore venues/i })).toHaveAttribute('href', '/search')
  })

  it('removes an unsaved card and restores it with undo', async () => {
    useSavedStore.setState({ ids: ['v1', 'v2'] })
    wrap(<SavedVenues />)
    expect(await screen.findByText('Venue v1')).toBeInTheDocument()
    expect(screen.getByText('Venue v2')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Unsave Venue v1' }))
    expect(screen.queryByText('Venue v1')).toBeNull()

    const options = vi.mocked(toast).mock.calls.at(-1)?.[1] as unknown as { action: { onClick: () => void } }
    act(() => options.action.onClick())
    expect(await screen.findByText('Venue v1')).toBeInTheDocument()
  })
})

describe('BookingsPanel', () => {
  const future = (days: number) => {
    const d = new Date()
    d.setDate(d.getDate() + days)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  it('cancels optimistically and moves the booking to past', async () => {
    const list: BookingWithVenue[] = [
      { id: 'b1', venueId: 'v1', date: future(5), guests: 20, status: 'Confirmed', createdAt: '', venue: venue('v1') },
    ]
    vi.mocked(getBookings).mockResolvedValue(list)
    vi.mocked(cancelBooking).mockImplementation(() => new Promise(() => {}))
    wrap(<BookingsPanel />)

    const upcoming = await screen.findByRole('region', { name: 'Upcoming' })
    await userEvent.click(within(upcoming).getByRole('button', { name: /cancel/i }))
    const dialog = screen.getByRole('dialog', { name: 'Cancel this booking?' })
    await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel booking' }))

    const past = screen.getByRole('region', { name: 'Past' })
    expect(await within(past).findByText('Cancelled')).toBeInTheDocument()
    expect(within(screen.getByRole('region', { name: 'Upcoming' })).getByText('No upcoming bookings')).toBeInTheDocument()
  })
})

describe('ProfileCard', () => {
  it('offers a retry when the profile fails', async () => {
    const onRetry = vi.fn()
    render(<ProfileCard user={undefined} loading={false} error onRetry={onRetry} />)
    expect(screen.getByText("Couldn't load your profile")).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /retry/i }))
    expect(onRetry).toHaveBeenCalled()
  })

  it('shows the user details', () => {
    render(
      <ProfileCard
        user={{ id: 4, email: 'eve.holt@reqres.in', first_name: 'Eve', last_name: 'Holt', avatar: 'https://reqres.in/img/faces/4-image.jpg' }}
        loading={false}
        error={false}
        onRetry={() => {}}
      />,
    )
    expect(screen.getByText('Eve Holt')).toBeInTheDocument()
    expect(screen.getByText('eve.holt@reqres.in')).toBeInTheDocument()
  })
})
