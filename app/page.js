'use client';
import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';

/* ====== EDIT HERE: brand + products ====== */
const BRAND = 'DEADSTOX';
const LOGO = '/logo.png';
const IG = 'https://www.instagram.com/deadstox.in';
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
// tee = shirt colour, ink = placeholder graphic colour, art = placeholder graphic (0-5).
// When you have real artwork: put it in /public/tees/ and set graphic: '/tees/name.png'
const PRODUCTS = [
  { id: 1, name: 'Dead Crown Tee', cat: 'Tee', price: 1499, note: 'Heavyweight cotton, relaxed fit', tee: '#0b0a0a', ink: '#d1161e', art: 0, graphic: '' },
  { id: 2, name: 'Voltage Tee', cat: 'Tee', price: 1499, note: 'Heavyweight cotton, relaxed fit', tee: '#e9e1cf', ink: '#111111', art: 1, graphic: '' },
  { id: 3, name: 'Third Eye Tee', cat: 'Tee', price: 1599, note: 'Heavyweight cotton, relaxed fit', tee: '#7a0f16', ink: '#efe6d2', art: 2, graphic: '' },
  { id: 4, name: 'Rebel Star Tee', cat: 'Tee', price: 1599, note: 'Heavyweight cotton, relaxed fit', tee: '#26262a', ink: '#c8a24a', art: 3, graphic: '' },
  { id: 5, name: 'Orbit Tee', cat: 'Tee', price: 1499, note: 'Heavyweight cotton, relaxed fit', tee: '#0b0a0a', ink: '#c8a24a', art: 4, graphic: '' },
  { id: 6, name: 'Crossed Out Tee', cat: 'Tee', price: 1699, note: 'Heavyweight cotton, relaxed fit', tee: '#e9e1cf', ink: '#7a0f16', art: 5, graphic: '' },
];
/* ========================================= */

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

export default function Page() {
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [sel, setSel] = useState(null);
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState('');
  const [toast, setToast] = useState('');
  const lenis = useRef(null);

  useEffect(() => {
    const l = new Lenis({ duration: 1.3, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.current = l;
    let raf;
    const loop = (t) => { l.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    l.on('scroll', ({ scroll }) => document.documentElement.style.setProperty('--sy', scroll));
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')), { threshold: 0.15 });
    document.querySelectorAll('[data-r]').forEach((el) => io.observe(el));
    const t = setTimeout(() => setReady(true), 2200);
    return () => { cancelAnimationFrame(raf); l.destroy(); io.disconnect(); clearTimeout(t); };
  }, []);

  useEffect(() => {
    const locked = bagOpen || sel || !ready;
    locked ? lenis.current?.stop() : lenis.current?.start();
    document.body.style.overflow = locked ? 'hidden' : '';
  }, [bagOpen, sel, ready]);

  const open = (p) => { setSel(p); setSize(''); setQty(1); setErr(''); };
  const add = () => {
    if (!size) return setErr('Choose a size to continue.');
    setCart((c) => {
      const k = sel.id + size, f = c.find((i) => i.k === k);
      return f ? c.map((i) => (i.k === k ? { ...i, qty: i.qty + qty } : i)) : [...c, { k, p: sel, size, qty }];
    });
    setToast(`${sel.name} (${size}) added to your bag`);
    setTimeout(() => setToast(''), 2600);
    setSel(null); setBagOpen(true);
  };
  const upd = (k, d) => setCart((c) => c.map((i) => (i.k === k ? { ...i, qty: Math.max(1, i.qty + d) } : i)));
  const del = (k) => setCart((c) => c.filter((i) => i.k !== k));
  const count = cart.reduce((a, i) => a + i.qty, 0);
  const total = cart.reduce((a, i) => a + i.qty * i.p.price, 0);
  const go = (id) => { setBagOpen(false); lenis.current?.scrollTo(id, { offset: -60, duration: 1.8 }); };

  return (
    <>
      <div className={`curtain ${ready ? 'up' : ''}`} aria-hidden={ready}>
        <div className="curtain-in"><Crest className="crown" /><img src={LOGO} alt="DEADSTOX" /></div>
      </div>

      <header className="nav">
        <button className="logo" onClick={() => go(0)} aria-label="DEADSTOX home"><img src={LOGO} alt="DEADSTOX" /></button>
        <nav>
          <button onClick={() => go('#collection')}>Collection</button>
          <button onClick={() => go('#craft')}>Story</button>
          <a href={IG} target="_blank" rel="noopener noreferrer">Instagram</a>
          <button onClick={() => go('#contact')}>Contact</button>
        </nav>
        <button className="bag" onClick={() => setBagOpen(true)}>Bag <b>{count}</b></button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-bg" />
          <div className={`hero-logo ${ready ? 'go' : ''}`}><Crest className="crown" /><img src={LOGO} alt="DEADSTOX" /></div>
          <h1 className={ready ? 'go' : ''}>
            {['Street', 'royalty,', 'made', 'to', 'last'].map((w, i) => (
              <span className="w" key={w}><span style={{ '--d': `${1.2 + i * 0.1}s` }}>{w}</span></span>
            ))}
          </h1>
          <p className="sub">Limited tees. Heavy cotton. Cut for the ones who rule the block.</p>
          <button className="cta" onClick={() => go('#collection')}>Shop the drop</button>
          <div className="scroll-line" />
        </section>

        <div className="marquee" aria-hidden="true">
          <div>{Array(8).fill('DEADSTOX · Limited drops · Heavy cotton · Street royalty · ').map((t, i) => <span key={i}>{t}</span>)}</div>
        </div>

        <section className="sec" id="craft">
          <div className="narrow" data-r>
            <h2>Born on the street. Crowned in cotton.</h2>
            <p>DEADSTOX makes limited-run tees with heavyweight fabric, bold graphics and a clean fit. Every drop is small, so what you wear stays rare.</p>
          </div>
        </section>

        <section className="sec" id="collection">
          <div className="head" data-r>
            <h2>The tee collection</h2>
            <p>Six tees in the current drop. Tap a tee to choose your size.</p>
          </div>
          <div className="grid">
            {PRODUCTS.map((p, i) => (
              <article className="card" data-r style={{ '--d': `${(i % 3) * 0.1}s` }} key={p.id}>
                <button className="frame" onClick={() => open(p)} aria-label={`View ${p.name}`}>
                  <Visual p={p} /><span className="quick">Choose size</span>
                </button>
                <div className="meta"><div><h3>{p.name}</h3><small>{p.note}</small></div><span>{money(p.price)}</span></div>
              </article>
            ))}
          </div>
        </section>

        <section className="split">
          <div className="split-a" data-r><h2>Every design sells out once.</h2></div>
          <div className="split-b" data-r>
            <p>We print small batches and never restock a design. When a tee is gone, it is gone.</p>
            <button className="cta ghost" onClick={() => go('#collection')}>Shop now</button>
          </div>
        </section>

        <section className="sec news" data-r>
          <h2>Get first access to drops</h2>
          <p>Join the list to hear when the next drop goes live, or follow us on Instagram.</p>
          <form onSubmit={(e) => { e.preventDefault(); e.target.reset(); setToast('You are on the list.'); setTimeout(() => setToast(''), 2600); }}>
            <input type="email" required placeholder="Your email address" aria-label="Email address" />
            <button className="cta">Join</button>
          </form>
          <a className="cta ghost ig" href={IG} target="_blank" rel="noopener noreferrer">Follow @deadstox.in</a>
        </section>
      </main>

      <footer id="contact">
        <div className="f-top">
          <div><img className="f-logo" src={LOGO} alt="DEADSTOX" /><p className="f-tag">Street royalty, made to last.</p></div>
          <div><h4>Shop</h4><a href="#collection" onClick={(e) => { e.preventDefault(); go('#collection'); }}>New arrivals</a><a href="#collection">All tees</a><a href="#collection">Latest drop</a></div>
          <div><h4>Care</h4><a href="#">Size guide</a><a href="#">Shipping and returns</a><a href="#">Alterations</a></div>
          <div><h4>Contact</h4><a href={IG} target="_blank" rel="noopener noreferrer">Instagram @deadstox.in</a><a href={IG} target="_blank" rel="noopener noreferrer">DM us to order</a></div>
        </div>
        <div className="f-bot"><span>© {new Date().getFullYear()} {BRAND}. All rights reserved.</span><span>Privacy · Terms</span></div>
      </footer>

      <div className={`scrim ${sel || bagOpen ? 'show' : ''}`} onClick={() => { setSel(null); setBagOpen(false); }} />

      <div className={`modal ${sel ? 'show' : ''}`} role="dialog" aria-modal="true">
        {sel && (<>
          <button className="x" onClick={() => setSel(null)} aria-label="Close">×</button>
          <div className="m-vis"><Visual p={sel} /></div>
          <div className="m-info">
            <h3>{sel.name}</h3><div className="price">{money(sel.price)}</div><p>{sel.note}.</p>
            <div className="lbl">Size</div>
            <div className="sizes">{SIZES.map((s) => <button key={s} className={size === s ? 'on' : ''} onClick={() => { setSize(s); setErr(''); }}>{s}</button>)}</div>
            {err && <div className="err" role="alert">{err}</div>}
            <div className="lbl">Quantity</div>
            <div className="qty"><button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">−</button><span>{qty}</span><button onClick={() => setQty(qty + 1)} aria-label="Increase">+</button></div>
            <button className="cta full" onClick={add}>Add to bag · {money(sel.price * qty)}</button>
          </div>
        </>)}
      </div>

      <aside className={`drawer ${bagOpen ? 'show' : ''}`} aria-label="Shopping bag">
        <div className="d-head"><h3>Your bag</h3><button className="x" onClick={() => setBagOpen(false)} aria-label="Close">×</button></div>
        <div className="d-list">
          {!cart.length && <p className="empty">Your bag is empty. <button onClick={() => go('#collection')}>Browse the collection</button></p>}
          {cart.map((i) => (
            <div className="line" key={i.k}>
              <div className="thumb"><Visual p={i.p} /></div>
              <div className="l-info"><b>{i.p.name}</b><small>Size {i.size}</small>
                <div className="qty sm"><button onClick={() => upd(i.k, -1)} aria-label="Decrease">−</button><span>{i.qty}</span><button onClick={() => upd(i.k, 1)} aria-label="Increase">+</button></div>
              </div>
              <div className="l-r"><span>{money(i.p.price * i.qty)}</span><button onClick={() => del(i.k)}>Remove</button></div>
            </div>
          ))}
        </div>
        <div className="d-foot"><div className="tot"><span>Subtotal</span><b>{money(total)}</b></div><small>Shipping and taxes are calculated at checkout.</small>
          <button className="cta full" disabled={!cart.length} onClick={() => alert('Connect Razorpay or Stripe here to take payment.')}>Checkout</button></div>
      </aside>

      <div className={`toast ${toast ? 'show' : ''}`} role="status">{toast}</div>
    </>
  );
}
