export type City = 'London' | 'New York' | 'Dubai'

export type CategoryId =
  | 'all'
  | 'photo-studio'
  | 'film-studio'
  | 'warehouse'
  | 'gallery'
  | 'restaurant'
  | 'apartment'
  | 'office-space'
  | 'venue'
  | 'private-party'
  | 'meeting'

export type VenueType =
  | 'Office Space'
  | 'Meeting'
  | 'Private Party'
  | 'Villa'
  | 'Bar'
  | 'Loft'
  | 'Apartment'
  | 'Ballroom'
  | 'Restaurant'
  | 'Studio'
  | 'House'
  | 'Gallery'

export type Occasion =
  | 'Wedding'
  | 'Reception'
  | 'Ceremony'
  | 'Engagement'
  | 'Birthday'
  | 'Babyshower'
  | 'Concert/Performance'
  | 'Brand Launch'
  | 'Fashion Show'
  | 'Corporate Event'
  | 'Conference'
  | 'Pop-up'

export type FeaturedTab = 'Rooftop' | 'Gallery' | 'Restaurant' | 'Outdoor' | 'Studio' | 'Terrace' | 'Ballroom'

export type SortKey = 'recommended' | 'price-asc' | 'price-desc' | 'capacity-desc'

export interface Venue {
  id: string
  title: string
  city: City
  area: string
  lat: number
  lng: number
  images: string[]
  verified: boolean
  capacity: number
  sizeSqft: number
  amenities: string[]
  pricePerHour: number
  type: VenueType
  category: CategoryId
  occasions: Occasion[]
  featuredTabs: FeaturedTab[]
  description: string
}

export interface VenueFilters {
  city?: City
  guests?: number
  category: CategoryId
  q?: string
  types: VenueType[]
  capMin: number
  capMax: number
  priceMin: number
  priceMax: number
  occasions: Occasion[]
  verified: boolean
  sort: SortKey
}

export const DEFAULT_FILTERS: VenueFilters = {
  category: 'all',
  types: [],
  capMin: 10,
  capMax: 1500,
  priceMin: 10,
  priceMax: 30000,
  occasions: [],
  verified: false,
  sort: 'recommended',
}
