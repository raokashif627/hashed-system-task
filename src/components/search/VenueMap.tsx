'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useMemo } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import type { City, Venue } from '@/features/venues/types'

const PIN = L.divIcon({
  className: '',
  iconSize: [41, 48],
  iconAnchor: [20, 48],
  popupAnchor: [0, -44],
  html: `<svg width="41" height="48" viewBox="0 0 41 48" xmlns="http://www.w3.org/2000/svg"><path d="M20.5 47C20.5 47 39 30.5 39 19A18.5 18.5 0 0 0 2 19C2 30.5 20.5 47 20.5 47Z" fill="#ff5037" stroke="white" stroke-width="2"/><circle cx="20.5" cy="19" r="12" fill="white"/><path d="M14 13h4.2l2.3 7.2L22.8 13H27l-4.6 12h-3.8z" fill="#ff5037"/></svg>`,
})

const CITY_CENTERS: Record<City, [number, number]> = {
  London: [51.5072, -0.1276],
  'New York': [40.7306, -73.9866],
  Dubai: [25.2048, 55.2708],
}

function FitBounds({ venues, fallback }: { venues: Venue[]; fallback: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    if (!venues.length) {
      map.setView(fallback, 12)
      return
    }
    const bounds = L.latLngBounds(venues.map((v) => [v.lat, v.lng] as [number, number]))
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 })
  }, [map, venues, fallback])
  return null
}

interface VenueMapProps {
  venues: Venue[]
  onOpen: (id: string) => void
  city?: City
}

export function VenueMap({ venues, onOpen, city }: VenueMapProps) {
  const fallback = CITY_CENTERS[city ?? 'London']
  const center = useMemo<[number, number]>(() => (venues[0] ? [venues[0].lat, venues[0].lng] : fallback), [venues, fallback])

  return (
    <MapContainer center={center} zoom={12} scrollWheelZoom className="size-full" attributionControl>
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        className="venuze-tiles"
      />
      <FitBounds venues={venues} fallback={fallback} />
      {venues.map((v) => (
        <Marker key={v.id} position={[v.lat, v.lng]} icon={PIN} title={v.title}>
          <Popup closeButton={false} className="venuze-popup">
            <button type="button" onClick={() => onOpen(v.id)} className="block w-[200px] cursor-pointer text-left">
              <img src={v.images[0]} alt="" className="h-[125px] w-full rounded-[10px] object-cover" />
              <span className="mt-2 block text-sm font-semibold text-black">{v.title}</span>
              <span className="mt-0.5 block text-xs text-[#364153]">
                {v.area}, {v.city}
              </span>
            </button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
