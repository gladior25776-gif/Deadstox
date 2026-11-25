const WORDS = ["Heavyweight", "Unfiltered", "Wear your mindset", "Limited drops", "Built loud"];

function Group() {
  return (
    <div className="marquee-group">
      {WORDS.map((w, i) => (
        <span key={w} className="marquee-pair">
          <span className={`marquee-item ${i % 2 ? "o" : ""}`}>{w}</span>
          <span className="marquee-dot">✦</span>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        <Group />
        <Group />
      </div>
    </div>
  );
}
