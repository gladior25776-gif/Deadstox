"use client";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { getProduct, formatPrice } from "@/lib/products";
import { lockScroll, scrollToId } from "@/lib/scroll";
import { CloseIcon, PlusIcon, MinusIcon, ArrowIcon } from "./Icons";

export default function CartDrawer() {
  const { items, count, total, open, setOpen, setQty, remove } = useCart();
  const [note, setNote] = useState("");

  useEffect(() => {
    lockScroll(open);
    if (!open) setNote("");
    const esc = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, setOpen]);

  const shop = () => {
    setOpen(false);
    setTimeout(() => scrollToId("shop"), 400);
  };

  return (
    <div className={`drawer-root ${open ? "open" : ""}`} aria-hidden={!open}>
      <div className="drawer-backdrop" onClick={() => setOpen(false)} />
      <aside className="drawer" role="dialog" aria-label="Shopping cart">
        <div className="drawer-head">
          <h3>Your cart <span>({count})</span></h3>
          <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close cart"><CloseIcon /></button>
        </div>

        <div className="drawer-body" data-lenis-prevent>
          {items.length === 0 ? (
            <div className="drawer-empty">
              <p>Your cart is empty.</p>
              <button className="btn btn-ghost" onClick={shop}><span>Browse the drop</span></button>
            </div>
          ) : (
            items.map((i) => {
              const p = getProduct(i.id);
              if (!p) return null;
              return (
                <div className="line" key={i.id + i.size}>
                  <img src={p.image} alt="" width="80" height="96" />
                  <div className="line-info">
                    <h4>{p.name}</h4>
                    <p>Size {i.size} · {formatPrice(p.price)}</p>
                    <div className="qty">
                      <button onClick={() => setQty(i.id, i.size, i.qty - 1)} aria-label="Decrease"><MinusIcon width="14" height="14" /></button>
                      <span>{i.qty}</span>
                      <button onClick={() => setQty(i.id, i.size, i.qty + 1)} aria-label="Increase"><PlusIcon width="14" height="14" /></button>
                    </div>
                  </div>
                  <div className="line-end">
                    <strong>{formatPrice(p.price * i.qty)}</strong>
                    <button className="remove" onClick={() => remove(i.id, i.size)}>Remove</button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="drawer-foot">
            <div className="subtotal"><span>Subtotal</span><strong>{formatPrice(total)}</strong></div>
            <p className="small">Shipping &amp; taxes calculated at checkout.</p>
            <button
              className="btn btn-primary block"
              onClick={() => setNote("Checkout isn't connected yet — plug in your payment gateway (e.g. Razorpay).")}
            >
              <span>Checkout <ArrowIcon width="16" height="16" style={{ verticalAlign: "-3px", marginLeft: 6 }} /></span>
            </button>
            {note && <p className="note">{note}</p>}
          </div>
        )}
      </aside>
    </div>
  );
}
