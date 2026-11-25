"use client";
import { useEffect, useRef } from "react";

/**
 * Ultra-smooth hover / touch zoom.
 * The <img> is laid out at 2x size and scaled to 0.5 at rest, so the browser
 * rasterises it at double resolution — the zoom stays sharp instead of blurring.
 * Pointer position and zoom level are eased in a requestAnimationFrame loop.
 */
export default function ZoomImage({ src, alt, zoom = 2.6 }) {
  const box = useRef(null);
  const img = useRef(null);
  const st = useRef({ x: 0, y: 0, tx: 0, ty: 0, z: 1, tz: 1, raf: 0 });

  const tick = () => {
    const s = st.current;
    s.x += (s.tx - s.x) * 0.14;
    s.y += (s.ty - s.y) * 0.14;
    s.z += (s.tz - s.z) * 0.1;
    const tx = s.x * (1 - s.z);
    const ty = s.y * (1 - s.z);
    if (img.current) {
      img.current.style.transform = `translate3d(${tx}px,${ty}px,0) scale(${0.5 * s.z})`;
    }
    const moving =
      Math.abs(s.tx - s.x) > 0.1 || Math.abs(s.ty - s.y) > 0.1 || Math.abs(s.tz - s.z) > 0.002;
    s.raf = moving ? requestAnimationFrame(tick) : 0;
  };
  const kick = () => {
    if (!st.current.raf) st.current.raf = requestAnimationFrame(tick);
  };

  useEffect(() => () => cancelAnimationFrame(st.current.raf), []);

  const point = (e) => {
    const r = box.current.getBoundingClientRect();
    return [
      Math.min(r.width, Math.max(0, e.clientX - r.left)),
      Math.min(r.height, Math.max(0, e.clientY - r.top)),
    ];
  };

  const enter = (e) => {
    const s = st.current;
    const [x, y] = point(e);
    if (s.tz === 1) { s.x = x; s.y = y; }
    s.tx = x; s.ty = y; s.tz = zoom;
    box.current.classList.add("is-zoomed");
    kick();
  };
  const move = (e) => {
    const s = st.current;
    const [x, y] = point(e);
    s.tx = x; s.ty = y;
    if (s.tz === 1) enter(e);
    kick();
  };
  const leave = () => {
    st.current.tz = 1;
    box.current.classList.remove("is-zoomed");
    kick();
  };

  return (
    <div
      ref={box}
      className="zoom-box"
      onPointerEnter={(e) => e.pointerType !== "touch" && enter(e)}
      onPointerMove={(e) => e.pointerType !== "touch" && move(e)}
      onPointerLeave={(e) => e.pointerType !== "touch" && leave(e)}
      onPointerDown={(e) => e.pointerType === "touch" && enter(e)}
      onPointerUp={(e) => e.pointerType === "touch" && leave(e)}
      onPointerCancel={leave}
    >
      <img ref={img} className="zoom-img" src={src} alt={alt} loading="lazy" draggable={false} />
      <span className="zoom-hint" aria-hidden="true">
        <span className="hint-hover">Hover to zoom</span>
        <span className="hint-touch">Touch &amp; hold to zoom</span>
      </span>
    </div>
  );
}
