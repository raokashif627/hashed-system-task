# Venuze — Hashed System Next.js Assignment

A venue-booking marketplace built from the provided Figma file: a pixel-close public site (home, search with map and filters, empty states), login against `reqres.in`, and a protected dashboard with saved venues and bookings.

- **Live demo:** _add your Vercel URL here_
- **Figma:** Hashed-System-NEXTJS-TYPESCRIPT-Assignment

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev            # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` / `npm start` | Production build and server |
| `npm test` | Unit and component tests (Vitest + Testing Library) |
| `npm run e2e` | Playwright end-to-end tests (builds into `.next-e2e`, serves on port 3100, calls the real reqres API) |
| `npm run lint` / `npm run typecheck` | ESLint and `tsc --noEmit` |

First E2E run: `npx playwright install chromium`.

### Environment

| Variable | Default | Why |
|---|---|---|
| `NEXT_PUBLIC_REQRES_API_KEY` | `reqres-free-v1` | reqres.in now rejects requests without an `x-api-key` header. |

## Test credentials

| Email | Password |
|---|---|
| `eve.holt@reqres.in` | `cityslicka` |

These are the credentials from the brief. Any other email returns reqres' `400 user not found`, which the form shows as "No account found with this email." Any password other than `cityslicka` shows "Incorrect password." and does not sign you in.

**Demo-only password check:** reqres.in is a mock API and does not verify passwords; it returns a token for a known email whatever the password is. So that the demo behaves like a real login, `login()` in `src/features/auth/api.ts` compares the password with `DEMO_PASSWORD` after reqres accepts the email. This check runs in the browser and the password ships in the bundle, so it is not security. With a real backend this line would be deleted and the server would verify the password.

## What's in the app

| Route | Notes |
|---|---|
| `/` | Hero with rotating backgrounds and Venue/Vendors search, categories, featured venues (tabbed, data-driven), vendors, how-it-works, stats and testimonials, destinations, two promo banners, footer with a validated contact form. The top bar turns solid and shows a compact search once you scroll past the hero. |
| `/search` | Keyword search, category strip, filter drawer (venue type, capacity, price, occasion, verified), removable filter chips, sorting, results grid and Leaflet map with Venuze pins and popups. On tablet and mobile the map opens full-screen from a floating **Map** button. |
| `/search?venue=<id>` | Venue quick-view modal (works on any page and is shareable). Logged-in users can **Request booking**, which adds a *Pending* booking to the dashboard. |
| `/search?mode=vendor` | Vendors "coming soon" state in the Figma empty-state style. |
| `/login` | Split layout login with validation, show/hide password, API error handling and `?from=` return. |
| `/dashboard` (protected) | Profile from reqres, stats, **Saved venues** (unsave with undo) and **My bookings** (upcoming/past, cancel with confirmation, optimistic update). Tabs sync to `?tab=`. |

UI states covered: skeleton loaders (cards, profile, bookings), button spinners, empty states (search, saved, bookings), error states (search, profile, bookings, route-level `error.tsx`, `global-error.tsx`, map error boundary), toasts, modals and drawers with focus trap and Escape, hover and transition states, 404 page, and dark mode.

**Try the error state:** open `/search?simulateError=1`.

## Tech stack and decisions

- **Next.js 15 (App Router) + TypeScript (strict).** Pinned to 15 because the brief asks for `middleware.ts`, which Next 16 renamed to `proxy.ts`. Route groups split `(public)`, `(auth)` and `(protected)` layouts.
- **Tailwind CSS v4.** Figma values live as tokens in `globals.css` `@theme` (brand `#ff5037`, accent `#fec432`, 10px/20px radii, Poppins). Dark mode swaps the CSS variables under `.dark`.
- **TanStack Query** for all async data (venues, featured, single venue, bookings, profile), with `keepPreviousData` while filters change, and optimistic mutations for cancelling and requesting bookings.
- **Two data fetching strategies.** `/search` is server-rendered with its first results already loaded: the page's Server Component reads `searchParams`, runs the same query on the server (`prefetchSearch` in `src/features/search/prefetch.ts`), and passes the cache to the client through `HydrationBoundary`. While that runs, the page streams a skeleton through `<Suspense>`. Server and client share the query definitions in `src/features/venues/queries.ts`, so the keys always match and the browser doesn't fetch again. Later filter changes and the quick view update the URL with `window.history.replaceState` / `pushState` instead of `router.replace`, so they are fetched in the browser (with `keepPreviousData`) and don't make a server round trip. The home page, dashboard and quick view fetch only in the browser.
- **Zustand** (with `persist`) for client state that must survive reloads: the auth session and saved venue IDs.
- **React Hook Form + Zod** for login, booking requests and the footer contact form.
- **Axios** for reqres, with a single instance that adds the API key.
- **Leaflet / react-leaflet** with OpenStreetMap tiles, loaded through `next/dynamic` with `ssr: false` so it never touches the server or the initial bundle.
- **sonner** for toasts, **lucide-react** for icons not exported from Figma, **next-themes** for dark mode.

## State management

| State | Lives in | Why |
|---|---|---|
| Search, filters, sort, category, mode, open venue (`?venue=`), dashboard tab | **URL** | Shareable links, back/forward work, and no state to sync. |
| Auth session (`token`, `email`), saved venue IDs | **Zustand + localStorage** | Must survive reloads, and is read synchronously by many components. |
| Shared UI state: filters drawer and full-screen mobile map (`src/features/ui/store.ts`) | **Zustand (in memory)** | Any component can open or close them without prop drilling; opening one closes the other, and both reset when leaving the search page. |
| Server/mock data and mutations | **TanStack Query** | Caching, loading and error states, retries, optimistic updates, invalidation after mutations. |
| Purely local UI (dropdown open, password visibility, form drafts) | **Component state** | Owned by a single component and short-lived. |

## Auth flow and security trade-off

1. The login form calls `POST https://reqres.in/api/login` directly through Axios.
2. On success the token goes into a persisted Zustand store **and** a `venuze_token` cookie (`SameSite=Lax`, 7 days).
3. `src/middleware.ts` reads that cookie. Visitors without it are sent from `/dashboard` to `/login?from=…`, and signed-in visitors are sent from `/login` to `/dashboard`. `from` is validated so it can only point to a same-site path (no open redirects).
4. On reload the store re-writes the cookie, so a missing cookie can't strand a signed-in user.
5. Logout clears the store, the cookie and the cached profile.

**Trade-off:** the token can be read by JavaScript (localStorage plus a non-httpOnly cookie). That was a deliberate choice for this demo API, to keep the flow fully client-side and easy to follow. In production the token would be set as an **httpOnly** cookie by a Next.js Route Handler proxying the login request, so scripts could never read it.

**reqres quirk:** reqres returns `401` to any request that carries `Authorization: Bearer …`, even with a valid API key. The Axios client therefore sends only `x-api-key`, and the token works purely as the session marker.

## Assumptions

- **Not in Figma, designed in the Venuze style:** login, dashboard, venue quick-view, booking flow, 404 and error pages, and dark mode.
- **Mock data:** venues (30, across London, New York and Dubai) and bookings are bundled JSON behind async services with ~700ms latency, so loading states are visible. Bookings and saved venues persist in localStorage.
- **Prices** are shown in USD to match the Figma cards (`From $50/hour`), so the filter reads "Price per hour (USD)" instead of the Figma "AED".
- **Vendors**, "Add your listing", "Join as a Vendor", "List Your Venue" and the language switcher show a "coming soon" message.
- **Search date** is carried in the URL and shown in the top bar, but does not filter, since mock venues have no availability calendar.
- **Brand orange on small text** (card location, "View details") follows Figma exactly, even though it is under WCAG AA contrast for small text.

## Challenges

- **Figma MCP call limit.** The Starter plan's MCP quota ran out midway. Copy, sizes and layout for the remaining sections came from the full node export taken earlier. A few images (testimonial portraits, city photos, banner illustrations, category icons) are stand-ins until they can be re-exported.
- **reqres changes.** The API now needs an `x-api-key` header and rejects Bearer headers (see above).
- **Map tiles.** CARTO's light basemap now requires a key, so the map uses OpenStreetMap tiles with a CSS filter that softens them to match the Figma map.

## Project structure

```
src/
  app/
    (public)/            home, search, shared footer + quick-view
    (auth)/login/        login page
    (protected)/dashboard/  dashboard (guarded by middleware)
    layout.tsx, providers.tsx, not-found.tsx, error.tsx, global-error.tsx
  middleware.ts          cookie-based route protection
  components/
    ui/                  Button, Chip, Input, Modal, Drawer, Tabs, Toggle, RangeSlider, Skeleton, EmptyState
    layout/              TopBar, CompactSearch, UserMenu, Footer, ContactForm, Logo, ThemeToggle
    home/                one component per home section
    search/              SearchView, CategoryStrip, FiltersDrawer, FilterChips, VenueMap
    venue/               VenueCard, ImageCarousel, QuickViewModal, RequestBookingForm
    dashboard/           DashboardView, ProfileCard, SavedVenues, BookingsPanel
  features/              domain logic + hooks per feature (auth, venues, search, saved, bookings, quickview)
  data/                  venues.json, bookings.json (mock)
  hooks/, lib/           shared hooks and utilities (axios, cookies, format, cn)
e2e/                     Playwright specs
docs/superpowers/        design spec and implementation plan
```

Tests sit next to the code they cover, in `__tests__` folders.