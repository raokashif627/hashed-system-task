import { z } from 'zod'

export function bookingRequestSchema(capacity: number, today: string) {
  return z.object({
    date: z
      .string()
      .min(1, 'Choose a date')
      .refine((d) => !d || d >= today, "Date can't be in the past"),
    guests: z.coerce
      .number({ invalid_type_error: 'Enter the number of guests' })
      .int('Use a whole number')
      .min(1, 'At least 1 guest')
      .max(capacity, `This venue fits up to ${capacity} guests`),
  })
}

export type BookingRequestValues = z.infer<ReturnType<typeof bookingRequestSchema>>
