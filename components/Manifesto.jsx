"use client";
import { useEffect, useRef } from "react";

const TEXT =
  "We don't make clothes for the quiet. Every piece is cut heavy, printed loud and built for the unfiltered. Wear your mindset.";
const HOT = new Set(["heavy", "loud", "unfiltered", "mindset"]);

export default function Manifesto() {
  const ref = useRef(null);
  const words = TEXT.split(" ");

  useEffect(() => {
    const sec = ref.current;
    const els = sec.querySelectorAll(".w");
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = sec.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / total));
      const lit = p * 1.12 * els.length;
      els.forEach((w, i) => w.classList.toggle("on", i < lit));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);

  return (
    <section className="manifesto" ref={ref} aria-label="Manifesto">
      <div className="manifesto-sticky">
        <p className="manifesto-text">
          {words.map((w, i) => (
            <span key={i} className={`w ${HOT.has(w.replace(/[^a-z]/gi, "").toLowerCase()) ? "hot" : ""}`}>
              {w}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
