import { CategoryCard } from './CategorySection'
import { ScrollRow } from './ScrollRow'
import { SectionHeader } from './SectionHeader'

const VENDORS = [
  { title: 'Caterers', image: '/images/venues/v8.png' },
  { title: 'Decorators', image: '/images/categories-home/private-party.png' },
  { title: 'Photographers', image: '/images/venues/v7.jpg' },
  { title: 'Entertainment', image: '/images/categories-home/celebration.png' },
]

export function VendorsSection() {
  return (
    <section className="bg-cream px-4 py-14 md:px-8 lg:px-[82px] lg:pt-[67px] lg:pb-[59px]">
      <SectionHeader
        title="Complete Your Event with our Trusted Vendors"
        subtitle="Venues are just the beginning. Discover caterers, decorators, photographers, entertainment, and more all in one place, ready to bring your event project to life."
      />
      <ScrollRow label="vendor categories" className="mx-auto mt-10 max-w-[1278px] lg:mt-[52px]">
        {VENDORS.map((v) => (
          <CategoryCard key={v.title} title={v.title} image={v.image} href="/search?mode=vendor" />
        ))}
      </ScrollRow>
    </section>
  )
}
