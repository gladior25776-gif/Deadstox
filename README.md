# DEADSTOX storefront (Next.js)
1. `npm install` then `npm run dev` -> http://localhost:3000
2. Edit PRODUCTS at the top of `app/page.js`. For real tee artwork, put PNGs in `/public/tees/` and set `graphic: '/tees/name.png'` (transparent PNG works best).
3. Logo files: `public/logo.png` (hi-res, transparent) and `public/logo.svg` (vector). Favicon: `app/icon.png`.
4. Push to GitHub, import in Vercel, deploy.
5. Payments: replace the Checkout alert with Razorpay or Stripe.
