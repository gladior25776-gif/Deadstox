# DEADSTOX — Premium Streetwear Website

Next.js 14 (App Router) + plain CSS + Lenis smooth scrolling. No Tailwind, no UI libraries.

## Run locally
```bash
npm install
npm run dev        # http://localhost:3000
```

## Deploy (GitHub → Vercel)
1. Push this folder to your GitHub repo (the root of the repo should contain `package.json`).
2. On vercel.com → **Add New → Project** → import the repo. Framework is auto-detected as Next.js.
3. Click **Deploy**. Every push to `main` redeploys automatically.

## Where to edit things
| What | File |
|---|---|
| Products, prices, sizes, tabs/categories | `lib/products.js` |
| Product photos | drop files in `public/products/` and change `image` in `lib/products.js` |
| Logo | `public/logo.png` (replace with a larger / transparent version for max sharpness) |
| Colours, fonts, spacing, animations | `app/globals.css` (see `:root` variables at the top) |
| Hero text | `components/Hero.jsx` |
| About / manifesto copy | `components/About.jsx`, `components/Manifesto.jsx` |
| Contact email + form | `components/Contact.jsx` (form is front-end only — connect Formspree/Resend) |
| Footer links | `components/Footer.jsx` |

## Notes
- Product tee images are placeholder SVGs. Real photos work the same way — the zoom component handles any image ratio (portrait 5:6 / 4:5 looks best).
- Cart is saved in the browser (localStorage). Checkout button is a placeholder — connect Razorpay/Stripe/Shopify when ready.
- Instagram: https://www.instagram.com/deadstox.in (footer + contact). Add other socials / an email in `components/Footer.jsx` and `components/Contact.jsx`.

## Palette
Light off-white theme. Colours live in the :root variables at the top of `app/globals.css` (--bg, --fg, --mute, --red). Placeholder tee backdrops are in `public/products/*.svg`.
