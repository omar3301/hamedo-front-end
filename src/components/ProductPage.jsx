import { useState, useRef, useCallback } from "react";
import { IPlus, IMinus, IChev, IX } from "./ui";
import Breadcrumb from "./Breadcrumb";

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

// ── Zoom Lightbox — with buttons, pan, pinch ──────────────────────────
function ZoomLightbox({ images, startIdx, onClose }) {
  const [idx,      setIdx]      = useState(startIdx);
  const [scale,    setScale]    = useState(1);
  const [pos,      setPos]      = useState({ x: 0, y: 0 });
  const [isDrag,   setIsDrag]   = useState(false);
  const touchRef = useRef({});
  const dragRef  = useRef({});
  const imgRef   = useRef();

  const resetZoom = () => { setScale(1); setPos({ x: 0, y: 0 }); };
  const prev = () => { setIdx(i => (i - 1 + images.length) % images.length); resetZoom(); };
  const next = () => { setIdx(i => (i + 1) % images.length); resetZoom(); };

  const swipe = useSwipe(
    () => scale === 1 && next(),
    () => scale === 1 && prev()
  );

  // Double-tap to zoom
  const lastTap = useRef(0);
  const handleTap = (e) => {
    if (isDrag) return;
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (scale === 1) {
        // Zoom into the tapped point
        const rect = imgRef.current?.getBoundingClientRect();
        if (rect) {
          const cx = (e.clientX - rect.left - rect.width  / 2);
          const cy = (e.clientY - rect.top  - rect.height / 2);
          setPos({ x: -cx * 1.5, y: -cy * 1.5 });
        }
        setScale(2.5);
      } else {
        resetZoom();
      }
    }
    lastTap.current = now;
  };

  // Zoom buttons
  const zoomIn  = () => setScale(s => Math.min(4, parseFloat((s + 0.5).toFixed(1))));
  const zoomOut = () => {
    const next = parseFloat((scale - 0.5).toFixed(1));
    if (next <= 1) { resetZoom(); } else { setScale(next); }
  };

  // Mouse drag to pan when zoomed
  const onMouseDown = (e) => {
    if (scale === 1) return;
    dragRef.current = { active: true, startX: e.clientX - pos.x, startY: e.clientY - pos.y };
    setIsDrag(false);
  };
  const onMouseMove = (e) => {
    if (!dragRef.current.active) return;
    setIsDrag(true);
    setPos({ x: e.clientX - dragRef.current.startX, y: e.clientY - dragRef.current.startY });
  };
  const onMouseUp = () => { dragRef.current.active = false; };

  // Touch pinch
  const onTouchStart = (e) => {
    swipe.onTouchStart(e);
    if (e.touches.length === 2) {
      touchRef.current.pinchDist  = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchRef.current.pinchScale = scale;
    } else if (e.touches.length === 1 && scale > 1) {
      touchRef.current.panStart = { x: e.touches[0].clientX - pos.x, y: e.touches[0].clientY - pos.y };
    }
  };

  const onTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setScale(Math.min(4, Math.max(1, touchRef.current.pinchScale * (dist / touchRef.current.pinchDist))));
    } else if (e.touches.length === 1 && scale > 1 && touchRef.current.panStart) {
      e.preventDefault();
      setPos({
        x: e.touches[0].clientX - touchRef.current.panStart.x,
        y: e.touches[0].clientY - touchRef.current.panStart.y,
      });
    }
  };

  return (
    <div className="zoom-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <button className="zoom-close" onClick={onClose} aria-label="Close zoom"><IX /></button>

      {/* Zoom buttons */}
      <div style={{
        position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: 8, zIndex: 10,
      }}>
        <button onClick={zoomOut} disabled={scale <= 1} aria-label="Zoom out"
          style={{
            width: 40, height: 40, borderRadius: "50%", border: "1px solid rgba(255,255,255,.25)",
            background: "rgba(0,0,0,.7)", color: scale <= 1 ? "rgba(255,255,255,.3)" : "#fff",
            cursor: scale <= 1 ? "not-allowed" : "pointer", fontSize: "1.2rem",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
          −
        </button>
        <div style={{
          padding: "0 14px", borderRadius: 20, border: "1px solid rgba(255,255,255,.2)",
          background: "rgba(0,0,0,.7)", color: "rgba(255,255,255,.7)",
          fontSize: ".75rem", fontWeight: 700, display: "flex", alignItems: "center",
        }}>
          {Math.round(scale * 100)}%
        </div>
        <button onClick={zoomIn} disabled={scale >= 4} aria-label="Zoom in"
          style={{
            width: 40, height: 40, borderRadius: "50%", border: "1px solid rgba(255,255,255,.25)",
            background: "rgba(0,0,0,.7)", color: scale >= 4 ? "rgba(255,255,255,.3)" : "#fff",
            cursor: scale >= 4 ? "not-allowed" : "pointer", fontSize: "1.2rem",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
          +
        </button>
      </div>

      <div
        className="zoom-img-wrap"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={swipe.onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onClick={handleTap}
        style={{
          touchAction: scale > 1 ? "none" : "pan-y",
          cursor: scale > 1 ? (isDrag ? "grabbing" : "grab") : "zoom-in",
          userSelect: "none",
        }}
      >
        <img
          ref={imgRef}
          src={images[idx]}
          alt=""
          draggable={false}
          style={{
            transform:  `scale(${scale}) translate(${pos.x / scale}px, ${pos.y / scale}px)`,
            transition: isDrag ? "none" : "transform .25s cubic-bezier(.4,0,.2,1)",
            maxWidth:   "min(900px, 100%)",
            maxHeight:  "100%",
            objectFit:  "contain",
          }}
        />
      </div>

      {images.length > 1 && (
        <>
          <button className="zoom-arrow zoom-arrow-l" onClick={prev} aria-label="Previous image">
            <IChev dir="left" />
          </button>
          <button className="zoom-arrow zoom-arrow-r" onClick={next} aria-label="Next image">
            <IChev dir="right" />
          </button>
          <div className="zoom-dots">
            {images.map((_, i) => (
              <div key={i} className={"zoom-dot" + (i === idx ? " on" : "")}
                onClick={() => { setIdx(i); resetZoom(); }} />
            ))}
          </div>
        </>
      )}

      <div className="zoom-hint">
        {scale > 1 ? "Drag to pan · Double-tap to reset" : "Double-tap to zoom · Pinch to zoom · Swipe to switch"}
      </div>
    </div>
  );
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
  const slideTimer = useRef(null);

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

  return (
    <div style={{ minHeight: "100vh", background: "#080808" }}>
      {zoomOpen && (
        <ZoomLightbox images={images} startIdx={imgIdx} onClose={() => setZoomOpen(false)} />
      )}

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
              onClick={() => setZoomOpen(true)}
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
