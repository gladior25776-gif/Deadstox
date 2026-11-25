"use client";
import { useEffect, useState } from "react";
import { lockScroll } from "@/lib/scroll";

export default function Preloader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    lockScroll(true);
    const start = performance.now();
    const dur = 1700;
    let raf = 0;
    let t2;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDone(true);
        document.documentElement.classList.add("is-ready");
        lockScroll(false);
        t2 = setTimeout(() => setGone(true), 1300);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t2);
    };
  }, []);

  if (gone) return null;

  return (
    <div className={`preloader ${done ? "done" : ""}`} aria-hidden="true">
      <div className="preloader-inner">
        <div className="preloader-logo">
          <img src="/logo.png" alt="DEADSTOX" width="187" height="120" />
        </div>
        <div className="preloader-bar"><span style={{ transform: `scaleX(${count / 100})` }} /></div>
        <div className="preloader-count">{String(count).padStart(3, "0")}</div>
      </div>
    </div>
  );
}
