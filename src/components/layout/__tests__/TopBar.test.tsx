import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '@/features/auth/store'
import { TopBar } from '../TopBar'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('@/features/auth/api', () => ({
  getUserByEmail: vi.fn().mockResolvedValue({
    id: 4,
    email: 'eve.holt@reqres.in',
    first_name: 'Eve',
    last_name: 'Holt',
    avatar: 'https://reqres.in/img/faces/4-image.jpg',
  }),
  login: vi.fn(),
}))

function wrap(ui: ReactNode) {
  return <QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>
}

describe('TopBar', () => {
  beforeEach(() => useAuthStore.setState({ token: null, email: null }))

  it('links to login when logged out', async () => {
    render(wrap(<TopBar variant="solid" />))
    const link = await screen.findByRole('link', { name: /log in/i })
    expect(link).toHaveAttribute('href', '/login')
  })

  it('shows an account menu with dashboard and log out when logged in', async () => {
    useAuthStore.setState({ token: 't', email: 'eve.holt@reqres.in' })
    render(wrap(<TopBar variant="solid" />))
    await userEvent.click(await screen.findByRole('button', { name: /account menu/i }))
    expect(screen.getByRole('menuitem', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /log out/i })).toBeInTheDocument()
  })
})
