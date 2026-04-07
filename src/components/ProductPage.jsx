import { useState, useRef, useCallback, useEffect } from "react";
import { IPlus, IMinus, IChev } from "./ui";
import Breadcrumb from "./Breadcrumb";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

// ── Smooth swipe hook ──────────────────────────────────────────────────
function useSwipe(onSwipeLeft, onSwipeRight) {
  const touch = useRef({ x: 0, y: 0, time: 0 });

  const onTouchStart = useCallback((e) => {
    touch.current = {
      x:    e.touches[0].clientX,
      y:    e.touches[0].clientY,
      time: Date.now(),
    };
  }, []);

  const onTouchEnd = useCallback((e) => {
    const dx   = e.changedTouches[0].clientX - touch.current.x;
    const dy   = e.changedTouches[0].clientY - touch.current.y;
    const dt   = Date.now() - touch.current.time;
    const fast = dt < 400;
    const horiz = Math.abs(dx) > Math.abs(dy) * 1.5;
    const far   = Math.abs(dx) > 40;
    if (fast && horiz && far) {
      if (dx < 0) onSwipeLeft();
      else         onSwipeRight();
    }
  }, [onSwipeLeft, onSwipeRight]);

  return { onTouchStart, onTouchEnd };
}

// ── Related Products strip ─────────────────────────────────────────────
function RelatedProducts({ current, allProducts, onProductClick }) {
  const related = allProducts
    .filter(p =>
      p._id !== current._id &&
      p.active !== false &&
      (p.category || "").toLowerCase() === (current.category || "").toLowerCase()
    )
    .slice(0, 8);

  if (related.length === 0) return null;

  return (
    <div style={{ background: "#080808", paddingBottom: 80 }}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: ".58rem", fontWeight: 800, color: "#F4C430", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 5 }}>
              {current.category}
            </div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.3rem,2.5vw,1.9rem)", fontWeight: 800, letterSpacing: "-.02em", margin: 0 }}>
              You May Also Like <span style={{ color: "#F4C430" }}>→</span>
            </h2>
          </div>
          <button
            onClick={() => onProductClick(null, current.category)}
            style={{ background: "none", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, color: "rgba(255,255,255,.45)", fontSize: ".72rem", fontWeight: 700, letterSpacing: ".08em", padding: "8px 14px", cursor: "pointer", whiteSpace: "nowrap", transition: "all .2s", fontFamily: "'DM Sans',sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(244,196,48,.4)"; e.currentTarget.style.color = "#F4C430"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.12)"; e.currentTarget.style.color = "rgba(255,255,255,.45)"; }}
          >
            View all
          </button>
        </div>

        <div style={{
          display: "flex", gap: 12, overflowX: "auto", paddingBottom: 12,
          scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch",
          msOverflowStyle: "none", scrollbarWidth: "none",
        }}>
          {related.map(item => {
            const hasDiscount  = item.discountActive && item.discountPrice && item.discountPrice < item.price;
            const displayPrice = hasDiscount ? item.discountPrice : item.price;
            const discountPct  = hasDiscount ? Math.round((1 - item.discountPrice / item.price) * 100) : 0;
            const img          = item.variants?.[0]?.images?.[0] || item.images?.[0] || "";
            return (
              <div
                key={item._id}
                onClick={() => onProductClick(item)}
                role="button" tabIndex={0}
                onKeyDown={e => e.key === "Enter" && onProductClick(item)}
                style={{
                  flexShrink: 0, width: 155, scrollSnapAlign: "start",
                  background: "#111", border: "1px solid rgba(255,255,255,.06)",
                  borderRadius: 14, overflow: "hidden", cursor: "pointer",
                  transition: "transform .25s, border-color .25s, box-shadow .25s",
                  position: "relative",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(244,196,48,.3)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "rgba(255,255,255,.06)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ height: 155, background: "#161616", position: "relative", overflow: "hidden" }}>
                  {img && <img src={img} alt={item.name} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 10, display: "block" }} />}
                  {hasDiscount && (
                    <div style={{ position: "absolute", top: 0, right: 0, background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "#fff", fontSize: ".62rem", fontWeight: 800, padding: "5px 8px", borderRadius: "0 14px 0 10px" }}>
                      -{discountPct}%
                    </div>
                  )}
                </div>
                <div style={{ padding: "10px 11px 12px" }}>
                  <div style={{ fontSize: ".55rem", fontWeight: 800, color: "#F4C430", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 3 }}>{item.brand}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".78rem", fontWeight: 800, lineHeight: 1.25, color: "#F2F2F2", marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.name}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                    {hasDiscount && <span style={{ fontSize: ".62rem", color: "rgba(255,255,255,.28)", textDecoration: "line-through", fontWeight: 400 }}>{item.price?.toLocaleString()}</span>}
                    <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".88rem", fontWeight: 800, color: hasDiscount ? "#F4C430" : "#F2F2F2" }}>{displayPrice?.toLocaleString()}</span>
                    <span style={{ fontSize: ".6rem", color: "rgba(255,255,255,.28)", fontWeight: 400 }}>EGP</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Product Page ───────────────────────────────────────────────────────
export default function ProductPage({ product: p, allProducts = [], onBack, onAdd, onBuyNow, onFilterClick }) {
  const variants = p.variants?.length
    ? p.variants.filter(v => v.active !== false)
    : [{ color: p.color, colorHex: p.colorHex, images: p.images, sizes: p.sizes?.map(s => ({ label: s })) || [] }];

  const [variantIdx, setVariantIdx] = useState(0);
  const [imgIdx,     setImgIdx]     = useState(0);
  const [slideDir,   setSlideDir]   = useState(null); // "left" | "right" | null
  const [size,       setSize]       = useState(null);
  const [qty,        setQty]        = useState(1);
  const [err,        setErr]        = useState(false);
  const [zoomOpen,   setZoomOpen]   = useState(false);

  const variant = variants[variantIdx];
  const images  = variant?.images || p.images || [];
  const sizes   = (variant?.sizes || []).map(s => typeof s === "string" ? s : s.label);

  // Smooth slide navigation
  const goTo = useCallback((newIdx, dir) => {
    if (newIdx === imgIdx) return;
    setSlideDir(dir);
    setTimeout(() => {
      setImgIdx(newIdx);
      setSlideDir(null);
    }, 280);
  }, [imgIdx]);

  const prevImg = useCallback(() => {
    goTo((imgIdx - 1 + images.length) % images.length, "right");
  }, [imgIdx, images.length, goTo]);

  const nextImg = useCallback(() => {
    goTo((imgIdx + 1) % images.length, "left");
  }, [imgIdx, images.length, goTo]);

  const swipe = useSwipe(nextImg, prevImg);

  const switchVariant = (i) => { setVariantIdx(i); setImgIdx(0); setSize(null); setErr(false); };

  const hasDiscount  = p.discountActive && p.discountPrice && p.discountPrice < p.price;
  const displayPrice = hasDiscount ? p.discountPrice : p.price;
  const discountPct  = hasDiscount ? Math.round((1 - p.discountPrice / p.price) * 100) : 0;
  const totalPrice   = (displayPrice || 0) * qty;

  const validate = () => {
    if (!size && sizes.length > 0) { setErr(true); return false; }
    return true;
  };

  const handleAdd = () => {
    if (!validate()) return;
    const s = size || "One Size";
    onAdd({ ...p, color: variant.color, colorHex: variant.colorHex, images }, s, qty);
  };

  const handleBuyNow = () => {
    if (!validate()) return;
    const s = size || "One Size";
    onBuyNow({ ...p, color: variant.color, colorHex: variant.colorHex, images }, s, qty);
  };

  const crumbs = [
    { label: "Home", onClick: onBack },
    { label: p.sport ? p.sport[0].toUpperCase() + p.sport.slice(1) : "Padel", onClick: onBack },
    { label: p.category || "", onClick: p.category ? () => onFilterClick((p.category || "").toLowerCase()) : null },
    { label: p.name },
  ];

  // Slide animation classes
  const slideStyle = slideDir ? {
    transform: slideDir === "left" ? "translateX(-8%)" : "translateX(8%)",
    opacity: 0,
    transition: "transform .28s cubic-bezier(.4,0,.2,1), opacity .28s ease",
  } : {
    transform: "translateX(0)",
    opacity: 1,
    transition: "transform .28s cubic-bezier(.4,0,.2,1), opacity .28s ease",
  };

  // ── Hardware Back Button & Browser History Interception ──
  useEffect(() => {
    const handlePopState = () => {
      // If the back button is pressed, ensure the zoom is closed.
      setZoomOpen(false);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const openLightbox = () => {
    // Push a state to the browser history so the back button has something to "pop"
    window.history.pushState({ lightboxOpen: true }, "");
    setZoomOpen(true);
  };

  const closeLightbox = () => {
    // If they click X or outside, we manually trigger a "back" to clear the history state
    if (window.history.state?.lightboxOpen) {
      window.history.back(); 
    } else {
      setZoomOpen(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080808" }}>
      
      <Lightbox
        open={zoomOpen}
        close={closeLightbox}
        index={imgIdx}
        slides={images.map(src => ({ src }))}
        plugins={[Zoom, Thumbnails]}
        controller={{ closeOnBackdropClick: true }}
        styles={{
          root: {
            "--yarl__color_backdrop": "rgba(0, 0, 0, 0.75)", // Semi-transparent black
          },
          container: {
            backdropFilter: "blur(12px)", // The glass/blur effect
            WebkitBackdropFilter: "blur(12px)", // Support for Safari
          }
        }}
        zoom={{
          maxZoomPixelRatio: 4,
          zoomInMultiplier: 2,
          doubleTapDelay: 300,
          doubleClickDelay: 300,
          keyboardMoveDistance: 50,
          wheelZoomDistanceFactor: 100,
          pinchZoomDistanceFactor: 100,
          scrollToZoom: false,
        }}
      />

      <div className="container" style={{ paddingTop: 16, paddingBottom: 4 }}>
        <Breadcrumb crumbs={crumbs} />
      </div>

      <div className="container" style={{ paddingBottom: 80 }}>
        <div className="product-page-grid">

          {/* ── Gallery ── */}
          <div className="pg-gallery">
            <div
              className="pg-main-img"
              style={{ cursor: "zoom-in", userSelect: "none", overflow: "hidden" }}
              onClick={openLightbox}
              onTouchStart={swipe.onTouchStart}
              onTouchEnd={swipe.onTouchEnd}
            >
              <img
                src={images[imgIdx]}
                alt={p.name}
                key={`${variantIdx}-${imgIdx}`}
                className="pg-img"
                draggable={false}
                style={slideStyle}
              />

              {images.length > 1 && (
                <>
                  <button className="pg-arrow pg-arrow-l" aria-label="Previous image"
                    onClick={e => { e.stopPropagation(); prevImg(); }}>
                    <IChev dir="left" />
                  </button>
                  <button className="pg-arrow pg-arrow-r" aria-label="Next image"
                    onClick={e => { e.stopPropagation(); nextImg(); }}>
                    <IChev dir="right" />
                  </button>
                  <div className="pg-dots">
                    {images.map((_, i) => (
                      <div key={i} className={"pg-dot" + (imgIdx === i ? " on" : "")}
                        onClick={e => { e.stopPropagation(); goTo(i, i > imgIdx ? "left" : "right"); }}
                        role="button" aria-label={`Image ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}

              {hasDiscount && (
                <div className="pbadge" style={{ top: 14, left: 14, background: "#ef4444" }}>
                  -{discountPct}%
                </div>
              )}
              {p.badge && !hasDiscount && (
                <div className="pbadge" style={{ top: 14, left: 14 }}>{p.badge}</div>
              )}
              <div className="pg-zoom-hint">🔍 Tap to zoom</div>
            </div>

            {images.length > 1 && (
              <div className="pg-thumbs">
                {images.map((img, i) => (
                  <div key={i} className={"pg-thumb" + (imgIdx === i ? " on" : "")}
                    onClick={() => goTo(i, i > imgIdx ? "left" : "right")}
                    role="button" aria-label={`View image ${i + 1}`}>
                    <img src={img} alt="" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div className="pg-info">
            <div style={{ fontSize: ".64rem", fontWeight: 800, color: "#F4C430", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 8 }}>
              {p.brand} · {p.sport || "Padel"}
            </div>

            <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 800, letterSpacing: "-.025em", lineHeight: 1.05, marginBottom: 14 }}>
              {p.name}
            </h1>

            {/* Price */}
            <div style={{ marginBottom: 22, display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
              {hasDiscount && (
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.25rem", fontWeight: 400, color: "rgba(255,255,255,.3)", textDecoration: "line-through" }}>
                  {p.price?.toLocaleString()} EGP
                </span>
              )}
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "2rem", fontWeight: 800, color: hasDiscount ? "#F4C430" : "#F2F2F2" }}>
                {displayPrice?.toLocaleString()}
                <span style={{ fontSize: "1rem", color: "rgba(255,255,255,.35)", fontWeight: 400, marginLeft: 6 }}>EGP</span>
              </span>
              {hasDiscount && (
                <span style={{ background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.3)", color: "#ef4444", fontSize: ".7rem", fontWeight: 800, padding: "4px 10px", borderRadius: 100, letterSpacing: ".06em" }}>
                  SAVE {discountPct}%
                </span>
              )}
            </div>

            {p.desc && (
              <p style={{ fontSize: ".88rem", color: "rgba(255,255,255,.55)", lineHeight: 1.78, marginBottom: 24 }}>
                {p.desc}
              </p>
            )}

            {/* Color picker */}
            {variants.length > 1 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: ".68rem", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(255,255,255,.45)", marginBottom: 10 }}>
                  Color — <span style={{ color: "#F2F2F2", textTransform: "none", fontWeight: 600 }}>{variant.color}</span>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {variants.map((v, i) => (
                    <button key={i} onClick={() => switchVariant(i)}
                      aria-label={`Select color ${v.color}`} aria-pressed={variantIdx === i} title={v.color}
                      style={{
                        width: 32, height: 32, borderRadius: "50%",
                        background: v.colorHex || "#888",
                        border: variantIdx === i ? "3px solid #F4C430" : "2px solid rgba(255,255,255,.2)",
                        cursor: "pointer",
                        boxShadow: variantIdx === i ? "0 0 0 2px rgba(244,196,48,.3)" : "none",
                        transition: "all .18s", flexShrink: 0,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size picker */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ fontSize: ".68rem", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: err && !size ? "#f87171" : "rgba(255,255,255,.45)" }}>
                  {err && !size ? "⚠ Pick a size first" : "Select Size"}
                </div>
                {sizes.length > 0 && (
                  <button
                    onClick={() => setSizeGuide(true)}
                    style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,.4)", fontSize: ".68rem", fontWeight: 700, letterSpacing: ".06em", fontFamily: "'DM Sans',sans-serif", padding: 0, transition: "color .2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#F4C430"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.4)"}
                    aria-label="Open size chart"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    Size Chart
                  </button>
                )}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }} role="group" aria-label="Size selection">
                {sizes.length > 0 ? sizes.map(s => (
                  <button key={s} className={"sbtn" + (size === s ? " on" : "")}
                    onClick={() => { setSize(s); setErr(false); }}
                    aria-pressed={size === s} aria-label={`Size ${s}`}>
                    {s}
                  </button>
                )) : (
                  <button className="sbtn on" onClick={() => setSize("One Size")}>One Size</button>
                )}
              </div>
            </div>

            {/* ── Size Chart Modal ── */}
            {sizeGuide && (
              <div
                onClick={() => setSizeGuide(false)}
                style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,.82)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
              >
                <div
                  onClick={e => e.stopPropagation()}
                  style={{ background: "#111", border: "1px solid rgba(255,255,255,.1)", borderRadius: 20, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto", padding: "28px 26px" }}
                >
                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
                    <div>
                      <div style={{ fontSize: ".6rem", fontWeight: 800, letterSpacing: ".18em", color: "#F4C430", textTransform: "uppercase", marginBottom: 4 }}>HamedoSport</div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.4rem", fontWeight: 800 }}>Size Chart</div>
                    </div>
                    <button onClick={() => setSizeGuide(false)} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", color: "#fff", cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                  </div>

                  {/* Measurement diagram */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
                    {[
                      { label: "CHEST WIDTH", arrow: "↔", desc: "Armpit to armpit (laid flat)", color: "#F4C430" },
                      { label: "LENGTH", arrow: "↕", desc: "Shoulder to hem", color: "#60A5FA" },
                    ].map(({ label, arrow, desc, color }) => (
                      <div key={label} style={{ background: "rgba(255,255,255,.04)", border: `1px solid ${color}22`, borderRadius: 12, padding: "14px 14px", textAlign: "center" }}>
                        <div style={{ fontSize: "1.8rem", marginBottom: 6, color }}>{arrow}</div>
                        <div style={{ fontSize: ".65rem", fontWeight: 800, letterSpacing: ".1em", color, marginBottom: 4 }}>{label}</div>
                        <div style={{ fontSize: ".7rem", color: "rgba(255,255,255,.4)", lineHeight: 1.4 }}>{desc}</div>
                      </div>
                    ))}
                  </div>

                  {/* Size table */}
                  <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,.08)", marginBottom: 20 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 1.4fr", background: "#F4C430", padding: "10px 16px" }}>
                      {["SIZE", "CHEST (cm)", "LENGTH (cm)"].map(h => (
                        <div key={h} style={{ fontSize: ".62rem", fontWeight: 800, letterSpacing: ".1em", color: "#000" }}>{h}</div>
                      ))}
                    </div>
                    {[
                      ["S",   "50 – 52", "70 – 72"],
                      ["M",   "53 – 55", "72 – 74"],
                      ["L",   "56 – 58", "74 – 76"],
                      ["XL",  "59 – 61", "76 – 78"],
                      ["XXL", "62 – 64", "78 – 80"],
                      ["3XL", "65 – 67", "80 – 82"],
                    ].map(([sz, chest, len], i) => (
                      <div
                        key={sz}
                        style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 1.4fr", padding: "11px 16px", background: i % 2 === 0 ? "rgba(255,255,255,.03)" : "transparent", borderTop: "1px solid rgba(255,255,255,.05)",
                          ...(size === sz ? { background: "rgba(244,196,48,.08)", borderLeft: "3px solid #F4C430" } : {}) }}
                      >
                        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: ".95rem", color: size === sz ? "#F4C430" : "#F2F2F2" }}>{sz}</div>
                        <div style={{ fontSize: ".85rem", color: "rgba(255,255,255,.7)" }}>{chest} cm</div>
                        <div style={{ fontSize: ".85rem", color: "rgba(255,255,255,.7)" }}>{len} cm</div>
                      </div>
                    ))}
                  </div>

                  {/* Notes */}
                  <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
                    <div style={{ fontSize: ".62rem", fontWeight: 800, letterSpacing: ".12em", color: "#F4C430", marginBottom: 10 }}>📋 NOTES</div>
                    {[
                      "Chest Width = Armpit to Armpit (laid flat)",
                      "Slim / Regular Fit (athletic, not too loose)",
                      "Add 2 cm for Lycra / Dri-Fit fabrics (they stretch)",
                      "When in doubt, it's better to Size Up!",
                    ].map((note, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: i < 3 ? 8 : 0, fontSize: ".78rem", color: "rgba(255,255,255,.55)", lineHeight: 1.5 }}>
                        <span style={{ color: "#F4C430", flexShrink: 0, marginTop: 1 }}>✓</span>
                        <span>{note}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div style={{ background: "rgba(244,196,48,.06)", border: "1px solid rgba(244,196,48,.2)", borderRadius: 10, padding: "12px 16px", textAlign: "center", fontSize: ".8rem", fontWeight: 700, color: "rgba(255,255,255,.55)" }}>
                    🏆 <span style={{ color: "#F4C430" }}>When in Doubt</span> — It's Usually Better to <span style={{ color: "#F4C430" }}>Size Up!</span>
                  </div>
                </div>
              </div>
            )}

            {/* Qty */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
              <div style={{ fontSize: ".68rem", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(255,255,255,.45)" }}>Qty</div>
              <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, overflow: "hidden" }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity"
                  style={{ width: 44, height: 44, background: "transparent", border: "none", color: "#F2F2F2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <IMinus />
                </button>
                <span style={{ width: 38, textAlign: "center", fontWeight: 700, fontSize: "1rem" }} aria-live="polite">{qty}</span>
                <button onClick={() => setQty(qty + 1)} aria-label="Increase quantity"
                  style={{ width: 44, height: 44, background: "transparent", border: "none", color: "#F2F2F2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <IPlus />
                </button>
              </div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.15rem", fontWeight: 800, color: "rgba(255,255,255,.5)" }}>
                = {totalPrice.toLocaleString()} EGP
              </div>
            </div>


            {/* ── Action buttons ── */}
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              {/* Buy Now — primary CTA */}
              <button
                onClick={handleBuyNow}
                aria-label={`Buy ${p.name} now`}
                style={{
                  flex: 2,
                  padding: "15px 20px",
                  background: "#F4C430",
                  border: "none",
                  borderRadius: 14,
                  color: "#000",
                  fontFamily: "'DM Sans',sans-serif",
                  fontWeight: 800,
                  fontSize: ".88rem",
                  letterSpacing: ".1em",
                  cursor: "pointer",
                  transition: "all .2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#e6b800"}
                onMouseLeave={e => e.currentTarget.style.background = "#F4C430"}
              >
                BUY NOW ⚡
              </button>

              {/* Add to Cart — secondary */}
              <button
                className="gbtn"
                onClick={handleAdd}
                aria-label={`Add ${p.name} to cart`}
                style={{ flex: 1, fontSize: ".82rem", letterSpacing: ".06em" }}
              >
                ADD TO CART
              </button>
            </div>

            <button onClick={onBack} aria-label="Back to shop"
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.45)", fontSize: ".78rem", fontWeight: 600, letterSpacing: ".06em", display: "flex", alignItems: "center", gap: 6, fontFamily: "'DM Sans',sans-serif", transition: "color .2s", padding: 0 }}
              onMouseEnter={e => e.currentTarget.style.color = "#F4C430"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.45)"}
            >
              ← Back to shop
            </button>
          </div>
        </div>
      </div>

      {/* ── Related Products ── */}
      <RelatedProducts
        current={p}
        allProducts={allProducts}
        onProductClick={(item, cat) => {
          if (item) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            // Navigate to the clicked product — parent handles routing via onFilterClick pattern
            // We reuse onFilterClick to go back to shop filtered by category,
            // but if a direct product nav handler exists use it.
            // Simplest: dispatch a custom event the App can listen to, or call onBack + filter.
            // Best: expose onProductClick from App — for now trigger onBack then filter.
            onBack && onBack(item);
          } else {
            onFilterClick && onFilterClick((cat || "").toLowerCase());
          }
        }}
      />
    </div>
  );
}