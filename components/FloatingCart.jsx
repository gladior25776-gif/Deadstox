"use client";
import { useCart } from "./CartProvider";
import { CartIcon } from "./Icons";

export default function FloatingCart() {
  const { count, open, setOpen, pulse } = useCart();
  return (
    <button
      key={pulse}
      className={`fab ${open ? "away" : ""} ${pulse ? "bump" : ""}`}
      onClick={() => setOpen(true)}
      aria-label={`Open cart, ${count} items`}
    >
      <CartIcon width="24" height="24" />
      <span className="fab-badge">{count}</span>
    </button>
  );
}
