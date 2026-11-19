
import { MapPin } from 'lucide-react'
import Link from 'next/link'
import { SectionHeader } from './SectionHeader'

const DESTINATIONS = [
  {
    city: 'New York',
    label: 'New York, USA',
    venues: 24,
    popular: 'Rooftop',
    from: 50,
    tagline: 'Coastal energy, modern Venue',
    bg: 'bg-[radial-gradient(120%_80%_at_20%_10%,#5b7fb8_0%,#1e2a44_55%,#0d121d_100%)]',
    image: '/images/destination/destination-1.png'
  },
  {
    city: 'London',
    label: 'London, UK',
    venues: 108,
    popular: 'Gallery',
    from: 25,
    tagline: 'Historic charm, creative spaces',
    bg: 'bg-[radial-gradient(120%_80%_at_80%_10%,#9aa7b5_0%,#3c4652_55%,#171b21_100%)]',
    image: '/images/destination/destination-2.png'
  },
  {
    city: 'Dubai',
    label: 'Dubai, UAE',
    venues: 17,
    popular: 'Ballroom',
    from: 75,
    tagline: 'Skyline views, luxury venues',
    bg: 'bg-[radial-gradient(120%_80%_at_50%_0%,#f6c27a_0%,#c2703c_45%,#3b1e12_100%)]',
    image: '/images/destination/destination-3.png'
  },
]

export function Destinations() {
  return (
    <section className="bg-surface px-4 py-14 md:px-8 lg:px-[81px] lg:pt-[97px] lg:pb-[60px]">
      <SectionHeader
        title="Discover Exceptional Destinations Across the Region"
        subtitle="From cosmopolitan cityscapes to cultural treasures, explore where celebrations come alive with local flavor."
      />

      <ul className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 md:mx-auto md:grid md:max-w-[1277px] md:grid-cols-3 md:overflow-visible md:px-0 lg:mt-[30px]">
        {DESTINATIONS.map((d) => (
          <li key={d.city} className="w-[80vw] max-w-[409px] shrink-0 snap-start md:w-auto md:max-w-none">
            <Link
              href={`/search?city=${encodeURIComponent(d.city)}`}
              style={{
                backgroundImage: `url(${d.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              className={`group relative flex h-[420px] flex-col justify-end overflow-hidden rounded-card p-5 text-white md:h-[500px]`}
            >
              <MapPin aria-hidden className="absolute top-1/3 left-1/2 size-28 -translate-x-1/2 -translate-y-1/2 text-white/10 transition-transform duration-500 group-hover:scale-110" />

              <span className="absolute top-[17px] left-5 rounded-full bg-black/50 px-[15px] py-2 text-xs leading-5 font-semibold">
                {d.venues} Venues
              </span>

              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.75)_100%)]" />

              <div className="relative">
                <h3 className="text-[28px] leading-9 font-semibold">{d.label}</h3>
                <p className="mt-1 text-sm text-white/90">{d.tagline}</p>

                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
                    Popular: {d.popular}
                  </span>
                  <span>
                    From <strong>${d.from}</strong> per hour
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
