# DEADSTOX storefront (Next.js)
1. `npm install` then `npm run dev` -> http://localhost:3000
2. Edit PRODUCTS at the top of `app/page.js`. For real tee artwork, put PNGs in `/public/tees/` and set `graphic: '/tees/name.png'` (transparent PNG works best).
3. Logo files: `public/logo.png` (hi-res, transparent) and `public/logo.svg` (vector). Favicon: `app/icon.png`.
4. Push to GitHub, import in Vercel, deploy.
5. Payments: replace the Checkout alert with Razorpay or Stripe.

## Lookbook and product pages
- Lookbook: edit LOOKBOOK in `app/page.js`. Add photos with `img: '/lookbook/look1.jpg'` (put files in `public/lookbook/`).
- Every tee has its own page (opens from the collection, lookbook or "You may also like"). Share a tee with a link ending in `#tee-3` (the tee's id).
