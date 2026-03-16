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

// ── Product Page ───────────────────────────────────────────────────────
export default function ProductPage({ product: p, onBack, onAdd, onBuyNow, onFilterClick }) {
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
              <div style={{ fontSize: ".68rem", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: err && !size ? "#f87171" : "rgba(255,255,255,.45)", marginBottom: 10 }}>
                {err && !size ? "⚠ Pick a size first" : "Select Size"}
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
    </div>
  );
}