import { useState, useEffect, useRef } from "react";

function LazyImg({ src, alt }) {
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { rootMargin:"300px" });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ width:"100%", height:"100%", position:"relative", background:"#161616" }}>
      {!loaded && <div className="img-shimmer" />}
      {inView && (
        <img src={src} alt={alt}
          style={{ width:"100%", height:"100%", objectFit:"contain", objectPosition:"center",
                   padding:"10px", display:"block", opacity: loaded?1:0, transition:"opacity .5s ease" }}
          onLoad={() => setLoaded(true)}
          onError={e => { e.target.style.opacity=".06"; }}
        />
      )}
    </div>
  );
}

export default function ProductCard({ product: p, onClick }) {
  const cardRef = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { rootMargin:"0px 0px -40px 0px" });
    if (cardRef.current) obs.observe(cardRef.current);
    return () => obs.disconnect();
  }, []);

  const hasDiscount  = p.discountActive && p.discountPrice && p.discountPrice < p.price;
  const displayPrice = hasDiscount ? p.discountPrice : p.price;
  const discountPct  = hasDiscount ? Math.round((1 - p.discountPrice / p.price) * 100) : 0;

  // Collect all variant color dots (up to 4)
  const colorDots = p.variants?.length > 1
    ? p.variants.slice(0, 5).map(v => ({ hex: v.colorHex || "#888", name: v.color }))
    : [];

  return (
    <div ref={cardRef} className="pcard"
      onClick={() => onClick(p)}
      style={{
        opacity:   visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition:"opacity .6s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.22,1,.36,1)",
      }}
    >
      <div className="pcard-img">
        <LazyImg src={p.images?.[0]} alt={p.name} />

        {/* ── Discount badge — big and obvious ── */}
        {hasDiscount && (
          <div className="pcard-discount-badge">
            -{discountPct}%
          </div>
        )}
        {p.badge && !hasDiscount && <div className="pbadge">{p.badge}</div>}
      </div>

      <div className="pcard-info">
        <div className="pcard-sport">{p.sport} · {p.category}</div>
        <div className="pcard-name">{p.name}</div>

        {/* ── Color dots row ── */}
        {colorDots.length > 0 ? (
          <div style={{ display:"flex", gap:5, marginTop:5, alignItems:"center" }}>
            {colorDots.map((d, i) => (
              <div key={i} title={d.name}
                style={{
                  width:13, height:13, borderRadius:"50%",
                  background: d.hex,
                  border: "1.5px solid rgba(255,255,255,.18)",
                  flexShrink: 0,
                }}
              />
            ))}
            {p.variants?.length > 5 && (
              <span style={{ fontSize:".6rem", color:"rgba(255,255,255,.3)", fontWeight:700 }}>
                +{p.variants.length - 5}
              </span>
            )}
          </div>
        ) : (
          <div className="pcard-sub">{p.color}</div>
        )}

        <div className="pcard-foot">
          <span className="pcard-price">
            {hasDiscount && (
              <span style={{ fontSize:".72rem", color:"rgba(255,255,255,.28)", fontWeight:400,
                             textDecoration:"line-through", marginRight:6 }}>
                {p.price?.toLocaleString()}
              </span>
            )}
            <span style={{ color: hasDiscount ? "#F4C430" : "inherit" }}>
              {displayPrice?.toLocaleString()}
            </span>{" "}
            <span style={{ fontSize:".62rem", color:"rgba(255,255,255,.28)", fontWeight:400 }}>EGP</span>
          </span>
          <button className="pcard-add" aria-label="View product">+</button>
        </div>
      </div>
    </div>
  );
}