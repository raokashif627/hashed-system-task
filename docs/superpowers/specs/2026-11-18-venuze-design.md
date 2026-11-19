# Venuze — Hashed System Next.js Assignment: Design

Date: 2026-11-18
Figma (working copy): https://www.figma.com/design/S3T1xuSfFMEu9Ctn3u9CiA/Hashed-System-NEXTJS-TYPESCRIPT-Assignment--Copy- (page `0:1`)
Assignment brief: Google Doc `13AmGlKBkU7bxVt1IjFOvEnMFWqVi0Swil50gcRaa138`

## 1. Intent

A take-home assignment for Hashed System. The deliverable is a production-quality
Next.js + TypeScript frontend for **Venuze**, a venue/vendor booking marketplace, built
from the provided Figma file. It is graded, in order of weight, on:

1. **Design accuracy** against Figma (biggest weight)
2. **Responsiveness** (mobile 375, tablet 768, desktop 1440)
3. **Next.js / React architecture**

The candidate must be able to defend every decision in a technical interview, so the
code should be simple, idiomatic, and explainable rather than clever.

Hard deadline: 24 hours from start. Ship: GitHub repo with real commit history, live
Vercel deployment, README.

## 2. Goals / Non-goals / Anti-goals

**Goals**
- Pixel-close implementation of every Figma frame (listed in §5) at all three breakpoints,
  including hover, loading, and empty states.
- Login against `https://reqres.in/api/login`, persisted auth, protected routes enforced
  by `middleware.ts`, logout.
- A protected dashboard (not in Figma) in the Venuze visual language.
- Required stack used meaningfully, not decoratively: Next.js 15+ App Router, TypeScript,
  Tailwind CSS, TanStack Query, Zustand, React Hook Form, Axios.
- UI states: skeleton loaders, loading indicators, empty states, error states, toasts,
  modals, transitions.
- Bonus where cheap: dark mode, unit tests, one E2E smoke test, custom hooks, a11y, error
  boundaries, optimistic updates.

**Non-goals**
- Real backend, real bookings, payments, real search.
- Vendor flows ("Add your listing", "Join as a Vendor", "List Your Venue") beyond a
  styled button/link that shows a "Coming soon" toast.
- i18n — the `EN` language switcher is visual only.
- Sign-up flow — reqres `/register` is not required; the "Sign up" / person icon in the
  top bar routes to `/login`.

**Anti-goals** (would be a failure even if it "works")
- Visible drift from Figma: wrong font, wrong orange, wrong radii/spacing, generic
  Tailwind look.
- Horizontal scroll or broken layout at any width between 320 and 1920.
- A dashboard that looks like a different product.
- Over-engineering that the candidate can't explain in the interview.

## 3. Constraints

- **reqres.in requires an API key** header: `x-api-key: reqres-free-v1`. Without it
  login returns 401. Valid test credentials: `eve.holt@reqres.in` / any non-empty password
  (e.g. `cityslicka`). Any other email returns `400 {"error":"user not found"}` — this is
  the error path to display.
- reqres returns only `{ token }` from login. User profile comes from
  `GET /api/users/4` (Eve Holt's id is 4).
- No venue data source exists. All venue/vendor/booking data is mock.
- Node 23, npm 10, git available on the dev machine. Deploy target Vercel.

## 4. Approaches considered

| | Approach | Trade-off |
|---|---|---|
| A | **Server-first**: login proxied through a Next Route Handler, token in httpOnly cookie, Server Components for public pages, Route Handlers serve mock data | More files; token unreachable by JS; strongest security answer |
| **B ✅** | **Client-first**: login form calls reqres directly via Axios; token held in Zustand (persisted to localStorage) and mirrored to a plain cookie so `middleware.ts` can read it; mock data from a client-side service module via TanStack Query | Faster to build, fewer moving parts; token is JS-readable (XSS exposure) — acknowledged in README as a conscious trade-off for an assignment with a public demo API |
| C | NextAuth/Auth.js | Heavy for one reqres endpoint; hides the middleware logic the brief wants to see. Rejected. |

**Chosen: B (client-first)** — picked by the candidate.

README must include a "Security trade-off" note: in production the token would live in
an httpOnly cookie set by a server route (approach A).

## 5. Screens

### 5.1 From Figma (implement to match)

| Route | Figma frames | Notes |
|---|---|---|
| `/` | `491:20` Venuze Home Page (1440), `491:3426`/`491:4589` Home iPad (768), `491:5531` Home Mobile (375), `1:783` Laptop View, `1:913` Ipad View, `1:676` Mobile View (hero) | Full landing page, see §5.3 |
| top bar on scroll | `1:750` Top Bar, `372:13` Mobile View When Scroll, `372:15` Medium Screen View When Scroll | Hero search collapses into a compact pill search in the sticky top bar once the hero search scrolls out of view |
| `/search` | `491:1255` Search Results, `491:5361` Map iPad | Category strip, active filter chips, sort, venue grid (left) + map (right) |
| `/search` (empty) | `491:2325` No data found | Illustration + "No data found for your search." + helper text |
| search bar state | `491:3331` Search Bar | Venue/Vendors toggle above Where / When / Guests / Search |
| Filters modal | `622:32` Filter Popup | Right-side drawer: Venue Type chips, Capacity range, Price/hour (AED) range, Event/Occasion chips, Verified Only toggle, Clear All / Apply Filters |

### 5.2 Not in Figma (design in Venuze style)

- `/login` — split layout on ≥lg: left half the hero photo with dark overlay + headline
  "Make it memorable", right half a white card with logo, "Welcome back", email +
  password (show/hide), primary orange "Log in" button, helper text showing the reqres
  test email. Single column card over the photo on mobile.
- `/dashboard` (protected) — same top bar as the public site, then:
  - **Profile card**: avatar, name, email from reqres `/api/users/4`; skeleton while
    loading; error state with retry.
  - **Tabs**: "Saved venues" | "My bookings".
  - **Saved venues**: grid of the same `VenueCard` used on `/search`; heart toggles
    unsave with optimistic removal + undo toast; empty state reuses the "No data found"
    illustration style with CTA "Explore venues" → `/search`.
  - **My bookings**: "Upcoming" and "Past" sections, each a list of booking rows
    (venue thumbnail, name, date, guests, status pill: Confirmed / Pending / Completed /
    Cancelled). "Cancel" on upcoming opens a confirm modal; confirming flips status
    optimistically. Empty state per section.
- Any route: 404 page and global error boundary page in Venuze style.
- **Venue quick-view modal** (candidate decided): clicking a `VenueCard` image/title or
  "View details" opens a modal (URL `?venue=<id>` so it is shareable and Esc/back
  closes it). Contents: image gallery (Embla), title, location, verified badge,
  capacity / size / amenities, price per hour, short description, and a
  "Request booking" form (date + guests, RHF + Zod). Logged out → toast with link to
  `/login?from=<current url>`. Logged in → `useRequestBooking` mutation adds a
  `Pending` booking (optimistic) and toasts "Request sent — see My bookings".
  `getVenueById` backs the modal. No `/venues/[id]` route.
- **Vendors mode** (candidate decided): `/search?mode=vendor` (from the hero
  Vendors toggle or a vendor category card) keeps the search page chrome but renders
  an empty state in the "No data found" style: "Vendors are coming soon" + button
  "Search venues instead" that switches `mode` to `venue`. No vendor cards, filters,
  or `vendors.json` data beyond the four home-page category tiles.

### 5.3 Home page sections (order, top → bottom)

1. Hero carousel (background image slides + dot indicator), top bar overlaid
   (logo, "Add your listing ▾", `EN ▾`, person icon), headline "Celebrate in venues big
   and small", Venue/Vendors toggle, search form (Where / When / Guests / Search).
   Submitting navigates to `/search?city=…&date=…&guests=…&mode=venue|vendor`.
2. "Find The Best Venue For Any Occasion" — category image cards (Celebration Venues,
   Private Party Venues, Corporate Meetings, Creative Studios) with prev/next arrows.
3. "Featured Venues" — dark background, filter tabs (Rooftop, Gallery, Restaurant,
   Outdoor, Studio, Terrace, Ballroom…), venue cards carousel. Data via TanStack Query
   → skeleton cards while loading.
4. "Complete Your Event with our Trusted Vendors" — Caterers, Decorators, Photographers,
   Entertainment cards with arrows.
5. "Grow Your Business with Venuze" orange gradient banner + "Join as a Vendor".
6. "Your Path to the Perfect Venue" — collage + 3 numbered steps.
7. "Trusted by Event Creators…" — 4 stat tiles (1,500+, 7,500+, 35+, 4.9★) + testimonial
   carousel.
8. "Discover Exceptional Destinations Across the Region" — New York, London, Dubai cards.
9. "Turn Your Venue into a Destination" orange banner + "List Your Venue".
10. Footer — logo + tagline, link columns (Venuze, Support, Explore, Legal & Privacy),
    "Get in Touch" form (email, message, Send — validated with RHF, success toast),
    socials, copyright.

## 6. Architecture

### 6.1 Stack

- Next.js 15 App Router, React 19, TypeScript strict.
- Tailwind CSS v4 with design tokens in `@theme` (`globals.css`).
- TanStack Query v5 (+ Devtools in dev).
- Zustand v5 with `persist` middleware.
- React Hook Form + Zod (`@hookform/resolvers`).
- Axios (one instance for reqres with `x-api-key` and auth interceptor).
- `sonner` for toasts, `embla-carousel-react` for carousels,
  `react-leaflet` + CARTO "light_all" tiles for the map, `lucide-react` for icons not
  exported from Figma. `next-themes` for dark mode.
- Font: **Poppins** via `next/font/google` (matches Figma visually; builder to confirm
  in `get_design_context` output and swap if Figma says otherwise).
- Testing: Vitest + Testing Library (unit), Playwright (one E2E: login → dashboard →
  logout, and protected-route redirect).

### 6.2 Folder structure

```
src/
  app/
    (public)/layout.tsx        TopBar + Footer
    (public)/page.tsx          home
    (public)/search/page.tsx
    (auth)/login/page.tsx
    (protected)/dashboard/page.tsx
    layout.tsx                 fonts, Providers
    providers.tsx              QueryClientProvider, ThemeProvider, Toaster
    not-found.tsx, error.tsx, global-error.tsx
  middleware.ts
  components/
    ui/                        Button, Chip, Input, Modal/Drawer, Skeleton, Tabs, Toggle, RangeSlider, EmptyState
    layout/                    TopBar, CompactSearch, Footer
    home/                      one file per section
    search/                    CategoryStrip, FilterChips, SortMenu, VenueGrid, VenueMap, FiltersDrawer
    venue/                     VenueCard, VenueCardSkeleton
    dashboard/                 ProfileCard, SavedVenues, BookingList, CancelBookingModal
  features/
    auth/                      api.ts, store.ts, hooks (useLogin, useLogout, useCurrentUser), schema.ts
    venues/                    service.ts (mock), hooks (useVenues, useFeaturedVenues), types.ts
    saved/                     store.ts, hooks (useToggleSaved)
    bookings/                  service.ts (mock), hooks (useBookings, useCancelBooking)
    search/                    useSearchParamsState.ts, filter types
  lib/
    axios.ts, query-client.ts, cookies.ts, cn.ts, sleep.ts
  data/                        venues.json, vendors.json, bookings.json, categories.ts
public/images/                 assets exported from Figma
```

### 6.3 Auth flow (approach B)

1. `/login` form (RHF + Zod: email format, password required ≥ 6 chars per assignment
   "validation"; note reqres accepts any password for Eve).
2. `useLogin` = TanStack `useMutation` → `POST https://reqres.in/api/login` via the
   reqres Axios instance (header `x-api-key: reqres-free-v1`).
3. On success: `authStore.setToken(token)`; store also writes cookie
   `venuze_token=<token>; Path=/; SameSite=Lax; Max-Age=7d` (`js-cookie`).
   Then `router.replace(searchParams.get('from') ?? '/dashboard')` + success toast.
4. On error: map reqres `error` string to a form-level error message; network/5xx → toast.
5. `authStore` (Zustand + `persist` to localStorage key `venuze-auth`) holds
   `{ token, user? }`. `user` populated by `useCurrentUser` (`GET /api/users/4`,
   query key `['me']`).
6. `middleware.ts` matcher `['/dashboard/:path*', '/login']`:
   - no `venuze_token` cookie on `/dashboard*` → redirect `/login?from=<path>`
   - cookie present on `/login` → redirect `/dashboard`
7. Logout (TopBar avatar menu + dashboard button): clear store, remove cookie,
   `queryClient.clear()`, `router.replace('/')`, toast.
8. Axios response interceptor: 401 from reqres → logout + redirect to `/login`.
9. Top bar shows person icon → `/login` when logged out; avatar + dropdown
   (Dashboard, Log out) when logged in. Guard hydration mismatch with a `useHydrated`
   hook so persisted state doesn't flash.

### 6.4 Data (mock)

- `features/venues/service.ts` exports async functions (`getVenues(filters)`,
  `getFeaturedVenues(tab)`, `getVenueById`) that read the JSON in `src/data`, apply
  filtering/sorting in memory, and `await sleep(600–900ms)` so skeletons are visible.
- `?simulateError=1` query param on `/search` makes `getVenues` throw, to demonstrate
  the error state (documented in README).
- ~30 venues across London, New York, Dubai, with fields:
  `id, title, city, area, lat, lng, images[], verified, capacity, sizeSqft, amenities[],
  pricePerHour, currency, type, occasions[]`.
- Query keys: `['venues', filters]`, `['featured', tab]`, `['bookings']`, `['me']`.

### 6.5 Search state

- URL is the source of truth for search/filter (`useSearchParamsState` hook): `city`,
  `date`, `guests`, `category`, `q`, `types[]`, `capMin/capMax`, `priceMin/priceMax`,
  `occasions[]`, `verified`, `sort`. Shareable, back-button safe.
- Filters drawer edits a local draft; "Apply Filters" writes to URL; "Clear All" resets.
- Active filters render as removable chips.
- Zustand UI store only for ephemeral UI (drawer open, map expanded on mobile).

### 6.6 Saved venues & bookings

- `savedStore` (Zustand + persist, key `venuze-saved`): `Set<venueId>` serialised as
  array. Heart on any `VenueCard` toggles it. If logged out, heart opens a toast
  "Log in to save venues" with an action linking to `/login`.
- Bookings: seeded from `bookings.json` into a TanStack Query cache via
  `bookings/service.ts`; `useCancelBooking` mutation uses optimistic update
  (`onMutate` snapshot → set status `Cancelled` → `onError` rollback → toast).

## 7. Responsive rules

- Breakpoints: Tailwind default `md` = 768, `lg` = 1024, `xl` = 1280; design widths
  375 / 768 / 1440 are the visual targets; container max-width 1440 with side padding
  16 (mobile) / 24 (tablet) / 40–56 (desktop, measured from Figma).
- Home hero search: horizontal bar on ≥md, stacked card (Where/When/Guests rows + full
  width Search) on mobile, per `1:676`.
- Search page: grid + map side-by-side on ≥lg; on <lg the map is hidden behind a
  floating "Map" toggle button (full-screen map sheet), per `491:5361` Map iPad.
- Carousels become swipeable on touch; arrows hidden <md.
- Filters drawer: right-side panel 654px on ≥md, full-screen sheet on mobile.

## 8. UI states checklist

| State | Where |
|---|---|
| Skeleton | Featured venues, search grid, profile card, saved venues, bookings |
| Spinner | Login button, contact form Send, Apply Filters |
| Empty | Search no results (Figma), saved venues, upcoming bookings, past bookings |
| Error | Search (simulated), profile fetch, login, route-level `error.tsx` |
| Toasts | Login ok/fail, logout, save/unsave + undo, booking cancelled, contact sent, "coming soon" |
| Modal | Filters drawer, cancel-booking confirm |
| Transitions | Card hover lift + image zoom, drawer slide-in, tab switch fade, top bar background on scroll |
| Hover | All buttons, chips, cards, nav links, category tiles (match Figma hover where defined) |

## 9. Design fidelity workflow (for the builder)

- Before each section: `get_design_context` on its node ID (session
  `53cedc70-9357-49b0-aa41-46eb18e22831`, fileKey `S3T1xuSfFMEu9Ctn3u9CiA`) to read exact
  colours, font sizes, spacing, radii; export images via the returned asset URLs into
  `public/images`.
- Put colours/radii/shadows as tokens in `@theme` (e.g. `--color-brand-500` the orange
  `#FF5A36`-ish CTA — confirm exact hex from Figma; gradient for banners).
- After each section: compare a browser screenshot at 1440/768/375 to the Figma frame.

## 10. Bonus scope (do in this order if time allows)

1. Dark mode (`next-themes`, class strategy, tokens with dark variants; Figma has no
   dark mode so it's our design — dark surfaces, same orange).
2. Unit tests: login schema, filter → query-string helpers, saved store, venue filter
   function, `VenueCard` render.
3. Playwright E2E: protected redirect, login → dashboard → logout.
4. a11y: semantic landmarks, labelled inputs, focus-visible rings, keyboard-operable
   carousel/drawer (focus trap, Esc closes), alt text.
5. Performance: `next/image` with sizes, priority on hero, lazy-load map
   (`dynamic(..., { ssr: false })`), font `display: swap`.

## 11. Delivery

- Repo: `C:\Users\AbdulQadeer-ISKAAN\hashed-venuze`, git initialised, small meaningful
  commits per feature.
- GitHub + Vercel: the candidate pushes and connects Vercel (needs their accounts).
- README sections: Setup, Test credentials, Tech decisions, State management (what
  lives in URL vs Zustand vs TanStack Query and why), Auth & security trade-off,
  Assumptions (dashboard + login designed by us, mock data, reqres API key), Challenges,
  Project structure.

## 12. Brief coverage

The brief was read in full. Its required scope is: public pages (landing, nav,
footer), authenticated screens incl. a dashboard, login via reqres `/api/login` with
validation, error handling, persisted auth, protected routes, middleware redirects and
logout; the stack in §6.1; the UI states in §8; the bonus items in §10. It does **not**
ask for a reqres users list, pagination, registration, or a specific SSR requirement,
so the dashboard contents and approach B stand.

## 13. Reference frames and theming (builder calls)

- Breakpoint references: desktop `491:20` (1440); tablet `491:3426` (full iPad home,
  768) is the primary reference, `491:4589` is consulted only for sections it covers
  that `491:3426` doesn't; mobile `491:5531` (375). `1:783` / `1:913` / `1:676` are
  hero-only close-ups at the same 1440 / 768 / 375 widths — use them for hero detail;
  on conflict, the full-page frame wins.
- Dark mode: default is **always light** (`defaultTheme="light"`, `enableSystem={false}`),
  so graders always see the Figma look first. Dark applies site-wide. Toggle lives in the
  avatar dropdown (logged in) and the footer bottom row (always) — not in the top bar.
- The `(protected)` group gets its own `layout.tsx` rendering `TopBar` (no footer).
- Saved venues and booking changes persist in localStorage and survive reload and
  logout (demo data, single user).

## 14. Calls made by the builder/assistant (not decided by the candidate)

- Dashboard content: profile + saved venues + bookings (candidate approved).
- Font Poppins, map via react-leaflet + CARTO tiles, Embla carousels, sonner toasts,
  Zod for validation, js-cookie for the cookie mirror.
- Login/dashboard/404 visual design.
- Mock data shape and the `?simulateError=1` switch.
- Sign-up routes to login; vendor/listing CTAs show "Coming soon".
- Venue clicks open a quick-view modal with "Request booking"; vendors mode shows a
  "coming soon" empty state (both chosen by the candidate from the assistant's picks).
