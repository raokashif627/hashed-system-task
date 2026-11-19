'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { bookingRequestSchema } from '@/features/bookings/schema'
import type { BookingRequest } from '@/features/bookings/types'

interface RequestBookingFormProps {
  venueId: string
  capacity: number
  today: string
  onSubmit: (request: BookingRequest) => void
  loading?: boolean
}

interface FormValues {
  date: string
  guests: number
}

export function RequestBookingForm({ venueId, capacity, today, onSubmit, loading = false }: RequestBookingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(bookingRequestSchema(capacity, today)),
    defaultValues: { date: '', guests: Math.min(10, capacity) },
  })

  return (
    <form onSubmit={handleSubmit((v) => onSubmit({ venueId, date: v.date, guests: Number(v.guests) }))} noValidate className="space-y-4">
      <Input label="Date" type="date" min={today} error={errors.date?.message} {...register('date')} />
      <Input
        label="Guests"
        type="number"
        inputMode="numeric"
        min={1}
        max={capacity}
        hint={`Up to ${capacity} guests`}
        error={errors.guests?.message}
        {...register('guests')}
      />
      <Button type="submit" size="lg" className="w-full" loading={loading}>
        Request booking
      </Button>
      <p className="text-center text-xs text-muted">You won&apos;t be charged yet. The host confirms within 24 hours.</p>
    </form>
  )
}
