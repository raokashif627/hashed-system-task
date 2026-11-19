import { PartyPopper } from 'lucide-react'
import Image from 'next/image'
import { SectionHeader } from './SectionHeader'

const STEPS = [
  {
    title: 'Search & filter',
    body: 'Browse our curated collection of venues and event professionals. Use smart filters, high-quality visuals, and authentic reviews to find options that fit your needs, style, and budget.',
  },
  {
    title: 'Compare & message',
    body: 'Communicate directly with venue hosts and service providers. Request tailored quotes, discuss requirements, and design every detail of your event or project with confidence.',
  },
  {
    title: 'Book & add services',
    body: 'Secure your choices with ease through our protected booking system. With clear agreements, secure payments, and ongoing support, you can move forward knowing everything is handled.',
  },
]

export function PathSection() {
  return (
    <section className="bg-surface px-4 py-14 md:px-8 lg:px-[120px] lg:pt-[88px] lg:pb-[53px]">
      <SectionHeader
        title="Your Path to the Perfect Venue"
        subtitle="Planning an event, production, or gathering shouldn’t feel complicated. Our streamlined process connects you with the right venues and trusted professionals, taking the stress out of logistics so you can focus on what matters most making it a success."
      />
      <div className="mx-auto mt-12 flex max-w-[1168px] flex-col items-center gap-12 lg:mt-[22px] lg:flex-row lg:items-start lg:justify-between">
        <div className="relative h-[300px] w-full max-w-[400px] sm:h-[407px] sm:max-w-[515px]">
          <div className="absolute bottom-0 left-0 h-[85%] w-[48%] overflow-hidden rounded-card shadow-lg">
            <Image src="/images/venues/v8.png" alt="Banquet tables set for a wedding" fill sizes="250px" className="object-cover" />
          </div>
          <div className="absolute top-0 right-0 h-[85%] w-[48%] overflow-hidden rounded-card shadow-lg">
            <Image src="/images/venues/v6.png" alt="Planners meeting around a table" fill sizes="250px" className="object-cover" />
          </div>
          <div className="absolute top-1/2 left-1/2 flex size-[100px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[6px] border-surface bg-brand-50 shadow-xl sm:size-[131px]">
            <PartyPopper className="size-10 text-brand-500 sm:size-[52px]" strokeWidth={1.6} />
          </div>
        </div>

        <ol className="relative flex max-w-[604px] flex-col gap-10 lg:mt-8">
          <span aria-hidden className="absolute top-6 bottom-6 left-[24px] w-px border-l-2 border-dashed border-brand-200" />
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative flex gap-6 lg:gap-[31px]">
              <span className="relative z-10 flex size-[50px] shrink-0 items-center justify-center rounded-full bg-brand-500 text-xl font-semibold text-white shadow-[0_0_0_6px_var(--color-brand-100)]">
                {i + 1}
              </span>
              <div>
                <h3 className="text-xl leading-[30px] font-semibold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-[22px] text-body">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
