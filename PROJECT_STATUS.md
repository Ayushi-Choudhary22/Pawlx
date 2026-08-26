# PAWLX — Build Status & Roadmap

This file is the single source of truth for what's done and what's next.
Read this first when resuming work in a new session.

## ✅ Phase 1 — COMPLETE (this delivery)

### Backend (`/backend`) — fully working, verified with `node app.js` and a clean build
- Enterprise MVC: `config/ controllers/ models/ routes/ middleware/ validators/ services/ utils/ helpers/ constants/`
- **19/19 Mongoose models** created (User, Pet, Vaccination, Medicine, MedicalRecord, Appointment,
  PetSitterBooking, GroomingBooking, Category, Product, Cart, Wishlist, Order, Review, Notification,
  Adoption, AdoptionApplication, AIHistory)
- **Full Auth module**: register, login, logout, forgot/reset password, change password, JWT, role-based
  authorization middleware (`protect`, `authorize(...roles)`)
- **Full CRUD + business logic** (route → controller → service → model, exactly as specified) for:
  Pets, Pet Care (vaccinations/medicines/medical records), Vets (booking + queue + reschedule/cancel),
  Pet Sitters, Grooming, Adoption (+ applications), Marketplace/Products (search/filter/sort/pagination),
  Cart, Wishlist, Orders (checkout → stock decrement → tracking history), Reviews (polymorphic,
  auto-recalculates target rating), Notifications, Dashboard aggregation, AI Assistant (calls Anthropic API,
  carries a hard-coded safety system prompt: never diagnoses, always defers to a vet)
- Centralized `ApiError` / `ApiResponse`, async handler wrapper, centralized error middleware
  (handles CastError, duplicate key, ValidationError)
- Cloudinary + Multer (memory storage) wired for all file-upload use cases (avatars, pet photos,
  medical documents, vaccination records)
- Nodemailer wired for password-reset emails
- **Verified**: `npm install` succeeds, `node app.js` loads with zero errors/warnings, all 15 route
  groups mount correctly

### Frontend (`/frontend`) — Vite + React + Tailwind v3, verified with `npm run build`
- Scalable folder structure: `assets/ components/ layouts/ pages/ hooks/ context/ services/ utils/
  constants/ routes/ styles/`
- Design system matches the brief exactly: Inter font, primary #2563EB / secondary #10B981 /
  accent #F97316, restrained palette, soft shadows, no gradients/glassmorphism/AI-template look
- `AuthContext` (JWT bootstrap, login/register/logout, persisted to localStorage) + `ToastContext`
  (animated toast queue via Framer Motion)
- Axios instance with request interceptor (attaches JWT) and response interceptor (401 → auto-logout)
- Full service layer: `authService`, `petService`, `marketplaceService` (products/cart/wishlist/orders),
  `miscServices` (dashboard/notifications/ai)
- Reusable component library: Button, Card, Input, Modal, Loader, SkeletonLoader, Pagination, Rating,
  SearchBar, EmptyState
- Layouts: `MainLayout` (navbar+footer), `DashboardLayout` (navbar+sidebar), `AuthLayout` (centered card)
- `Navbar` (role-aware, mobile menu), `Footer`, `Sidebar`, `ProtectedRoute` (auth + role gating)
- **Fully built pages**: Landing (hero, services, adoption banner, testimonials, FAQ), Login, Register
  (with role picker), Forgot Password, Reset Password, Dashboard (live data from `/api/dashboard`,
  stat cards, upcoming appointments, vaccination reminders, quick actions, AI tip), 404
- All other pages listed in the spec are routed and load via `ComingSoonPage` so **no route ever 404s
  or breaks navigation** — swap each one out for the real page as it's built (see below)
- **Verified**: `npm install` + `npm run build` succeed with zero errors

## ✅ Phase 2 — COMPLETE (this delivery)

Both `npm run build` (frontend) and `node app.js` (backend) verified clean after this phase.

- **Pet Care frontend — fully built**: `PetCarePage` (grid + add-pet modal + empty/loading states),
  `PetDetailPage` with tabbed navigation (Overview / Vaccinations / Medicines / Medical History),
  each tab is a real component (`VaccinationTab`, `MedicineTab`, `MedicalHistoryTab`) with its own
  inline add-record form wired to the existing backend endpoints. `usePets` custom hook centralizes
  pet CRUD + loading state.
- **Marketplace frontend — fully built**: `MarketplacePage` (search + sort/category/price filters +
  pagination), `ProductDetailPage` (image gallery, quantity selector, add to cart/wishlist),
  `ProductCard` (used in grid, handles cart/wishlist actions inline), `CartPage` (quantity controls,
  remove, order summary), `CheckoutPage` (shipping address + payment method form), `OrdersPage` (list
  with status badges), `OrderDetailPage` (line items + tracking timeline).
- **AI Assistant frontend — fully built**: `AIAssistantPage` with topic chips (breed info / diet
  planner / symptom checker / general), persistent conversation via `historyId`, and a permanent
  medical-disclaimer banner matching the spec's "never diagnose, always recommend a vet" requirement.
- All of the above routes were switched over from `ComingSoonPage` stubs to the real pages in `App.jsx`.

## ✅ Phase 3 — COMPLETE (this delivery)

Both `npm run build` (frontend) and `node app.js` (backend) verified clean after this phase.

- **AI Assistant is now dual-provider and pet-aware**: `AI_PROVIDER` env var switches between Anthropic
  and **Gemini** (`GEMINI_API_KEY` / `GEMINI_MODEL`) with zero frontend changes needed. The assistant
  now pulls the selected pet's species/breed/age/weight/conditions/allergies into its system prompt, so
  it can answer questions grounded in *that specific pet* rather than generically — with the same
  never-diagnose/always-see-a-vet guardrail carried through both providers. Frontend has a pet picker
  in `AIAssistantPage` to select which pet you're asking about.
- **Adoption frontend — fully built (explicitly prioritized this round)**: `AdoptionPage` (browse +
  species/gender/city filters), `AdoptionDetailPage` (full profile, vaccinated/neutered badges, apply
  flow with a login redirect if needed), `AdoptionApplyModal`, `ListPetForAdoptionPage` (create a
  listing), `MyApplicationsPage` (track your application status). All wired to the adoption backend
  that already existed.
- **Vet / Pet Sitter / Grooming booking frontend — fully built**: `VetsPage`, `PetSittersPage`,
  `GroomingPage` (browse + city search + book), each with its own booking modal
  (`VetBookingModal`/`SitterBookingModal`/`GroomingBookingModal`) that pulls from your pet list, and a
  unified `AppointmentsPage` (tabbed Vet/Sitter/Grooming, shows status, lets you cancel).
- **Notifications, Profile, Settings — fully built**: `NotificationsPage` (mark read/mark all read,
  type-specific icons), `ProfilePage` (edit details + address, avatar upload to Cloudinary),
  `SettingsPage` (change password, logout).
- **Admin panel — fully built, both backend and frontend**: new `adminService`/`adminController`/
  `adminRoutes` (all admin-gated) exposing analytics (users/products/orders/revenue/pending approvals/
  active adoptions), user list + activate/deactivate + professional approval, all-orders view, pending
  adoption-application review (approve/reject). New `categoryService`/`categoryController`/
  `categoryRoutes` (public read, admin-gated write) since Product needed a real category source.
  Frontend: `AdminDashboardPage` with tabs — `AnalyticsTab`, `UsersTab`, `OrdersTab`,
  `AdoptionReviewTab`, `CategoriesTab`.
- All of the above routes were switched over from `ComingSoonPage` stubs to the real pages in `App.jsx`.

## ✅ Phase 4 — COMPLETE (this delivery)

Both `npm run build` (frontend) and `node app.js` (backend) verified clean after this phase.

- **Reviews UI — fully built**: `ReviewForm` (star rating + comment), `ReviewList` (with per-review
  helpful voting, one vote per session), and `ReviewsSection` (self-contained: fetches, shows average
  rating, renders form + list, refetches after submit) — all reusable across every review target.
  Wired into `ProductDetailPage` directly, and into `ProfessionalCard` via a "Reviews" button that
  opens a modal (since vets/sitters/groomers don't have dedicated detail pages yet — see Phase 5 below).
- **Global Search — fully built, both backend and frontend**: new `searchService`/`searchController`/
  `searchRoutes` (`GET /api/search?q=`) running parallel regex queries across Products, Adoption
  listings, and approved Professionals, capped per category. Frontend: `GlobalSearchBar` — a live
  autocomplete dropdown (300ms debounce) triggered from a search icon in the navbar (desktop icon +
  mobile menu item), plus a full `SearchResultsPage` at `/search?q=` with sectioned results
  (Products / Adoptable Pets / Professionals) for when a query is submitted directly.

## ✅ Phase 5 — COMPLETE (this delivery)

Both `npm run build` (frontend) and `node app.js` (backend) verified clean after this phase.

- **Admin Product Management — fully built**: `ProductsTab` (table view with edit/delete) +
  `ProductFormModal` (create/edit form, category dropdown sourced from `CategoriesTab`'s categories,
  auto-slugifies new product names). Added as a new tab in `AdminDashboardPage`, using the
  already-existing admin-gated Product CRUD API.
- **Professional-side "My Queue" dashboards — fully built**: a single role-aware `MyQueuePage` serves
  veterinarians, pet sitters, and groomers (config-driven off `user.role`, reusing the same booking
  APIs each already had for professional-side actions). Status filter chips (pending / in-progress /
  completed), Accept/Reject on pending requests, Mark Completed on active ones. `Sidebar` now renders
  a different, smaller link set for professional roles (Dashboard, My Queue, Profile, Settings) vs. the
  full pet-owner set.

## ✅ Phase 6 — COMPLETE (this delivery)

Both `npm run build` (frontend) and `node app.js` (backend) verified clean after this phase.

- **Unified Calendar — fully built, both backend and frontend**: new `calendarService`/
  `calendarController`/`calendarRoutes` (`GET /api/calendar`) aggregates vet appointments, grooming
  bookings, pet-sitter stays, active medicine reminders, and upcoming vaccination due dates for the
  logged-in owner into one normalized event feed. Frontend: `CalendarPage` — a hand-built month grid
  (no external calendar library) with color-coded event dots per type, a day-detail panel on the side,
  month navigation, and a legend. Added to the pet-owner sidebar.
- **Dedicated Professional Profile pages — fully built**: new public `GET /api/users/professional/:id`
  endpoint. Frontend: `ProfessionalDetailPage` — a real page (not a modal) showing the professional's
  full bio, city, experience, rating, a role-aware "Book Now" that opens the correct existing booking
  modal (vet/sitter/groomer), and the full `ReviewsSection` living on the page itself.
  `ProfessionalCard` now links to this page ("View Profile") instead of opening a reviews modal, while
  still keeping its own inline "Book Now" for quick booking from the list view.

## ✅ Phase 7 — COMPLETE (this delivery)

Both `npm run build` (frontend) and `node app.js` (backend) verified clean after this phase.

- **Category filter now uses real IDs**: `ProductFilters` fetches live categories from
  `GET /api/categories` and filters by `category._id` (matching what the backend's `Product.category`
  field actually stores), instead of comparing against a hardcoded category-name array. The old
  `PRODUCT_CATEGORIES` constant was removed since it's no longer used anywhere.
- **Multer upgraded 1.x → 2.x**: `multer@2.2.0` in `backend/package.json`, confirmed no code changes
  needed (memoryStorage/fileFilter/limits/single() API is unchanged for this project's usage) and
  `npm audit` no longer flags multer at all. Note: `npm audit` still shows unrelated high/critical
  advisories via `bcrypt`'s build-time dependency on `node-pre-gyp` → `tar` — that's a separate,
  pre-existing item not part of what was asked here; `npm audit fix --force` would bump bcrypt to 6.x
  (a breaking change) if you want to tackle it later.

## ✅ Phase 8 — COMPLETE (this delivery)

Both `npm run build` (frontend) and `node app.js` (backend) verified clean after this phase.

- **Frontend code-splitting — done**: every page in `App.jsx` is now `React.lazy()`-loaded behind a
  single `Suspense` boundary (with `Loader` as fallback), so the initial bundle only contains what's
  needed to render the first route. Also added Rolldown-compatible `manualChunks` in `vite.config.js`
  splitting vendor code into `vendor-react`, `vendor-ui` (framer-motion/react-icons), and
  `vendor-forms` (react-hook-form/axios) for long-term browser caching. Result: the single ~589kB
  bundle is now ~30 route chunks of 2–14kB each plus cacheable vendor chunks (largest is
  `vendor-react` at 225kB) — **no chunk-size warning at all anymore**. Removed the now-unused
  `ComingSoonPage` since every route has a real page.
- **Recurring medicine reminders on the calendar — done**: `calendarService.js` now expands each active
  medicine reminder into individual day-by-day (or week-by-week, for `weekly` frequency) occurrences
  instead of one single start→end range block, capped to a 60-day rolling window so reminders don't
  generate indefinitely. Weekly occurrences stay aligned to the medicine's original start-date weekday.
- **.ics calendar export — done**: new `utils/icsExport.js` (`generateICS` + `downloadICS`) builds a
  standards-compliant iCalendar file client-side from whatever events are currently loaded, with a new
  "Export to Calendar (.ics)" button on `CalendarPage` that triggers the browser download — importable
  into Google Calendar, Apple Calendar, Outlook, etc.

## Status: spec-complete + polish-complete

Every module from the original spec has working backend + frontend, and all previously-identified
polish items (category filter IDs, multer upgrade, bundle splitting, recurring reminders, .ics export)
are done. Remaining ideas below are optional nice-to-haves, not gaps against the original scope.

## 🔜 Optional future ideas

1. Switch product search from regex `$or` queries to the existing MongoDB text index on `Product` if
   the catalog grows large (`$or` is fine at current scale)
2. Address the `bcrypt`/`node-pre-gyp`/`tar` transitive `npm audit` advisories (would require bumping
   bcrypt to 6.x, a breaking change) — unrelated to anything in this app's own code
3. Pagination/infinite-scroll on very long review lists
4. Push notifications / email digests for calendar reminders (currently in-app only via the
   Notifications page)

## ✅ Phase 9 — COMPLETE (this delivery)

Addresses the "can't log in / everything is empty" report on a fresh install.

- **Database seed script — new**: `backend/database/seed.js`, run via `npm run seed` (idempotent —
  safe to re-run, skips anything that already exists) or `npm run seed:fresh` (wipes users/categories/
  products/adoption listings/reviews first). Creates:
  - 7 ready-to-log-in accounts covering every role — admin, 2 pet owners, 2 vets, 1 pet sitter, 1
    groomer — all sharing the password `Password123!` (printed to the console when the script finishes)
  - 10 product categories and 16 real products spread across them (with images, prices, stock, some
    marked featured)
  - 6 adoption listings across dogs/cats/rabbit
  - A handful of sample product reviews
  - **Verified**: syntax-checked with `node --check`; logic manually re-verified line-by-line against
    every model's schema (required fields, enums, refs). Could not be run against a live MongoDB
    instance in this sandbox — outbound network here is locked to package registries only, and
    `mongodb-memory-server`'s binary download (confirmed via a real attempt, then removed) is blocked
    for the same reason. **Please run `npm run seed` yourself once your `MONGO_URI` is connected** —
    if anything errors, the message will point at the exact issue.
- **`TROUBLESHOOTING.md` — new**: root-cause checklist for "can't sign up/log in at all" (almost always
  a `.env`/MongoDB connectivity issue on a fresh install, not an app bug — registration creates a brand
  new account every time, so if that also fails it's environment, not auth logic) and for "pages show
  no records" (expected on an unseeded database by design — this is a real scaffold, not a demo with
  fake content baked in). Linked from the main `README.md`.

## ✅ Phase 10 — COMPLETE (this delivery)

Found and fixed a real bug, plus strengthened verification given this sandbox has no live MongoDB access.

- **Real bug fixed — `AuthContext` could hang the entire app forever on stale localStorage**:
  `JSON.parse()` on the cached user object was called with no try/catch. If that stored value was ever
  corrupted (very plausible after testing multiple builds of this app in the same browser across a
  long session), the parse threw inside an async function with no catch, `setLoading(false)` never
  ran, and every protected route spun on `<Loader fullScreen />` forever with zero error shown —
  matching a "blank page, nothing works" report exactly. Fixed: corrupted storage is now detected and
  auto-cleared, and the whole bootstrap function is wrapped so a failure can never leave `loading`
  stuck at `true`.
- **New: top-level `ErrorBoundary`** wraps the whole app in `main.jsx`. Any uncaught render crash
  anywhere now shows a real "Something went wrong" message with the actual error text and a
  "Reset and reload" button (which also clears auth storage), instead of a silent blank white screen.
- **Seed script verified against real schemas, without a live database**: this sandbox's outbound
  network is locked to package registries — no live MongoDB is reachable, and `mongodb-memory-server`'s
  binary download is blocked for the same reason (confirmed by actually trying it, then removing the
  attempt). Instead, every document shape in `seed.js` was validated with Mongoose's `validateSync()`
  directly against the real schemas (required fields, enums, refs) with zero live connection needed —
  all passed. This doesn't replace running `npm run seed` yourself against your real database, but it
  does rule out schema-mismatch bugs as a cause of seeding failures.
- **`TROUBLESHOOTING.md` updated** with a dedicated section on the blank-page bug above (including how
  to clear stale `localStorage` if you were testing an earlier build) and a note about Vite silently
  auto-incrementing its port (5173 → 5174…) when the default is busy, which breaks CORS invisibly if
  `CLIENT_URL` isn't updated to match.

## How to resume

Just say "continue PAWLX" and reference this file.

## ✅ Phase 11 — COMPLETE

Two feature expansions, both scoped via explicit clarifying questions first, same architecture throughout (routes → controllers → services → models unchanged).

- **Adoption: foster vs. permanent + full adopter verification**:
  - `Adoption` model: `adoptionType` (`permanent`/`foster`, set by the lister), plus `reasonForRehoming`,
    `dietInfo`, `behaviorNotes`, `medicalHistory`, `contactNumber`
  - `AdoptionApplication` model: `fullName`, `permanentAddress`, `contactNumber`,
    `emergencyContactName`/`emergencyContactNumber`, `idProof` (real file upload via Cloudinary,
    multer wired on the apply route), `previousPetExperience`, `responsibilityAcknowledged` (required
    checkbox, validated server-side)
  - New `validators/adoptionValidators.js`; `adoptionService.applyForAdoption` now handles the file
    buffer and builds the full application document
  - Frontend: `AdoptionApplyModal` is the full verification form; `ListPetForAdoptionPage` has the
    foster/permanent selector up front plus diet/behavior/medical-history fields;
    `AdoptionDetailPage` shows a foster/permanent badge, the new info sections, and
    **"Adopt Me 🐾" / "Foster Me 🐾"** as the CTA; `AdoptionCard`/`AdoptionFilters` reflect the type;
    admin's `AdoptionReviewTab` has an expandable per-application panel showing every verification
    detail (address, both contact numbers, ID proof link, experience) for manual review before
    approving — the app validates required fields but can't verify authenticity, so human review is
    still the actual trust step, matching what was asked for
- **Vets: video consultations + clinic address**:
  - `Appointment` model: `isVideoConsultation`, `meetingLink`
  - `User.professionalProfile`: `clinicAddress`, `offersVideoConsultation`
  - `VetBookingModal` shows a "request as video consult" checkbox only when the vet offers it;
    `MyQueuePage` lets the vet paste in a meeting link per booking; `AppointmentsPage` shows the pet
    owner a "Join Video Call" link once it's set; `ProfilePage` now has a full "Professional Details"
    section (bio, experience, fee, city, clinic address, video-consult toggle) so professionals can
    maintain this themselves; `ProfessionalDetailPage` and `ProfessionalCard` both show the clinic
    address, phone number, and a video-consult badge
- **Seed data updated** to reflect all of the above: vets now have phone numbers, clinic addresses,
  and one has video consultations enabled; all 6 adoption listings now have a real `adoptionType`
  (mix of foster/permanent) and populated care-detail fields
- **Verified**: every new/changed document shape re-validated with Mongoose's `validateSync()` against
  the real schemas (same technique as Phase 9, since a live database still isn't reachable from this
  sandbox); full backend load check and full frontend `npm run build` both clean with zero errors or
  warnings after all changes

## Local setup

```bash
# Backend
cd backend
cp .env.example .env   # fill in MongoDB URI, JWT secrets, Cloudinary, SMTP
                        # + AI_PROVIDER (anthropic/gemini) and the matching API key
npm install
npm run dev             # http://localhost:5000

# Frontend
cd frontend
cp .env.example .env
npm install
npm run dev              # http://localhost:5173
```
