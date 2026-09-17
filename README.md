Sai Baba Electronics

> A modern electronics storefront with Supabase-powered authentication, shopping flows, AI product assistance, and a protected admin portal.

## Overview

Sai Baba Electronics is a React and Vite e-commerce experience for browsing and purchasing consumer electronics. Customers can explore categories, search products, manage a cart and wishlist, sign in, place orders, and track delivery progress.

Administrators get a protected dashboard for monitoring store metrics, managing order status, and maintaining product inventory directly through Supabase.

## Highlights

### Storefront

- Responsive home page with featured and trending products
- Category navigation, mega menu, product search, and product details
- Cart drawer with quantity controls and checkout flow
- Wishlist with persistent guest and authenticated state
- Razorpay checkout integration
- Order history and order tracking
- Store locator, contact, careers, EMI, and company information pages

### Customer Experience

- Supabase email authentication
- Light and dark themes
- AI assistant for product recommendations, budgets, and EMI questions
- Product suggestions inside assistant responses
- Mobile-friendly navigation and layouts

### Admin Portal

- Profile-based admin role detection using `public.profiles`
- Protected `/admin` route
- Revenue, order, and product metrics
- Order manager with customer details, items, totals, and delivery status updates
- Inventory manager for adding, editing, and deleting products

## Tech Stack

| Layer | Technology |
| --- | --- |
| UI | React 19, React Router |
| Build | Vite |
| Styling | CSS by feature |
| Icons | Lucide React |
| Data and Auth | Supabase |
| Payments | Razorpay |
| AI assistant | Google Gemini API |

## Getting Started

### Requirements

- Node.js 18 or newer
- npm
- A Supabase project for live product, order, and authentication data

### Install

```bash
git clone https://github.com/dhrijesh-bhusara/Saibaba-Electronics.git
cd Saibaba-Electronics
npm install
```

Create a local environment file named `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
VITE_GEMINI_API_KEY=your-gemini-api-key
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run lint` | Run ESLint across the project |
| `npm run build` | Create a production build in `dist` |
| `npm run preview` | Preview the production build locally |

## Admin Access

The admin portal is available at `/admin` and requires an authenticated user whose profile has the admin role.

In Supabase, the user must have a matching row in `public.profiles`:

| Column | Value |
| --- | --- |
| `id` | The matching `auth.users.id` |
| `role` | `admin` |

After signing in, admins can open the profile menu and select **Admin Portal**.

## Supabase Setup

The application expects tables for the main commerce flows, including:

- `profiles`
- `categories`
- `products`
- `orders`
- `cart_items`
- `wishlist_items`

Before production deployment, configure Row Level Security policies so customers can access only their own account data and only admins can manage products, profiles, and order status.

## Production Checklist

- Use production Razorpay credentials instead of test keys.
- Keep `.env.local` out of Git and configure environment variables in the hosting provider.
- Move Gemini requests behind a server-side or Supabase Edge Function before public launch so the API key is not exposed in the browser.
- Enable and verify Supabase Row Level Security policies.
- Confirm the production redirect URLs in Supabase Auth.
- Run the release checks:

```bash
npm run lint
npm run build
```

## Project Structure

```text
src/
├── components/     Shared navigation, auth, cart, AI, and admin route components
├── context/        Auth and cart state providers
├── lib/            Supabase client
├── pages/          Storefront, account, checkout, and admin pages
├── services/       AI assistant service logic
├── assets/         Product and storefront imagery
├── App.jsx         Application routes and providers
└── main.jsx        React entry point
```

## License

This project is currently maintained as a private storefront application. Add a license before distributing it publicly.

