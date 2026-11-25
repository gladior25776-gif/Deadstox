export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

export function lockScroll(lock) {
  const l = window.__lenis;
  if (l) (lock ? l.stop() : l.start());
  document.documentElement.style.overflow = lock ? "hidden" : "";
}
