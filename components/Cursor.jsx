"use client";
import { useEffect, useRef } from "react";

export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.body.classList.add("has-cursor");

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my, raf = 0;

    const move = (e) => {
      mx = e.clientX; my = e.clientY;
      dot.current.style.transform = `translate3d(${mx}px,${my}px,0)`;
      ring.current.classList.remove("hide");
    };
    const over = (e) => {
      const t = e.target.closest ? e.target.closest("[data-cursor], a, button, input, textarea") : null;
      const r = ring.current;
      r.classList.remove("link", "zoom");
      if (!t) return;
      const text = t.getAttribute("data-cursor");
      if (text) {
        label.current.textContent = text;
        r.classList.add("zoom");
      } else {
        r.classList.add("link");
      }
    };
    const leave = () => ring.current && ring.current.classList.add("hide");

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.current.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.body.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
      <div className="cursor-ring hide" ref={ring} aria-hidden="true">
        <span className="ring-shape" />
        <span className="ring-label" ref={label} />
      </div>
    </>
  );
}
