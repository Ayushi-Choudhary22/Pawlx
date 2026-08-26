# Troubleshooting PAWLX

## "The whole app is just blank / stuck loading forever"

**This was a real bug, now fixed.** `AuthContext` used to call `JSON.parse()` on a cached user object
from `localStorage` without a safety net. If that stored value was ever corrupted or stale — which is
easy to hit after testing multiple versions of the app in the same browser — the parse would throw,
the loading state would never clear, and every protected page would spin forever with no error message
at all. It's fixed now: corrupted storage is detected and wiped automatically, and a top-level error
boundary catches any other unexpected render crash and shows a "Reset and reload" button instead of a
silent blank screen.

**If you were testing an earlier build and still see a blank/stuck page**, your browser likely has that
stale data cached. Clear it once:
- Open DevTools → Application (Chrome) or Storage (Firefox) → Local Storage → your site → delete the
  `pawlx_token` and `pawlx_user` keys, then refresh
- Or just open the app in a private/incognito window to confirm it loads clean

---

## "I can't sign up or log in at all"

This almost always means the **frontend can't reach the backend**, not a bug in the auth code itself
(registration creates a brand-new account every time — it doesn't depend on any existing data). Check
these in order:

### 1. Is the backend actually running?
```bash
cd backend
npm install
npm run dev
```
You should see in the terminal:
```
MongoDB connected: <host>
PAWLX API server running in development mode on port 5000
```
If you see an error instead (especially about `MONGO_URI` or a connection timeout), the backend never
started — every request from the frontend will fail, which looks exactly like "login does nothing."

### 2. Did you create `backend/.env`?
The backend **will not run** without a real `.env` file — `.env.example` is a template, not a working
config.
```bash
cd backend
cp .env.example .env
```
Then open `.env` and set at minimum:
- `MONGO_URI` — a real, reachable MongoDB connection string. Easiest options:
  - Local: install MongoDB Community Edition and use `mongodb://127.0.0.1:27017/pawlx`
  - Free cloud option: create a free cluster at MongoDB Atlas and paste its connection string
    (remember to whitelist your IP address in Atlas's Network Access settings, or allow access from
    anywhere for local development)
- `JWT_SECRET` and `JWT_RESET_SECRET` — any long random strings

### 3. Did you create `frontend/.env`?
```bash
cd frontend
cp .env.example .env
```
The default (`VITE_API_BASE_URL=http://localhost:5000/api`) works out of the box if your backend runs
on port 5000, so this step is usually optional — but create it anyway to avoid surprises.

### 4. Check the browser's Network tab
Open DevTools → Network, try logging in again, and click the failed `login` or `register` request:
- **Request never appears / "Failed to fetch"** → backend isn't running, or is on a different port
  than the frontend expects
- **CORS error in the console** → your backend's `CLIENT_URL` in `.env` doesn't match the URL the
  frontend is actually running on (default is `http://localhost:5173`). **Common gotcha**: if port
  5173 is already in use, Vite silently switches to 5174, 5175, etc. and prints the real port in its
  terminal output — but your backend's `CLIENT_URL` still says 5173, so CORS quietly fails. Check the
  frontend terminal for the actual `Local:` URL it printed and make sure `CLIENT_URL` matches it exactly.
- **500 Internal Server Error** → check the backend terminal for the actual stack trace; almost always
  a `MONGO_URI` or missing-env-variable issue
- **401 Unauthorized on login specifically (register works)** → wrong password, or you haven't seeded/
  created that account yet — just register a new account instead

### 5. Try registering a brand-new account first
Don't rely on demo accounts existing yet — go to `/register` and create a fresh account. If that also
fails, it confirms the issue is connectivity (steps 1–4), not the auth logic.

---

## "Marketplace / Adoption / everything shows no records"

This is expected on a **freshly installed, unseeded database** — the scaffold ships with zero data by
design (it's your product, not a demo with fake content baked in). Two ways to fix it:

### Option A — run the seed script (recommended)
```bash
cd backend
npm run seed
```
This populates:
- 7 ready-to-use accounts (1 admin, 2 pet owners, 2 vets, 1 pet sitter, 1 groomer) — all with the
  password `Password123!`
- 10 product categories and 16 products across them
- 6 adoption listings
- A handful of sample product reviews

The script prints every account's email when it finishes. It's safe to run multiple times — it skips
anything that already exists instead of duplicating it. If you want a completely clean slate first:
```bash
npm run seed:fresh
```
This wipes users/categories/products/adoption listings/reviews before reseeding.

### Option B — just use the app normally
Register an account, add products via the Admin panel (`/admin` → Products tab, after promoting your
account to `admin` role directly in MongoDB or via the seed script), list a pet for adoption, etc. The
app works with zero seed data — it just won't have anything to *look at* until someone adds something,
same as any brand-new production app.

---

## Quick sanity checklist

- [ ] `backend/.env` exists and `MONGO_URI` points to a real, running MongoDB
- [ ] Backend terminal shows `MongoDB connected` and `PAWLX API server running...` with no errors
- [ ] `frontend/.env` exists (or you're fine with the default `http://localhost:5000/api`)
- [ ] Frontend is running (`npm run dev` in `frontend/`) and reachable at `http://localhost:5173`
- [ ] You've run `npm run seed` in `backend/` if you want to see existing products/pets/professionals
- [ ] Browser DevTools → Network tab shows the actual error if something still fails
