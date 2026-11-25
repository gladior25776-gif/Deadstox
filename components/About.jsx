import Reveal from "./Reveal";

const VALUES = [
  { n: "01", t: "Heavyweight, always", d: "Thick, structured fabric that hangs right and lasts. No thin basics — ever." },
  { n: "02", t: "Designs with a pulse", d: "Graphics that start conversations. Printed bold, made to be seen up close." },
  { n: "03", t: "Limited by design", d: "Small drops, big attitude. When a piece is gone, it's gone." },
];

export default function About() {
  return (
    <section className="section about" id="about">
      <div className="container about-grid">
        <Reveal className="about-left">
          <p className="eyebrow">About us</p>
          <h2 className="h2">Built loud.<br /><span className="outline">Worn louder.</span></h2>
          <p className="lead">
            DEADSTOX is streetwear for people who refuse to dim themselves. We design premium
            heavyweight pieces that say what you're thinking before you do.
          </p>
          <div className="spin-badge" aria-hidden="true">
            <svg viewBox="0 0 200 200">
              <defs><path id="circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
              <text fontSize="16" letterSpacing="3" fill="currentColor" fontWeight="700">
                <textPath href="#circ" textLength="486" lengthAdjust="spacing">UNFILTERED ✦ HEAVYWEIGHT ✦ DEADSTOX ✦ </textPath>
              </text>
            </svg>
            <b>D</b>
          </div>
        </Reveal>

        <div className="about-right">
          {VALUES.map((v, i) => (
            <Reveal key={v.n} delay={i * 120} className="value">
              <span className="value-n">{v.n}</span>
              <div>
                <h3>{v.t}</h3>
                <p>{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
