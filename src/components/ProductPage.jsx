import { useState, useRef, useCallback } from "react";
import { IPlus, IMinus, IChev, IX } from "./ui";
import Breadcrumb from "./Breadcrumb";

// ── Zoom Lightbox ─────────────────────────────────────────────────
function ZoomLightbox({ images, startIdx, onClose }) {
  const [idx, setIdx]      = useState(startIdx);
  const [scale, setScale]  = useState(1);
  const [pos, setPos]      = useState({ x:0, y:0 });
  const touchRef           = useRef({});
  const imgRef             = useRef();

  const prev = () => { setIdx(i=>(i-1+images.length)%images.length); setScale(1); setPos({x:0,y:0}); };
  const next = () => { setIdx(i=>(i+1)%images.length); setScale(1); setPos({x:0,y:0}); };

  // Double-tap / double-click to zoom
  const lastTap = useRef(0);
  const handleImgTap = (e) => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      setScale(s => s===1 ? 2.5 : 1);
      setPos({x:0,y:0});
    }
    lastTap.current = now;
  };

  // Pinch zoom
  const onTouchStart = (e) => {
    if (e.touches.length===2) {
      touchRef.current.pinchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchRef.current.pinchScale = scale;
    }
  };
  const onTouchMove = (e) => {
    if (e.touches.length===2) {
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const newScale = Math.min(4, Math.max(1, touchRef.current.pinchScale * (dist / touchRef.current.pinchDist)));
      setScale(newScale);
    }
  };

  return (
    <div className="zoom-overlay" onClick={e=>e.target===e.currentTarget && onClose()}>
      <button className="zoom-close" onClick={onClose}><IX /></button>

      <div className="zoom-img-wrap"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onClick={handleImgTap}
        style={{ touchAction: scale>1 ? "none" : "manipulation" }}
      >
        <img ref={imgRef} src={images[idx]} alt=""
          style={{
            transform: `scale(${scale}) translate(${pos.x/scale}px,${pos.y/scale}px)`,
            transition: scale===1 ? "transform .3s ease" : "none",
          }}
          draggable={false}
        />
      </div>

      {images.length>1 && (
        <>
          <button className="zoom-arrow zoom-arrow-l" onClick={prev}><IChev dir="left" /></button>
          <button className="zoom-arrow zoom-arrow-r" onClick={next}><IChev dir="right" /></button>
          <div className="zoom-dots">
            {images.map((_,i)=>(
              <div key={i} className={"zoom-dot"+(i===idx?" on":"")} onClick={()=>{setIdx(i);setScale(1);setPos({x:0,y:0});}} />
            ))}
          </div>
        </>
      )}

      <div className="zoom-hint">Double-tap to zoom · Pinch to zoom</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
export default function ProductPage({ product: p, onBack, onAdd, onFilterClick }) {
  const variants = p.variants?.length
    ? p.variants.filter(v=>v.active!==false)
    : [{ color:p.color, colorHex:p.colorHex, images:p.images, sizes:p.sizes?.map(s=>({label:s}))||[] }];

  const [variantIdx, setVariantIdx] = useState(0);
  const [imgIdx,     setImgIdx]     = useState(0);
  const [size,       setSize]       = useState(null);
  const [qty,        setQty]        = useState(1);
  const [err,        setErr]        = useState(false);
  const [zoomOpen,   setZoomOpen]   = useState(false);

  const variant = variants[variantIdx];
  const images  = variant?.images || p.images || [];
  const sizes   = (variant?.sizes||[]).map(s=>typeof s==="string"?s:s.label);

  const switchVariant = (i) => { setVariantIdx(i); setImgIdx(0); setSize(null); setErr(false); };
  const prevImg = () => setImgIdx(i=>(i-1+images.length)%images.length);
  const nextImg = () => setImgIdx(i=>(i+1)%images.length);

  const hasDiscount  = p.discountActive && p.discountPrice && p.discountPrice < p.price;
  const displayPrice = hasDiscount ? p.discountPrice : p.price;
  const discountPct  = hasDiscount ? Math.round((1-p.discountPrice/p.price)*100) : 0;

  const handleAdd = () => {
    if (!size) { setErr(true); return; }
    onAdd({ ...p, color:variant.color, colorHex:variant.colorHex, images }, size, qty);
  };

  // Breadcrumb: clicking category goes to that filter
  const crumbs = [
    { label:"Home",    onClick: onBack },
    { label: p.sport ? p.sport[0].toUpperCase()+p.sport.slice(1) : "Padel", onClick: onBack },
    { label: p.category||"", onClick: p.category ? ()=>onFilterClick((p.category||"").toLowerCase()) : null },
    { label: p.name },
  ];

  const totalPrice = (displayPrice||0) * qty;

  return (
    <div style={{ minHeight:"100vh", background:"#080808" }}>
      {zoomOpen && <ZoomLightbox images={images} startIdx={imgIdx} onClose={()=>setZoomOpen(false)} />}

      <div className="container" style={{ paddingTop:16, paddingBottom:4 }}>
        <Breadcrumb crumbs={crumbs} />
      </div>

      <div className="container" style={{ paddingBottom:80 }}>
        <div className="product-page-grid">

          {/* ── Gallery ── */}
          <div className="pg-gallery">
            <div className="pg-main-img" style={{ cursor:"zoom-in" }} onClick={()=>setZoomOpen(true)}>
              <img
                src={images[imgIdx]} alt={p.name}
                key={`${variantIdx}-${imgIdx}`}
                className="pg-img fi"
              />
              {images.length>1 && (
                <>
                  <button className="pg-arrow pg-arrow-l" onClick={e=>{e.stopPropagation();prevImg();}}><IChev dir="left"/></button>
                  <button className="pg-arrow pg-arrow-r" onClick={e=>{e.stopPropagation();nextImg();}}><IChev dir="right"/></button>
                  <div className="pg-dots">
                    {images.map((_,i)=>(
                      <div key={i} className={"pg-dot"+(imgIdx===i?" on":"")} onClick={e=>{e.stopPropagation();setImgIdx(i);}} />
                    ))}
                  </div>
                </>
              )}
              {hasDiscount && (
                <div className="pbadge" style={{ top:14, left:14, background:"#ef4444" }}>-{discountPct}%</div>
              )}
              {p.badge && !hasDiscount && <div className="pbadge" style={{ top:14, left:14 }}>{p.badge}</div>}

              {/* Zoom hint */}
              <div className="pg-zoom-hint">🔍 Tap to zoom</div>
            </div>

            {images.length>1 && (
              <div className="pg-thumbs">
                {images.map((img,i)=>(
                  <div key={i} className={"pg-thumb"+(imgIdx===i?" on":"")} onClick={()=>setImgIdx(i)}>
                    <img src={img} alt="" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div className="pg-info">
            <div style={{ fontSize:".64rem", fontWeight:800, color:"#F4C430", letterSpacing:".16em", textTransform:"uppercase", marginBottom:8 }}>
              {p.brand} · {p.sport||"Padel"}
            </div>

            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.8rem,3.5vw,2.8rem)", fontWeight:800, letterSpacing:"-.025em", lineHeight:1.05, marginBottom:14 }}>
              {p.name}
            </h1>

            {/* Price block */}
            <div style={{ marginBottom:22, display:"flex", alignItems:"baseline", gap:12, flexWrap:"wrap" }}>
              {hasDiscount && (
                <span style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.25rem", fontWeight:400,
                                color:"rgba(255,255,255,.3)", textDecoration:"line-through" }}>
                  {p.price?.toLocaleString()} EGP
                </span>
              )}
              <span style={{ fontFamily:"'Syne',sans-serif", fontSize:"2rem", fontWeight:800,
                              color: hasDiscount?"#F4C430":"#F2F2F2" }}>
                {displayPrice?.toLocaleString()}
                <span style={{ fontSize:"1rem", color:"rgba(255,255,255,.35)", fontWeight:400, marginLeft:6 }}>EGP</span>
              </span>
              {hasDiscount && (
                <span style={{ background:"rgba(239,68,68,.15)", border:"1px solid rgba(239,68,68,.3)",
                                color:"#ef4444", fontSize:".7rem", fontWeight:800, padding:"4px 10px",
                                borderRadius:100, letterSpacing:".06em" }}>
                  SAVE {discountPct}%
                </span>
              )}
            </div>

            {p.desc && (
              <p style={{ fontSize:".88rem", color:"rgba(255,255,255,.45)", lineHeight:1.78, marginBottom:24 }}>
                {p.desc}
              </p>
            )}

            {/* Color picker */}
            {variants.length>1 && (
              <div style={{ marginBottom:24 }}>
                <div style={{ fontSize:".68rem", fontWeight:800, letterSpacing:".12em", textTransform:"uppercase", color:"rgba(255,255,255,.35)", marginBottom:10 }}>
                  Color — <span style={{ color:"#F2F2F2", textTransform:"none", fontWeight:600 }}>{variant.color}</span>
                </div>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  {variants.map((v,i)=>(
                    <button key={i} onClick={()=>switchVariant(i)} title={v.color}
                      style={{
                        width:32, height:32, borderRadius:"50%",
                        background:v.colorHex||"#888",
                        border:variantIdx===i?"3px solid #F4C430":"2px solid rgba(255,255,255,.2)",
                        cursor:"pointer",
                        boxShadow:variantIdx===i?"0 0 0 2px rgba(244,196,48,.3)":"none",
                        transition:"all .18s", flexShrink:0,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size picker */}
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:".68rem", fontWeight:800, letterSpacing:".12em", textTransform:"uppercase",
                             color:err&&!size?"#f87171":"rgba(255,255,255,.35)", marginBottom:10 }}>
                {err&&!size ? "⚠ Pick a size first" : "Select Size"}
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {sizes.length>0 ? sizes.map(s=>(
                  <button key={s} className={"sbtn"+(size===s?" on":"")} onClick={()=>{setSize(s);setErr(false);}}>
                    {s}
                  </button>
                )) : (
                  <button className="sbtn on" onClick={()=>setSize("One Size")}>One Size</button>
                )}
              </div>
            </div>

            {/* Qty */}
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:28, flexWrap:"wrap" }}>
              <div style={{ fontSize:".68rem", fontWeight:800, letterSpacing:".12em", textTransform:"uppercase", color:"rgba(255,255,255,.35)" }}>Qty</div>
              <div style={{ display:"flex", alignItems:"center", background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:12, overflow:"hidden" }}>
                <button onClick={()=>setQty(Math.max(1,qty-1))} style={{ width:44,height:44,background:"transparent",border:"none",color:"#F2F2F2",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><IMinus/></button>
                <span style={{ width:38,textAlign:"center",fontWeight:700,fontSize:"1rem" }}>{qty}</span>
                <button onClick={()=>setQty(qty+1)} style={{ width:44,height:44,background:"transparent",border:"none",color:"#F2F2F2",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><IPlus/></button>
              </div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.15rem", fontWeight:800, color:"rgba(255,255,255,.5)" }}>
                = {totalPrice.toLocaleString()} EGP
              </div>
            </div>

            <button className="ybtn" onClick={handleAdd} style={{ fontSize:".9rem", letterSpacing:".1em" }}>
              ADD TO CART
            </button>

            <button onClick={onBack}
              style={{ marginTop:18, background:"none", border:"none", cursor:"pointer",
                       color:"rgba(255,255,255,.3)", fontSize:".78rem", fontWeight:600,
                       letterSpacing:".06em", display:"flex", alignItems:"center", gap:6,
                       fontFamily:"'DM Sans',sans-serif", transition:"color .2s", padding:0 }}
              onMouseEnter={e=>e.currentTarget.style.color="#F4C430"}
              onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.3)"}
            >
              ← Back to shop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}