import type { CategoryId, City, FeaturedTab, Occasion, VenueType } from './types'

export const CATEGORIES: readonly { id: CategoryId; label: string; one: string; many: string }[] = [
  { id: 'all', label: 'All Spaces', one: 'space', many: 'spaces' },
  { id: 'photo-studio', label: 'Photo Studio', one: 'photo studio', many: 'photo studios' },
  { id: 'film-studio', label: 'Film Studio', one: 'film studio', many: 'film studios' },
  { id: 'warehouse', label: 'Warehouse', one: 'warehouse', many: 'warehouses' },
  { id: 'gallery', label: 'Gallery', one: 'gallery', many: 'galleries' },
  { id: 'restaurant', label: 'Restaurant', one: 'restaurant', many: 'restaurants' },
  { id: 'apartment', label: 'Apartment', one: 'apartment', many: 'apartments' },
  { id: 'office-space', label: 'Office Space', one: 'office space', many: 'office spaces' },
  { id: 'venue', label: 'Venue', one: 'venue', many: 'venues' },
  { id: 'private-party', label: 'Private Party', one: 'party space', many: 'party spaces' },
  { id: 'meeting', label: 'Meeting', one: 'meeting room', many: 'meeting rooms' },
]

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id)

export const VENUE_TYPES: readonly VenueType[] = [
  'Office Space',
  'Meeting',
  'Private Party',
  'Villa',
  'Bar',
  'Loft',
  'Apartment',
  'Ballroom',
  'Restaurant',
  'Studio',
  'House',
  'Gallery',
]

export const OCCASIONS: readonly Occasion[] = [
  'Wedding',
  'Reception',
  'Ceremony',
  'Engagement',
  'Birthday',
  'Babyshower',
  'Concert/Performance',
  'Brand Launch',
  'Fashion Show',
  'Corporate Event',
  'Conference',
  'Pop-up',
]

export const FEATURED_TABS: readonly FeaturedTab[] = [
  'Rooftop',
  'Gallery',
  'Restaurant',
  'Outdoor',
  'Studio',
  'Terrace',
  'Ballroom',
]

export const CITIES: readonly { id: City; label: string }[] = [
  { id: 'Dubai', label: 'Dubai, UAE' },
  { id: 'London', label: 'London, UK' },
  { id: 'New York', label: 'New York, USA' },
]

export const SORT_OPTIONS = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'capacity-desc', label: 'Capacity: largest' },
] as const
