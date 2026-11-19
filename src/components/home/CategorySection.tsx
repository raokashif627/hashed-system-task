import Image from 'next/image'
import Link from 'next/link'
import { ScrollRow } from './ScrollRow'
import { SectionHeader } from './SectionHeader'

const CARDS = [
  { title: 'Celebration Venues', image: '/images/categories-home/celebration.png', href: '/search?category=venue', count: 37 },
  { title: 'Private Party Venues', image: '/images/categories-home/private-party.png', href: '/search?category=private-party', count: 37 },
  { title: 'Corporate Meetings', image: '/images/categories-home/corporate.png', href: '/search?category=meeting', count: 37 },
  { title: 'Creative Studios', image: '/images/categories-home/creative.png', href: '/search?category=photo-studio', count: 37 },
]

export function CategoryCard({ title, image, href, badge }: { title: string; image: string; href: string; badge?: string }) {
  return (
    <Link
      href={href}
      className="group relative block h-[400px] w-[78vw] max-w-[301px] shrink-0 snap-start overflow-hidden rounded-card md:w-[301px] lg:w-[calc((100%-75px)/4)]"
    >
      <Image src={image} alt="" fill sizes="301px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_30.28%,rgba(0,0,0,0.81)_100%)]" />
      {badge && (
        <span className="absolute top-[17px] left-5 rounded-full bg-black/50 px-[15px] py-2 text-xs leading-5 font-semibold text-white">{badge}</span>
      )}
      <h3 className="absolute right-5 bottom-[30px] left-5 text-[30px] leading-[30px] font-semibold tracking-[-0.9px] text-white">{title}</h3>
    </Link>
  )
}

export function CategorySection() {
  return (
    <section className="bg-surface px-4 py-14 md:px-8 lg:px-[87px] lg:pt-[75px] lg:pb-[77px]">
      <SectionHeader
        title="Find The Best Venue For Any Occasion"
        subtitle="Explore venues by category, from timeless ballrooms and rooftops with a view to modern studios and outdoor gardens, discover spaces designed to inspire unforgettable experiences."
      />
      <ScrollRow label="venue categories" className="mx-auto mt-10 max-w-[1280px] lg:mt-[49px]">
        {CARDS.map((c) => (
          <CategoryCard key={c.title} title={c.title} image={c.image} href={c.href} badge={`${c.count} Venues`} />
        ))}
      </ScrollRow>
    </section>
  )
}
