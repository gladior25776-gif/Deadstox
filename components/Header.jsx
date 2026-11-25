"use client";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/products";
import { scrollToId, lockScroll } from "@/lib/scroll";
import { CartIcon } from "./Icons";

const LINKS = [
  { id: "shop", label: "Shop" },
  { id: "about", label: "About Us" },
  { id: "contact", label: "Contact Us" },
];

export default function Header() {
  const { total, setOpen } = useCart();
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 8) return;
      setHidden(y > last && y > 320);
      last = y;
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const toggle = () => {
    const next = !menu;
    setMenu(next);
    lockScroll(next);
  };

  const go = (id) => (e) => {
    e.preventDefault();
    const wasOpen = menu;
    setMenu(false);
    lockScroll(false);
    setTimeout(() => scrollToId(id), wasOpen ? 350 : 0);
  };

  return (
    <>
      <header className={`header ${hidden && !menu ? "hide" : ""}`}>
        <div className="header-bar">
          <a href="#top" className="logo" onClick={go("top")} aria-label="DEADSTOX — home">
            <img src="/logo.png" alt="DEADSTOX" width="59" height="38" />
          </a>
          <nav className="nav" aria-label="Primary">
            {LINKS.map((l) => (
              <a key={l.id} href={`#${l.id}`} onClick={go(l.id)} className="nav-link">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <button className="cart-btn" onClick={() => setOpen(true)} aria-label="Open cart">
              <span>{formatPrice(total)}</span>
              <CartIcon />
            </button>
            <button className={`burger ${menu ? "open" : ""}`} onClick={toggle} aria-label="Menu" aria-expanded={menu}>
              <i /><i />
            </button>
          </div>
        </div>
      </header>

      <div className={`menu ${menu ? "open" : ""}`} aria-hidden={!menu}>
        <nav className="menu-nav">
          {LINKS.map((l, i) => (
            <a key={l.id} href={`#${l.id}`} onClick={go(l.id)} style={{ "--i": i }}>
              <span>{l.label}</span>
            </a>
          ))}
        </nav>
        <p className="menu-foot">Wear your mindset.</p>
      </div>
    </>
  );
}
