'use client';
import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';

/* ====== EDIT HERE: brand + products ====== */
const BRAND = 'DEADSTOX';
const LOGO = '/logo.png';
const IG = 'https://www.instagram.com/deadstox.in';
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
// tee = shirt colour, ink = placeholder graphic colour, art = placeholder graphic (0-5).
// Real artwork: put transparent PNGs in /public/tees/ and set graphic: '/tees/name.png'
const PRODUCTS = [
  { id: 1, name: 'Dead Crown Tee', cat: 'Tee', price: 1499, note: 'Heavyweight cotton, relaxed fit', tee: '#0b0a0a', ink: '#d1161e', art: 0, graphic: '' },
  { id: 2, name: 'Voltage Tee', cat: 'Tee', price: 1499, note: 'Heavyweight cotton, relaxed fit', tee: '#e9e1cf', ink: '#111111', art: 1, graphic: '' },
  { id: 3, name: 'Third Eye Tee', cat: 'Tee', price: 1599, note: 'Heavyweight cotton, relaxed fit', tee: '#7a0f16', ink: '#efe6d2', art: 2, graphic: '' },
  { id: 4, name: 'Rebel Star Tee', cat: 'Tee', price: 1599, note: 'Heavyweight cotton, relaxed fit', tee: '#26262a', ink: '#c8a24a', art: 3, graphic: '' },
  { id: 5, name: 'Orbit Tee', cat: 'Tee', price: 1499, note: 'Heavyweight cotton, relaxed fit', tee: '#0b0a0a', ink: '#c8a24a', art: 4, graphic: '' },
  { id: 6, name: 'Crossed Out Tee', cat: 'Tee', price: 1699, note: 'Heavyweight cotton, relaxed fit', tee: '#e9e1cf', ink: '#7a0f16', art: 5, graphic: '' },
];
const MARQUEE_1 = ['Limited drops', 'Heavy cotton', 'Street royalty', 'Never restocked'];
const MARQUEE_2 = ['DEADSTOX', 'Dead on arrival', 'Worn by kings', 'DEADSTOX'];
/* ========================================= */

const STORY = 'Born on the street. Crowned in cotton. DEADSTOX makes limited tees in heavyweight fabric with bold graphics and a clean fit. Every drop is small, so what you wear stays rare.'.split(' ');
const LINKS = [['Story', '#story'], ['Collection', '#collection'], ['Lookbook', '#lookbook'], ['Drop', '#drop']];
// Lookbook: tee = product id shown. Add real photos later with img: '/lookbook/look1.jpg'
const LOOKBOOK = [
  { title: 'After dark', line: 'Black on black. Quiet, loud, unmistakable.', tee: 1, img: '' },
  { title: 'Concrete crown', line: 'Heavy cotton built for the block.', tee: 3, img: '' },
  { title: 'Last call', line: 'Small runs. Gone once they are gone.', tee: 4, img: '' },
];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const money = (n) => '₹' + n.toLocaleString('en-IN');

const Crest = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M18 78h64M22 78l-6-40 20 16 14-30 14 30 20-16-6 40z" strokeLinejoin="round" />
    <circle cx="50" cy="24" r="3" /><circle cx="14" cy="34" r="2.5" /><circle cx="86" cy="34" r="2.5" />
  </svg>
);

const ART = [
  (c) => (<g><circle r="46" fill="none" stroke={c} strokeWidth="4" /><path d="M-26 16l-6-34 18 12 14-24 14 24 18-12-6 34z" fill={c} /></g>),
  (c) => (<path d="M12-52L-26 8h22L-12 52 28-14H4z" fill={c} />),
  (c) => (<g fill="none" stroke={c} strokeWidth="4"><path d="M0-48L48 36H-48z" /><circle r="12" fill={c} /></g>),
  (c) => (<path d="M0-50l12 36 38 2-30 22 11 36-31-22-31 22 11-36-30-22 38-2z" fill={c} />),
  (c) => (<g fill="none" stroke={c} strokeWidth="4"><circle r="46" /><circle r="30" /><circle r="14" fill={c} /></g>),
  (c) => (<g stroke={c} strokeWidth="5" strokeLinecap="round" fill="none"><path d="M-40-40L40 40M40-40L-40 40" /><rect x="-46" y="-46" width="92" height="92" /></g>),
];
function Visual({ p }) {
  return (
    <svg className="tee" viewBox="0 0 300 340" role="img" aria-label={p.name}>
      <path d="M95 20L60 32 12 80l36 38 30-22v222h144V96l30 22 36-38-48-48-35-12Q150 58 95 20z" fill={p.tee} stroke="rgba(200,162,74,.5)" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M95 20Q150 58 205 20" fill="none" stroke="rgba(0,0,0,.35)" strokeWidth="5" />
      <g transform="translate(150 140)">
        {p.graphic ? <image href={p.graphic} x="-80" y="-80" width="160" height="160" preserveAspectRatio="xMidYMid meet" /> : ART[p.art % ART.length](p.ink)}
      </g>
      <text x="150" y="226" textAnchor="middle" fontSize="13" letterSpacing="5" fill={p.ink} opacity=".75">DEADSTOX</text>
    </svg>
  );
}

function Split({ as: T = 'h2', text }) {
  return <T data-s>{text.split(' ').map((w, i) => <span className="sp" key={i}><span style={{ '--i': i }}>{w}</span>{' '}</span>)}</T>;
}

/* Rising embers in the hero: react to the mouse, pause when off-screen */
function Embers() {
  const cv = useRef(null);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const c = cv.current, g = c.getContext('2d');
    let W = 0, H = 0, raf, on = true, mx = -999, my = -999, ps = [];
    const N = innerWidth < 760 ? 36 : 80;
    const mk = (init) => ({ x: Math.random() * W, y: init ? Math.random() * H : H + 10, r: Math.random() * 2.2 + 0.5, vy: Math.random() * 0.6 + 0.25, vx: (Math.random() - 0.5) * 0.3, ph: Math.random() * 6.28, gold: Math.random() < 0.35 });
    const size = () => {
      const d = Math.min(devicePixelRatio || 1, 2);
      W = c.clientWidth; H = c.clientHeight; c.width = W * d; c.height = H * d; g.setTransform(d, 0, 0, d, 0, 0);
      if (!ps.length) ps = Array.from({ length: N }, () => mk(true));
    };
    size();
    const mv = (e) => { const r = c.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; };
    const draw = (t) => {
      raf = requestAnimationFrame(draw);
      if (!on) return;
      g.clearRect(0, 0, W, H);
      for (const p of ps) {
        const dx = p.x - mx, dy = p.y - my, d = Math.hypot(dx, dy) || 1;
        if (d < 150) { p.x += (dx / d) * (150 - d) * 0.03; p.y += (dy / d) * (150 - d) * 0.03; }
        p.y -= p.vy; p.x += p.vx + Math.sin(t * 0.0008 + p.ph) * 0.25;
        if (p.y < -10) Object.assign(p, mk(false));
        const a = clamp(p.y / H) * 0.95 * (0.6 + 0.4 * Math.sin(t * 0.004 + p.ph));
        g.beginPath(); g.fillStyle = p.gold ? `rgba(230,207,142,${a})` : `rgba(235,40,40,${a})`;
        g.shadowBlur = 10; g.shadowColor = p.gold ? '#c8a24a' : '#d1161e';
        g.arc(p.x, p.y, p.r, 0, 6.283); g.fill();
      }
    };
    raf = requestAnimationFrame(draw);
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; }); io.observe(c);
    window.addEventListener('resize', size); window.addEventListener('mousemove', mv);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', size); window.removeEventListener('mousemove', mv); };
  }, []);
  return <canvas className="embers" ref={cv} aria-hidden="true" />;
}

/* Constant-speed marquee (px per second) so it is always readable; pauses on hover; speeds up a little while scrolling */
function Marquee({ items, speed = 36, rev = false, outline = false }) {
  const track = useRef(null);
  const paused = useRef(false);
  useEffect(() => {
    const el = track.current;
    let x = 0, last = performance.now(), raf, py = scrollY, v = 0;
    const tick = (t) => {
      const dt = Math.min(t - last, 50); last = t;
      const w = el.firstChild.offsetWidth;
      const y = scrollY; v += (Math.abs(y - py) - v) * 0.1; py = y;
      if (!paused.current) x += (rev ? 1 : -1) * speed * (1 + Math.min(v * 0.1, 3)) * dt / 1000;
      if (x <= -w) x += w;
      if (x > 0) x -= w;
      el.style.transform = `translate3d(${x}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [speed, rev]);
  const grp = (k) => (
    <div className="grp" key={k} aria-hidden={k === 1}>
      {[0, 1, 2].flatMap((n) => items.map((t) => <span className="mi" key={n + t}>{t}<Crest className="mk" /></span>))}
    </div>
  );
  return (
    <div className={`mq-row ${outline ? 'outline' : ''}`} onMouseEnter={() => (paused.current = true)} onMouseLeave={() => (paused.current = false)}>
      <div className="mq-track" ref={track}>{grp(0)}{grp(1)}</div>
    </div>
  );
}

/* Custom cursor + magnetic buttons + hero mouse parallax (fine pointers only) */
function Cursor() {
  const dot = useRef(null), ring = useRef(null), lab = useRef(null);
  useEffect(() => {
    if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    const root = document.documentElement;
    root.classList.add('has-cur');
    let mx = -100, my = -100, rx = -100, ry = -100, raf;
    const move = (e) => {
      mx = e.clientX; my = e.clientY;
      root.style.setProperty('--mx', mx + 'px'); root.style.setProperty('--my', my + 'px');
      root.style.setProperty('--tx', (mx / innerWidth - 0.5).toFixed(3)); root.style.setProperty('--ty', (my / innerHeight - 0.5).toFixed(3));
      const t = e.target.closest ? e.target.closest('[data-cur]') : null;
      ring.current.classList.toggle('big', !!t);
      lab.current.textContent = t ? t.dataset.cur : '';
      document.querySelectorAll('.mag').forEach((el) => {
        const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const near = Math.hypot(mx - cx, my - cy) < Math.max(r.width, r.height) * 0.9;
        el.style.translate = near ? `${(mx - cx) * 0.28}px ${(my - cy) * 0.35}px` : '';
      });
    };
    const loop = () => {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.current.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      dot.current.style.transform = `translate3d(${mx}px,${my}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    const down = () => ring.current.classList.add('press'), up = () => ring.current.classList.remove('press');
    window.addEventListener('mousemove', move); window.addEventListener('mousedown', down); window.addEventListener('mouseup', up);
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); root.classList.remove('has-cur'); window.removeEventListener('mousemove', move); window.removeEventListener('mousedown', down); window.removeEventListener('mouseup', up); };
  }, []);
  return (<><div className="cur-dot" ref={dot} /><div className="cur-ring" ref={ring}><span ref={lab} /></div></>);
}

function Card({ p, onOpen }) {
  const f = useRef(null);
  const mv = (e) => {
    const r = f.current.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    f.current.style.transform = `perspective(1000px) rotateY(${(x - 0.5) * 14}deg) rotateX(${(0.5 - y) * 14}deg) scale(1.02)`;
    f.current.style.setProperty('--gx', x * 100 + '%'); f.current.style.setProperty('--gy', y * 100 + '%');
  };
  return (
    <article className="card">
      <button ref={f} className="frame" data-cur="View" onMouseMove={mv} onMouseLeave={() => (f.current.style.transform = '')} onClick={(e) => onOpen(p, e)} aria-label={`View ${p.name}`}>
        <Visual p={p} /><span className="glare" />
      </button>
      <div className="meta"><div><h3>{p.name}</h3><small>{p.note}</small></div><span>{money(p.price)}</span></div>
    </article>
  );
}

export default function Page() {
  const [pct, setPct] = useState(0);
  const [ready, setReady] = useState(false);
  const [gone, setGone] = useState(false);
  const [cart, setCart] = useState([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [hide, setHide] = useState(false);
  const [active, setActive] = useState('');
  const [sel, setSel] = useState(null);
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState('');
  const [toast, setToast] = useState('');
  const lenis = useRef(null), storyRef = useRef(null), hsRef = useRef(null), trackRef = useRef(null), pdpRef = useRef(null), shown = useRef(null);

  useEffect(() => {
    let raf; const t0 = performance.now();
    const tick = (t) => {
      const p = clamp((t - t0) / 2400);
      setPct(Math.round(100 * (1 - Math.pow(1 - p, 2.2))));
      if (p < 1) raf = requestAnimationFrame(tick); else setTimeout(() => setReady(true), 300);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  useEffect(() => { if (ready) { const t = setTimeout(() => setGone(true), 2000); return () => clearTimeout(t); } }, [ready]);

  useEffect(() => {
    const l = new Lenis({ lerp: 0.075, wheelMultiplier: 0.9 });
    lenis.current = l;
    const root = document.documentElement;
    const words = [...document.querySelectorAll('.sw')];
    const lb = [...document.querySelectorAll('.lb-item')];
    let last = 0, desk = false, raf;
    const upd = (y) => {
      root.style.setProperty('--sy', y);
      root.style.setProperty('--p', (y / Math.max(1, root.scrollHeight - innerHeight)).toFixed(4));
      if (y > last + 3 && y > 160) setHide(true); else if (y < last - 3 || y < 160) setHide(false);
      if (Math.abs(y - last) > 3) last = y;
      const st = storyRef.current;
      if (st) {
        const r = st.getBoundingClientRect(), p = clamp((innerHeight * 0.85 - r.top) / (r.height * 0.85));
        words.forEach((w, i) => { w.style.opacity = (0.14 + 0.86 * clamp(p * words.length * 1.1 - i)).toFixed(3); });
      }
      const hs = hsRef.current, tr = trackRef.current;
      if (hs && desk) {
        const r = hs.getBoundingClientRect(), pr = clamp(-r.top / (hs.offsetHeight - innerHeight));
        tr.style.transform = `translate3d(${-pr * (tr.offsetWidth - innerWidth)}px,0,0)`;
        hs.style.setProperty('--tp', pr.toFixed(3));
      }
      lb.forEach((el, i) => {
        const nx = lb[i + 1], t = nx ? clamp(1 - nx.getBoundingClientRect().top / (innerHeight * 0.9)) : 0;
        el.style.transform = `scale(${1 - 0.07 * t})`; el.style.filter = `brightness(${1 - 0.45 * t})`;
      });
      let a = '';
      ['story', 'collection', 'lookbook', 'drop'].forEach((id) => { const e = document.getElementById(id); if (e && e.getBoundingClientRect().top < innerHeight * 0.45) a = id; });
      setActive((p) => (p === a ? p : a));
    };
    const size = () => {
      const hs = hsRef.current, tr = trackRef.current;
      desk = matchMedia('(min-width:1025px)').matches;
      if (desk) hs.style.height = tr.offsetWidth - innerWidth + innerHeight + 'px'; else { hs.style.height = ''; tr.style.transform = ''; }
      upd(window.scrollY);
    };
    l.on('scroll', ({ scroll }) => upd(scroll));
    const loop = (t) => { l.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    size(); window.addEventListener('resize', size); window.addEventListener('load', size);
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')), { threshold: 0.15 });
    document.querySelectorAll('[data-r],[data-s]').forEach((el) => io.observe(el));
    return () => { cancelAnimationFrame(raf); l.destroy(); io.disconnect(); window.removeEventListener('resize', size); window.removeEventListener('load', size); };
  }, []);

  useEffect(() => {
    const locked = bagOpen || sel || menu || !ready;
    locked ? lenis.current?.stop() : lenis.current?.start();
    document.body.style.overflow = locked ? 'hidden' : '';
  }, [bagOpen, sel, menu, ready]);

  const open = (p, e) => {
    const st = document.documentElement.style;
    st.setProperty('--ox', e ? e.clientX + 'px' : '50%'); st.setProperty('--oy', e ? e.clientY + 'px' : '50%');
    setSel(p); setSize(''); setQty(1); setErr('');
    history.replaceState(null, '', '#tee-' + p.id);
    pdpRef.current?.scrollTo({ top: 0 });
  };
  const close = () => { setSel(null); history.replaceState(null, '', location.pathname + location.search); };
  useEffect(() => {
    const k = (e) => { if (e.key === 'Escape') { if (sel) close(); else if (bagOpen) setBagOpen(false); } };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, [sel, bagOpen]);
  useEffect(() => {
    if (!ready) return;
    const m = location.hash.match(/^#tee-(\d+)/), p = m && PRODUCTS.find((x) => x.id === +m[1]);
    if (p) open(p);
  }, [ready]);
  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 2600); };
  const add = () => {
    if (!size) return setErr('Choose a size to continue.');
    setCart((c) => {
      const k = sel.id + size, f = c.find((i) => i.k === k);
      return f ? c.map((i) => (i.k === k ? { ...i, qty: i.qty + qty } : i)) : [...c, { k, p: sel, size, qty }];
    });
    flash(`${sel.name} (${size}) added to your bag`);
    close(); setBagOpen(true);
  };
  const upd2 = (k, d) => setCart((c) => c.map((i) => (i.k === k ? { ...i, qty: Math.max(1, i.qty + d) } : i)));
  const del = (k) => setCart((c) => c.filter((i) => i.k !== k));
  const count = cart.reduce((a, i) => a + i.qty, 0);
  const total = cart.reduce((a, i) => a + i.qty * i.p.price, 0);
  const go = (id) => { setBagOpen(false); setMenu(false); setTimeout(() => lenis.current?.scrollTo(id, { offset: 0, duration: 2 }), 50); };
  if (sel) shown.current = sel;
  const cur = shown.current;
  const R = ready ? 'go' : '';

  return (
    <>
      <Cursor />
      <div className="progress" />

      {!gone && (
        <div className={`pre ${ready ? 'done' : ''}`} aria-hidden="true">
          <i className="pa" /><i className="pb" />
          <div className="pc">
            <Crest className="crown" />
            <div className="pl-logo"><img src={LOGO} alt="" /><img className="fill" src={LOGO} alt="" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }} /></div>
            <div className="num">{pct}</div>
          </div>
        </div>
      )}

      <header className={`nav ${hide && !menu ? 'hide' : ''}`}>
        <div className="pill">
          <button className="logo mag" data-cur="" onClick={() => go(0)} aria-label="DEADSTOX home"><img src={LOGO} alt="DEADSTOX" /></button>
          <nav className="links">
            {LINKS.map(([t, h]) => (
              <a key={t} href={h} data-cur="" className={`roll ${active === h.slice(1) ? 'on' : ''}`} data-t={t} onClick={(e) => { e.preventDefault(); go(h); }}><span>{t}</span></a>
            ))}
            <a className="roll" data-cur="" data-t="Instagram" href={IG} target="_blank" rel="noopener noreferrer"><span>Instagram</span></a>
          </nav>
          <button className="bag mag" data-cur="" onClick={() => setBagOpen(true)}>Bag <b>{count}</b></button>
          <button className={`burger ${menu ? 'x' : ''}`} onClick={() => setMenu(!menu)} aria-label="Menu"><i /><i /></button>
        </div>
      </header>

      <div className={`menu ${menu ? 'show' : ''}`}>
        {LINKS.map(([t, h]) => <a key={t} href={h} onClick={(e) => { e.preventDefault(); go(h); }}>{t}</a>)}
        <a href={IG} target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>

      <main>
        <section className="hero">
          <div className="hero-bg" /><Embers /><div className="spot" />
          <div className="stage">
            <div className={`hero-logo ${R}`}><Crest className="crown" /><img src={LOGO} alt="DEADSTOX" /></div>
          </div>
          <p className={`tag ${R}`}><span>Street royalty, made to last.</span></p>
          <div className={`hero-cta ${R}`}>
            <button className="cta mag" data-cur="" onClick={() => go('#collection')}><span>Shop the drop</span></button>
            <a className="cta ghost mag" data-cur="" href={IG} target="_blank" rel="noopener noreferrer"><span>Follow @deadstox.in</span></a>
          </div>
          <div className="scroll-line" />
        </section>

        <div className="mq" aria-label="Limited drops. Heavy cotton. Street royalty. Never restocked.">
          <Marquee items={MARQUEE_1} speed={34} />
          <Marquee items={MARQUEE_2} speed={26} rev outline />
        </div>

        <section className="story" id="story" ref={storyRef}>
          <p className="big">{STORY.map((w, i) => <span className="sw" key={i}>{w} </span>)}</p>
        </section>

        <section className="hs" id="collection" ref={hsRef}>
          <div className="hs-pin">
            <div className="hs-head"><Split text="The tee collection" /><p data-r>Six tees in the current drop. Tap a tee to choose your size.</p></div>
            <div className="hs-track" ref={trackRef}>
              {PRODUCTS.map((p) => <Card key={p.id} p={p} onOpen={open} />)}
              <div className="card end"><h3>More drops soon</h3><p>Follow us to see the next one first.</p><a className="cta ghost mag" data-cur="" href={IG} target="_blank" rel="noopener noreferrer"><span>@deadstox.in</span></a></div>
            </div>
          </div>
        </section>

        <section className="lb" id="lookbook">
          <div className="lb-head"><Split text="The lookbook" /><p data-r>Three looks from the current drop.</p></div>
          <div className="lb-stack">
            {LOOKBOOK.map((l) => { const p = PRODUCTS.find((x) => x.id === l.tee); return (
              <article className="lb-item" key={l.title} style={l.img ? { backgroundImage: `linear-gradient(90deg,rgba(8,4,5,.85),rgba(8,4,5,.15)),url(${l.img})` } : undefined}>
                <div className="lb-text"><h3>{l.title}</h3><p>{l.line}</p><button className="cta ghost mag" data-cur="" onClick={(e) => open(p, e)}><span>View {p.name}</span></button></div>
                <div className="lb-vis"><Visual p={p} /></div>
              </article>
            ); })}
          </div>
        </section>

        <section className="drop" id="drop">
          <div className="panel" data-r>
            <Crest className="bgcrown" />
            <Split text="Every design sells out once." />
            <p>We print small batches and never restock a design. When a tee is gone, it is gone.</p>
            <button className="cta mag" data-cur="" onClick={() => go('#collection')}><span>Shop now</span></button>
          </div>
        </section>

        <section className="news" data-r>
          <Split text="Get first access to drops" />
          <p>Join the list to hear when the next drop goes live.</p>
          <form onSubmit={(e) => { e.preventDefault(); e.target.reset(); flash('You are on the list.'); }}>
            <input type="email" required placeholder="Your email address" aria-label="Email address" />
            <button className="cta"><span>Join</span></button>
          </form>
        </section>
      </main>

      <footer id="contact">
        <div className="f-top">
          <div><p className="f-tag">Street royalty,<br />made to last.</p></div>
          <div><h4>Shop</h4><a className="roll" data-t="All tees" href="#collection" onClick={(e) => { e.preventDefault(); go('#collection'); }}><span>All tees</span></a><a className="roll" data-t="Latest drop" href="#drop" onClick={(e) => { e.preventDefault(); go('#drop'); }}><span>Latest drop</span></a></div>
          <div><h4>Care</h4><a href="#">Size guide</a><a href="#">Shipping and returns</a></div>
          <div><h4>Contact</h4><a href={IG} target="_blank" rel="noopener noreferrer">Instagram @deadstox.in</a><a href={IG} target="_blank" rel="noopener noreferrer">DM us to order</a></div>
        </div>
        <img className="f-giant" src={LOGO} alt="DEADSTOX" data-r />
        <div className="f-bot"><span>© {new Date().getFullYear()} {BRAND}. All rights reserved.</span><span>Privacy · Terms</span></div>
      </footer>

      <div className={`scrim ${bagOpen ? 'show' : ''}`} onClick={() => setBagOpen(false)} />

      <section className={`pdp ${sel ? 'show' : ''}`} aria-hidden={!sel} role="dialog" aria-modal="true">
        {cur && (<>
          <button className="pdp-x" onClick={close} data-cur="Close">Close</button>
          <div className="pdp-scroll" ref={pdpRef} data-lenis-prevent>
            <div className="pdp-main">
              <div className="pdp-vis" onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; e.currentTarget.firstChild.style.transform = `perspective(1200px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg)`; }} onMouseLeave={(e) => (e.currentTarget.firstChild.style.transform = '')}>
                <div className="pdp-tee"><Visual p={cur} /></div>
              </div>
              <div className="pdp-info">
                <p className="crumb">DEADSTOX / Tee</p>
                <h1>{cur.name}</h1>
                <div className="price">{money(cur.price)}</div>
                <p className="desc">{cur.note}. Limited run, printed in small batches and never restocked.</p>
                <div className="lbl">Size</div>
                <div className="sizes">{SIZES.map((z) => <button key={z} className={size === z ? 'on' : ''} onClick={() => { setSize(z); setErr(''); }}>{z}</button>)}</div>
                {err && <div className="err" role="alert">{err}</div>}
                <div className="lbl">Quantity</div>
                <div className="qty"><button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">−</button><span>{qty}</span><button onClick={() => setQty(qty + 1)} aria-label="Increase">+</button></div>
                <button className="cta full" onClick={add}><span>Add to bag · {money(cur.price * qty)}</span></button>
                <div className="acc">
                  <details><summary>Fabric and fit</summary><p>Heavyweight cotton with a relaxed, slightly boxy fit. Add your exact fabric details here.</p></details>
                  <details><summary>Shipping and returns</summary><p>Add your shipping times and return policy here.</p></details>
                  <details><summary>Care</summary><p>Wash cold, inside out. Hang dry to protect the print.</p></details>
                </div>
              </div>
            </div>
            <div className="pdp-more">
              <h3>You may also like</h3>
              <div className="pdp-row">
                {PRODUCTS.filter((o) => o.id !== cur.id).slice(0, 3).map((o) => (
                  <button className="rel" key={o.id} data-cur="View" onClick={() => open(o)}><div className="rel-v"><Visual p={o} /></div><span>{o.name}</span><b>{money(o.price)}</b></button>
                ))}
              </div>
            </div>
          </div>
        </>)}
      </section>

      <aside className={`drawer ${bagOpen ? 'show' : ''}`} aria-label="Shopping bag">
        <div className="d-head"><h3>Your bag</h3><button className="xb" onClick={() => setBagOpen(false)} aria-label="Close" data-cur="">×</button></div>
        <div className="d-list" data-lenis-prevent>
          {!cart.length && <p className="empty">Your bag is empty. <button onClick={() => go('#collection')}>Browse the collection</button></p>}
          {cart.map((i) => (
            <div className="line" key={i.k}>
              <div className="thumb"><Visual p={i.p} /></div>
              <div className="l-info"><b>{i.p.name}</b><small>Size {i.size}</small>
                <div className="qty sm"><button onClick={() => upd2(i.k, -1)} aria-label="Decrease">−</button><span>{i.qty}</span><button onClick={() => upd2(i.k, 1)} aria-label="Increase">+</button></div>
              </div>
              <div className="l-r"><span>{money(i.p.price * i.qty)}</span><button onClick={() => del(i.k)}>Remove</button></div>
            </div>
          ))}
        </div>
        <div className="d-foot"><div className="tot"><span>Subtotal</span><b>{money(total)}</b></div><small>Shipping and taxes are calculated at checkout.</small>
          <button className="cta full" disabled={!cart.length} onClick={() => alert('Connect Razorpay or Stripe here to take payment.')}><span>Checkout</span></button></div>
      </aside>

      <div className={`toast ${toast ? 'show' : ''}`} role="status">{toast}</div>
    </>
  );
}
