"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Reveal from "./Reveal";
import ProductCard from "./ProductCard";
import { CATEGORIES, PRODUCTS } from "@/lib/products";

export default function Shop() {
  const [cat, setCat] = useState("all");
  const [ind, setInd] = useState({ x: 0, w: 0 });
  const tabsRef = useRef(null);
  const refs = useRef({});

  const list = useMemo(
    () => (cat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.tags.includes(cat))),
    [cat]
  );

  // footer category links can switch the tab
  useEffect(() => {
    const h = (e) => setCat(e.detail);
    window.addEventListener("deadstox:category", h);
    return () => window.removeEventListener("deadstox:category", h);
  }, []);

  useEffect(() => {
    const measure = () => {
      const el = refs.current[cat];
      if (el) setInd({ x: el.offsetLeft, w: el.offsetWidth });
    };
    measure();
    const el = refs.current[cat];
    const box = tabsRef.current;
    if (el && box) box.scrollTo({ left: el.offsetLeft - (box.clientWidth - el.offsetWidth) / 2, behavior: "smooth" });
    window.addEventListener("resize", measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [cat]);

  return (
    <section className="section shop" id="shop">
      <div className="container">
        <div className="shop-head">
          <Reveal>
            <p className="eyebrow">The collection</p>
            <h2 className="h2">Shop the <span className="outline">drop</span></h2>
          </Reveal>
          <Reveal delay={120} className="shop-tabs-wrap">
            <div className="tabs" ref={tabsRef} role="tablist" aria-label="Categories">
              <span className="tab-ind" style={{ transform: `translateX(${ind.x}px)`, width: ind.w }} />
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  ref={(n) => { refs.current[c.key] = n; }}
                  role="tab"
                  aria-selected={cat === c.key}
                  className={`tab ${cat === c.key ? "active" : ""}`}
                  onClick={() => setCat(c.key)}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <p className="count">{String(list.length).padStart(2, "0")} pieces</p>
          </Reveal>
        </div>

        <div className="grid" key={cat}>
          {list.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
        {list.length === 0 && <p className="empty">Nothing here yet — new drops soon.</p>}
      </div>
    </section>
  );
}
