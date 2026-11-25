"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProduct } from "@/lib/products";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("deadstox-cart");
      if (raw) setItems(JSON.parse(raw).filter((i) => getProduct(i.id)));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem("deadstox-cart", JSON.stringify(items)); } catch {}
  }, [items, ready]);

  const add = useCallback((id, size) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === id && i.size === size);
      return found
        ? prev.map((i) => (i === found ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { id, size, qty: 1 }];
    });
    setPulse((p) => p + 1);
  }, []);

  const setQty = useCallback((id, size, qty) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => !(i.id === id && i.size === size))
        : prev.map((i) => (i.id === id && i.size === size ? { ...i, qty } : i))
    );
  }, []);

  const remove = useCallback((id, size) => setQty(id, size, 0), [setQty]);

  const value = useMemo(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const total = items.reduce((s, i) => s + (getProduct(i.id)?.price || 0) * i.qty, 0);
    return { items, count, total, open, setOpen, add, setQty, remove, pulse };
  }, [items, open, add, setQty, remove, pulse]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
