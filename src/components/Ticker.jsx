// Ticker — yellow marquee, faster speed
export default function Ticker() {
  const msg = "🚚  Orders over 1000 EGP — FREE SHIPPING";
  // Repeat many times for seamless loop
  const items = Array(20).fill(msg);
  return (
    <div className="tick">
      <div className="tick-t" style={{ animationDuration:"12s" }}>
        {items.map((t, i) => (
          <span className="tick-i" key={i}>
            {t}
            <span className="tick-s">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
