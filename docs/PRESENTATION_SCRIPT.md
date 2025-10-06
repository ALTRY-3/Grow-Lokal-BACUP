# GrowLokal – Frontend to Backend Walkthrough (Presentation Script)

This script guides a live or recorded presentation showing how GrowLokal works end‑to‑end: UI flows, state, API calls, database, and security. It references exact files in the repository so you can jump to code as you speak.

## 1) High-level overview

- Framework: Next.js 15 (App Router) with React 19, TypeScript
- Styling: Component CSS files (e.g., `marketplace.css`, `Navbar.css`), modern UI patterns
- State: Lightweight client state via Zustand store in `src/store/cartStore`
- Auth: NextAuth (`next-auth`) with MongoDB adapter
- Database: MongoDB + Mongoose models in `src/models`
- APIs: Route handlers under `src/app/api/*`
- Build/runtime: Turbopack for fast dev (`npm run dev`)

Diagram (conceptual):

UI (React components) → Local state (Zustand) → API routes (Next.js handlers) → Mongoose models → MongoDB

## 2) Navigation & layout skeleton

- Global entry: `src/middleware.ts` (auth/session middleware where applicable)
- Top-level pages: App Router under `src/app/*` (e.g., `marketplace`, `cart`, `checkout`, `profile`, `map`, `events`)
- Global UI: `src/components/Navbar.tsx` + `src/components/Footer.tsx`

Key point: Navbar contains cart popup and quick navigation to Cart and Checkout.

## 3) Marketplace → Product → Cart → Checkout flow

### 3.1 Marketplace listing
- Files: 
  - Page: `src/app/marketplace/page.tsx`
  - Styles: `src/app/marketplace/marketplace.css`
- What it does:
  - Renders product categories and product grid.
  - Each product exposes Add-to-Cart icon and opens Product Modal for details.

Talking point: Show a product card then click “Add to cart” icon or open modal.

### 3.2 Product modal (rich UI)
- File: `src/components/ProductModal.tsx`
- Highlights:
  - Image gallery with thumbnails and hover image.
  - Quantity selector, wishlist toggle, animated CTA.
  - Consistent left-aligned text (recent fix).
- Add to cart: calls `useCartStore().addItem(productId, quantity)`.

Contract:
- Input: `{ productId: string, quantity: number }`
- Side effects: Updates cart in local/Zustand and/or triggers API call inside the store.
- Error modes: Missing productId, network/API errors.

### 3.3 Cart store (Zustand)
- File: `src/store/cartStore` (index path abbreviated)
- Responsibilities:
  - Keep `items`, `subtotal`, `itemCount` in client state.
  - Methods: `addItem`, `removeItem`, `fetchCart`, `clearLocalCart`.
  - When authenticated, syncs with server cart via API routes; otherwise, uses local storage.

### 3.4 Cart popup in Navbar
- File: `src/components/Navbar.tsx`
- Behavior:
  - Click cart icon → shows dropdown with items, totals, and actions.
  - “View Full Cart” → `router.push('/cart')`.
  - “Checkout” → `router.push('/checkout')` (we added stopPropagation + slight delay for reliability).
- Empty state: CTA to browse Marketplace.

### 3.5 Cart page → selective checkout (optional)
- Files:
  - Page: `src/app/cart/page.tsx`
  - Styles: `src/app/cart/cart.css`
- Behavior:
  - Displays full cart, per-item actions (qty/remove).
  - Computes totals and can gate checkout on selection or validation.

### 3.6 Checkout page
- Files:
  - Page: `src/app/checkout/page.tsx`
  - Styles: `src/app/checkout/checkout.css`
- Responsibilities:
  - Shows address summary, items, shipping, vouchers, payment options.
  - Integrates with payment provider (PayMongo docs present in `docs/`).
  - Requires session for confirmed user details (NextAuth).

Data flow summary:
- UI components → `useCartStore` methods → API calls (when logged in) → DB via model → Response → UI updates + navigate.

## 4) Profile & Wishlist

### 4.1 Profile page
- File: `src/app/profile/page.tsx` with `src/app/profile/profile.css`.
- Sections: My Profile, My Orders, My Wishlist, Sell.
- UI tweaks reduced spacing to fit more content on screen.

### 4.2 Wishlist feature
- Implemented in profile page:
  - Sidebar: added Wishlist entry with icon.
  - `WishlistContent` component reads product IDs from localStorage, fetches product details, displays a grid.
  - Remove from wishlist via inline heart button.
- Edge cases:
  - Empty state message.
  - Loading skeletons while fetching.

## 5) Events & Map (react-calendar and react-leaflet)

### 5.1 Events page
- Files:
  - Page: `src/app/events/page.tsx`
  - Uses `react-calendar` for date filtering, installed as dependency.
- User can filter event listings by date and search.

### 5.2 Map page
- Files:
  - Page content: `src/app/map/MapContent.tsx`
  - Styles: `src/app/map/map.css`
- Libraries:
  - `react-leaflet@5` + `leaflet` for map rendering.
  - Custom map pin via `L.divIcon`.
  - `react-hot-toast` for reminder feedback.
- Flow:
  - Static events array with geo coords.
  - Filters: search, date, radius (Haversine distance helper).
  - Map renders markers for filtered events with popup UI and bell button to set reminder (toast success).
- Notes:
  - v5 prop typings differ; we use pragmatic `// @ts-ignore` on a couple of props to match runtime behavior.

## 6) Backend, APIs, and Models

- Models: `src/models/*` (e.g., `Product`, `Cart`, `User`) using Mongoose schemas for MongoDB.
- Auth: NextAuth in `src/app/api/auth/[...nextauth]/route.ts` (typical pattern) with `@next-auth/mongodb-adapter`.
- Cart APIs: `src/app/api/cart/*` (typical pattern) to get/update cart items when authenticated.
- Products API: `src/app/api/products/*` to list/get product details.
- User API: `src/app/api/user/profile` for profile data (used in `Navbar.tsx` to fetch avatar).

Backend flow (example: add to cart when logged in):
- UI calls `useCartStore.addItem(productId, qty)` → store detects auth → calls `/api/cart` (POST) with payload → route handler validates session → Mongoose update on user cart → returns updated cart → store updates local state.

## 7) Security and middleware

- `src/middleware.ts` can enforce auth for protected routes or set headers.
- NextAuth session: server-side auth used by API routes to authorize operations (cart modification, orders, etc.).
- Cookies & CSRF: handled by NextAuth; docs in `docs/` folder include additional guidance (e.g., `COOKIE_SECURITY.md`).

## 8) Styling system and recent UI refinements

- Market backgrounds simplified to clean white in `marketplace.css` (removed animated glow and alternating patterns).
- Product modal alignment fixes ensuring left-aligned content.
- Navbar cart popup enhancements; reliable navigation to Checkout.

## 9) How to run locally

Prereqs:
- Node.js 18+
- MongoDB connection string
- Environment vars based on `.env.local.example` (copy to `.env.local`).

Install deps (peer conflicts resolved using legacy peer deps during restore):

```powershell
npm install --legacy-peer-deps
```

Start dev server (Turbopack):

```powershell
npm run dev
```

Open http://localhost:3000.

## 10) Demo script (suggested talking flow)

1) Home → Marketplace
   - Show categories and a product.
   - Open Product Modal, adjust quantity, add to cart.
2) Navbar cart popup
   - Show mini cart, totals, click Checkout.
3) Checkout page
   - Walk through address, shipping, payment options.
4) Profile → Wishlist
   - Show wishlist grid, remove an item.
5) Events
   - Filter with calendar, search.
6) Map
   - Toggle filters, adjust radius, click a marker, set reminder (toast).

## 11) Troubleshooting (quick)

- If calendar or map fails to compile, ensure packages are installed:
  - `react-calendar`, `react-leaflet`, `leaflet`, `@types/leaflet`, `react-hot-toast`
- CSS line clamp warning: add `line-clamp` alongside `-webkit-line-clamp`.
- If Checkout button in cart popup doesn’t navigate, verify `Navbar.tsx` cart action handlers.

---

Use this script as your talk track; jump into the linked files for code walkthroughs, and run the demo steps live.
