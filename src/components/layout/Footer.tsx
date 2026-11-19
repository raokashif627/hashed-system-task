import Image from 'next/image'
import Link from 'next/link'
import { ContactForm } from './ContactForm'
import { ThemeToggle } from './ThemeToggle'

const COLUMNS = [
  { title: 'Venuze', links: ['About', 'News', 'Careers', 'Investors'] },
  { title: 'Support', links: ['Listings your venue', 'Listing your service', 'Help center', 'FAQ'] },
  { title: 'Explore', links: ['Venue types', 'Venue features', 'Service options', 'Locations'] },
  { title: 'Legal & Privacy', links: ['Terms of service', 'Payment & refund policy', 'Host agreement', 'Vendor agreement'] },
]

const SOCIALS = [
  { label: 'Venuze on X', icon: '/images/social/x.svg', href: 'https://x.com' },
  { label: 'Venuze on Facebook', icon: '/images/social/facebook.svg', href: 'https://facebook.com' },
  { label: 'Venuze on Instagram', icon: '/images/social/instagram.svg', href: 'https://instagram.com' },
]

export function Footer() {
  return (
    <footer className="relative z-10 rounded-t-[30px] bg-black text-white md:rounded-t-[50px]">
      <div className="mx-auto max-w-[1440px] px-5 pt-14 pb-8 md:px-10 lg:px-[84px] lg:pt-[133px]">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-10">
          <div className="lg:max-w-[620px]">
            <div className="flex items-start gap-4 lg:gap-[25px]">
              <Image src="/images/logo.png" alt="Venuze" width={67} height={45} className="h-[45px] w-[67px] shrink-0 object-contain" />
              <p className="text-lg leading-8 font-semibold md:text-2xl md:leading-[45px]">
                Make it memorable—book the perfect venue and the pros who make it shine.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 lg:mt-[48px]">
              {COLUMNS.map((col) => (
                <div key={col.title}>
                  <h3 className="text-lg leading-[1.2] text-[#a6a6a6] lg:text-xl">{col.title}</h3>
                  <ul className="mt-2.5 text-xs leading-[1.75]">
                    {col.links.map((l) => (
                      <li key={l}>
                        <Link href="/" className="transition-colors hover:text-brand-400">
                          {l}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <ContactForm />
        </div>

        <div className="mt-12 flex flex-col-reverse items-center gap-6 border-t border-white/20 pt-8 sm:flex-row sm:justify-between lg:mt-[43px] lg:pt-[34px]">
          <div className="flex items-center gap-8">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="opacity-90 transition-opacity hover:opacity-100">
                <img src={s.icon} alt="" width={26} height={26} />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-6 text-sm text-[#9a9a9a]">
            <ThemeToggle withLabel className="text-[#9a9a9a] hover:text-white" />
            <p>© 2026 Venuze. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
