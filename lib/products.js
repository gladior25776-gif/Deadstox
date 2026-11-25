// ─────────────────────────────────────────────────────────────
//  PRODUCT DATA  — edit this file to change what the shop shows.
//  To use your real photos: drop them in /public/products and
//  change `image` to e.g. "/products/my-tee.jpg".
//  tags decide which tab a product appears in:
//  "oversized" | "baby" | "graphic" | "new"
// ─────────────────────────────────────────────────────────────
export const SIZES = ["S", "M", "L", "XL"];

export const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "new", label: "New Arrivals" },
  { key: "oversized", label: "Oversized" },
  { key: "baby", label: "Baby Tees & Crops" },
  { key: "graphic", label: "Graphic Tees" },
];

export const PRODUCTS = [
  { id: "midnight-ring", name: "Midnight Ring Tee", price: 1499, meta: "Oversized · Heavyweight", image: "/products/midnight-ring.svg", tags: ["oversized", "graphic", "new"], badge: "New" },
  { id: "static-eye", name: "Static Eye Tee", price: 1399, meta: "Regular fit · Graphic", image: "/products/static-eye.svg", tags: ["graphic"] },
  { id: "voltage", name: "Voltage Oversized", price: 1599, meta: "Oversized · Heavyweight", image: "/products/voltage.svg", tags: ["oversized"] },
  { id: "halftone-void", name: "Halftone Void Tee", price: 1299, meta: "Regular fit · Graphic", image: "/products/halftone-void.svg", tags: ["graphic", "new"], badge: "New" },
  { id: "slash-baby", name: "Slash Baby Tee", price: 999, meta: "Baby tee · Cropped", image: "/products/slash-baby.svg", tags: ["baby"] },
  { id: "crimson-splatter", name: "Crimson Splatter Tee", price: 1449, meta: "Regular fit · Graphic", image: "/products/crimson-splatter.svg", tags: ["graphic"] },
  { id: "noir-crop", name: "Noir Crop Top", price: 1099, meta: "Crop top · Heavyweight", image: "/products/noir-crop.svg", tags: ["baby", "new"], badge: "New" },
  { id: "washed-slash", name: "Washed Slash Oversized", price: 1599, meta: "Oversized · Washed", image: "/products/washed-slash.svg", tags: ["oversized", "new"], badge: "New" },
];

export const getProduct = (id) => PRODUCTS.find((p) => p.id === id);

const fmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
export const formatPrice = (n) => fmt.format(n);
