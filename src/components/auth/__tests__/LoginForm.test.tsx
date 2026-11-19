import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError, AxiosHeaders } from 'axios'
import { toast } from 'sonner'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '@/features/auth/store'
import { reqres } from '@/lib/axios'
import { LoginForm } from '../LoginForm'

const replace = vi.fn()
let params = new URLSearchParams()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace, push: vi.fn() }),
  useSearchParams: () => params,
}))
vi.mock('@/lib/axios', () => ({ reqres: { post: vi.fn(), get: vi.fn() } }))
vi.mock('sonner', () => ({ toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }) }))

function renderForm() {
  return render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { mutations: { retry: false } } })}>
      <LoginForm />
    </QueryClientProvider>,
  )
}

async function fillAndSubmit(email: string, password: string) {
  await userEvent.type(screen.getByLabelText('Email'), email)
  await userEvent.type(screen.getByLabelText('Password'), password)
  await userEvent.click(screen.getByRole('button', { name: /^log in$/i }))
}

describe('LoginForm', () => {
  beforeEach(() => {
    replace.mockReset()
    vi.mocked(reqres.post).mockReset()
    params = new URLSearchParams()
    useAuthStore.setState({ token: null, email: null })
  })

  it('sends an already signed-in visitor on to the dashboard', async () => {
    useAuthStore.setState({ token: 't', email: 'eve.holt@reqres.in' })
    renderForm()
    await vi.waitFor(() => expect(replace).toHaveBeenCalledWith('/dashboard'))
  })

  it('also toasts network failures', async () => {
    vi.mocked(reqres.post).mockRejectedValue(new AxiosError('Network Error', 'ERR_NETWORK'))
    renderForm()
    await fillAndSubmit('eve.holt@reqres.in', 'cityslicka')
    await vi.waitFor(() => expect(toast.error).toHaveBeenCalledWith('Network error. Check your connection and try again.'))
  })

  it('does not toast a wrong-email error, which is shown inline', async () => {
    vi.mocked(toast.error).mockClear()
    vi.mocked(reqres.post).mockRejectedValue(
      new AxiosError('Bad Request', 'ERR_BAD_REQUEST', undefined, undefined, {
        status: 400,
        statusText: 'Bad Request',
        data: { error: 'user not found' },
        headers: {},
        config: { headers: new AxiosHeaders() },
      }),
    )
    renderForm()
    await fillAndSubmit('nobody@x.com', 'secret12')
    await screen.findByRole('alert')
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('shows field errors and sends nothing on an empty submit', async () => {
    renderForm()
    await userEvent.click(screen.getByRole('button', { name: /^log in$/i }))
    expect(await screen.findByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Password is required')).toBeInTheDocument()
    expect(reqres.post).not.toHaveBeenCalled()
  })

  it('shows the reqres error as an alert', async () => {
    vi.mocked(reqres.post).mockRejectedValue(
      new AxiosError('Bad Request', 'ERR_BAD_REQUEST', undefined, undefined, {
        status: 400,
        statusText: 'Bad Request',
        data: { error: 'user not found' },
        headers: {},
        config: { headers: new AxiosHeaders() },
      }),
    )
    renderForm()
    await fillAndSubmit('nobody@x.com', 'secret12')
    expect(await screen.findByRole('alert')).toHaveTextContent('No account found with this email.')
  })

  it('stores the token and goes to the dashboard', async () => {
    vi.mocked(reqres.post).mockResolvedValue({ data: { token: 'QpwL5tke4Pnpja7X4' } })
    renderForm()
    await fillAndSubmit('eve.holt@reqres.in', 'cityslicka')
    await vi.waitFor(() => expect(replace).toHaveBeenCalledWith('/dashboard'))
    expect(useAuthStore.getState().token).toBe('QpwL5tke4Pnpja7X4')
  })

  it('refuses a wrong password for the demo account and stays signed out', async () => {
    vi.mocked(toast.error).mockClear()
    vi.mocked(reqres.post).mockResolvedValue({ data: { token: 'QpwL5tke4Pnpja7X4' } })
    renderForm()
    await fillAndSubmit('eve.holt@reqres.in', 'wrongpw')
    expect(await screen.findByRole('alert')).toHaveTextContent('Incorrect password.')
    expect(useAuthStore.getState().token).toBeNull()
    expect(replace).not.toHaveBeenCalled()
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('returns to the from path after login', async () => {
    params = new URLSearchParams('from=/dashboard?tab=bookings')
    vi.mocked(reqres.post).mockResolvedValue({ data: { token: 't' } })
    renderForm()
    await fillAndSubmit('eve.holt@reqres.in', 'cityslicka')
    await vi.waitFor(() => expect(replace).toHaveBeenCalledWith('/dashboard?tab=bookings'))
  })
})
