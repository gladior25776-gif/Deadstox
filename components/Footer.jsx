"use client";
import { scrollToId } from "@/lib/scroll";
import { ArrowUpIcon } from "./Icons";

const RESOURCES = ["My account", "Return & Refund Policy", "Shipping Policy", "Terms And Conditions", "Privacy Policy"];
const CATS = [
  { label: "Oversized T-Shirts", key: "oversized" },
  { label: "Baby Tees & Crop Tops", key: "baby" },
  { label: "New Arrivals", key: "new" },
  { label: "Graphic Tees", key: "graphic" },
];
const SOCIAL = [
  { label: "Instagram", href: "https://www.instagram.com/deadstox.in" },
];

export default function Footer() {
  const pickCat = (key) => (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("deadstox:category", { detail: key }));
    scrollToId("shop");
  };
  const noop = (e) => e.preventDefault(); // replace with real page links later

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo"><img src="/logo.png" alt="DEADSTOX" width="131" height="84" /></div>
            <p>Premium heavyweight streetwear built for the unfiltered.</p>
          </div>

          <div>
            <h4>Resources</h4>
            <ul>{RESOURCES.map((l) => <li key={l}><a href="#" onClick={noop}>{l}</a></li>)}</ul>
          </div>
          <div>
            <h4>Categories</h4>
            <ul>{CATS.map((c) => <li key={c.key}><a href="#shop" onClick={pickCat(c.key)}>{c.label}</a></li>)}</ul>
          </div>
          <div>
            <h4>Social Media</h4>
            <ul>{SOCIAL.map((s) => <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a></li>)}</ul>
          </div>
        </div>

        <div className="footer-big" aria-hidden="true">DEADSTOX</div>

        <div className="footer-bottom">
          <p>Copyright © 2026 — DEADSTOX</p>
          <button className="to-top" onClick={() => scrollToId("top")} aria-label="Back to top">
            Back to top <ArrowUpIcon width="16" height="16" />
          </button>
        </div>
      </div>
    </footer>
  );
}
