import { Suspense } from 'react'
import { CategorySection } from '@/components/home/CategorySection'
import { Destinations } from '@/components/home/Destinations'
import { FeaturedVenues } from '@/components/home/FeaturedVenues'
import { Hero } from '@/components/home/Hero'
import { PathSection } from '@/components/home/PathSection'
import { PromoBanner } from '@/components/home/PromoBanner'
import { TrustSection } from '@/components/home/TrustSection'
import { VendorsSection } from '@/components/home/VendorsSection'
import { TopBar } from '@/components/layout/TopBar'

export default function Home() {
  return (
    <>
      <TopBar variant="overlay" />
      <main>
        <Hero />
        <CategorySection />
        <Suspense fallback={<div className="min-h-[800px] bg-night" />}>
          <FeaturedVenues />
        </Suspense>
        <VendorsSection />
        <div className="bg-[linear-gradient(180deg,var(--cream)_50%,var(--surface)_50%)] px-4 md:px-8 lg:px-[81px]">
          <PromoBanner
            title="Grow Your Business with Venuze"
            description="Showcase your services to thousands of event organizers and creators searching for talent like yours."
            cta="Join as a Vendor"
            feature="Vendor sign-up"
          />
        </div>
        <PathSection />
        <TrustSection />
        <Destinations />
        <div className="bg-surface px-4 pb-16 md:px-8 lg:px-[80px] lg:pb-[100px]">
          <PromoBanner
            title="Turn Your Venue into a Destination"
            description="List your space on Venuze and unlock new revenue opportunities. Reach clients looking for venues just like yours."
            cta="List Your Venue"
            feature="Listing your venue"
          />
        </div>
      </main>
    </>
  )
}
