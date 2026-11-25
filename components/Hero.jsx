"use client";
import { useEffect, useRef } from "react";
import Magnetic from "./Magnetic";
import { scrollToId } from "@/lib/scroll";

export default function Hero() {
  const root = useRef(null);
  const spot = useRef(null);
  const ghost = useRef(null);
  const content = useRef(null);

  useEffect(() => {
    const el = root.current;
    let visible = true;
    let tx = window.innerWidth / 2, ty = window.innerHeight * 0.45;
    let cx = tx, cy = ty, raf = 0;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
    };
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0 });
    io.observe(el);
    el.addEventListener("pointermove", onMove);

    const loop = () => {
      if (visible) {
        cx += (tx - cx) * 0.08;
        cy += (ty - cy) * 0.08;
        const sy = window.scrollY;
        spot.current.style.transform = `translate3d(${cx}px,${cy}px,0)`;
        ghost.current.style.transform = `translate3d(${(cx - window.innerWidth / 2) * -0.03}px,${sy * 0.22}px,0)`;
        content.current.style.transform = `translate3d(0,${sy * 0.14}px,0)`;
        content.current.style.opacity = Math.max(0, 1 - sy / (window.innerHeight * 0.85));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointermove", onMove);
    };
  }, []);

  const go = (id) => (e) => { e.preventDefault(); scrollToId(id); };

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-spot" ref={spot} />
        <div className="hero-ghost-wrap"><div className="hero-ghost" ref={ghost}>DEADSTOX</div></div>
        <div className="hero-vignette" />
      </div>

      <div className="hero-content" ref={content}>
        <p className="eyebrow rise" style={{ "--d": "0.25s" }}>Heavyweight streetwear — Drop 01</p>
        <h1 className="hero-title">
          <span className="hero-line"><span>Wear your</span></span>
          <span className="hero-line"><span className="outline">Mindset.</span></span>
        </h1>
        <p className="hero-sub rise" style={{ "--d": "0.9s" }}>Premium heavyweight streetwear built for the unfiltered.</p>
        <div className="hero-cta rise" style={{ "--d": "1.1s" }}>
          <Magnetic>
            <a href="#shop" className="btn btn-primary" onClick={go("shop")}><span>Shop now</span></a>
          </Magnetic>
          <Magnetic>
            <a href="#about" className="btn btn-ghost" onClick={go("about")}><span>Our story</span></a>
          </Magnetic>
        </div>
      </div>

      <div className="scroll-hint rise" style={{ "--d": "1.4s" }} aria-hidden="true">
        <span>Scroll</span>
        <i />
      </div>
    </section>
  );
}
