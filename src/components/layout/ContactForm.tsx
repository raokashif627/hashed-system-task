'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Spinner } from '@/components/ui/Spinner'
import { sleep } from '@/lib/sleep'

const schema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters'),
})

type Values = z.infer<typeof schema>

const FIELD =
  'w-full rounded-[12px] border border-[#4a4a4a] bg-[#1d1d1d] px-5 text-base text-white placeholder:text-white outline-none transition-colors focus:border-brand-500'

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: '', message: '' } })

  async function onSubmit() {
    await sleep(800)
    toast.success("Thanks! We'll be in touch.")
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full lg:w-[516px]">
      <h2 className="text-2xl leading-[30px] font-semibold text-white">Get in Touch</h2>
      <div className="mt-[17px]">
        <label htmlFor="contact-email" className="sr-only">
          Email Address
        </label>
        <input
          id="contact-email"
          type="email"
          placeholder="Email Address"
          aria-invalid={Boolean(errors.email) || undefined}
          className={`${FIELD} h-11`}
          {...register('email')}
        />
        {errors.email && <p className="mt-1 text-xs text-brand-300">{errors.email.message}</p>}
      </div>
      <div className="mt-[17px]">
        <label htmlFor="contact-message" className="sr-only">
          Message
        </label>
        <textarea
          id="contact-message"
          placeholder="Message"
          aria-invalid={Boolean(errors.message) || undefined}
          className={`${FIELD} h-[148px] resize-none rounded-btn py-[15px]`}
          {...register('message')}
        />
        {errors.message && <p className="mt-1 text-xs text-brand-300">{errors.message.message}</p>}
      </div>
      <div className="mt-[17px] flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-[50px] cursor-pointer items-center gap-2 rounded-btn bg-brand-500 px-[37px] text-xl font-semibold tracking-[-0.6px] text-white transition-colors hover:bg-brand-600 disabled:opacity-70"
        >
          {isSubmitting && <Spinner />}
          Send
        </button>
      </div>
    </form>
  )
}
