// ─────────────────────────────────────────────
//  ProductModal — full product detail overlay
// ─────────────────────────────────────────────
import { useState } from "react";
import { IX, IPlus, IMinus } from "./ui";
import Breadcrumb from "./Breadcrumb";

export default function ProductModal({ product: p, onClose, onAdd }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [size,   setSize]   = useState(null);
  const [qty,    setQty]    = useState(1);
  const [err,    setErr]    = useState(false);

  const handleAdd = () => {
    if (!size) { setErr(true); return; }
    onAdd(p, size, qty);
    onClose();
  };

  const crumbs = [
    { label: "Sports" },
    { label: p.sport[0].toUpperCase() + p.sport.slice(1) },
    { label: p.category },
    { label: p.name },
  ];

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        {/* Image area */}
        <div className="modal-imgs">
          <img
            className="main-img"
            src={p.images[imgIdx]}
            alt={p.name}
            onError={e => { e.target.style.opacity=".2"; }}
          />
          {/* Thumbnails (only if multiple images) */}
          {p.images.length > 1 && (
            <div className="modal-thumbs">
              {p.images.map((img, i) => (
                <div
                  key={i}
                  className={"mthumb" + (imgIdx === i ? " on" : "")}
                  onClick={() => setImgIdx(i)}
                >
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-body">
          {/* Breadcrumb */}
          <Breadcrumb crumbs={crumbs} />

          {/* Header */}
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, marginTop:6 }}>
            <div>
              <div style={{ fontSize:".6rem", fontWeight:800, color:"#F4C430", letterSpacing:".14em", marginBottom:4 }}>
                {p.brand} · {p.sport.toUpperCase()}
              </div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.4rem", fontWeight:800 }}>{p.name}</div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:5 }}>
                <div style={{ width:12, height:12, borderRadius:"50%", background:p.colorHex, border:"1.5px solid rgba(255,255,255,.2)" }}/>
                <span style={{ fontSize:".76rem", color:"rgba(255,255,255,.35)" }}>{p.color}</span>
              </div>
            </div>
            <button className="icon-btn" onClick={onClose}><IX /></button>
          </div>

          <p style={{ fontSize:".85rem", color:"rgba(255,255,255,.42)", lineHeight:1.78, margin:"14px 0" }}>
            {p.desc}
          </p>

          {/* Size picker */}
          <div style={{ marginBottom:18 }}>
            <div style={{
              fontSize:".66rem", fontWeight:800, letterSpacing:".1em", textTransform:"uppercase",
              color: err && !size ? "#f87171" : "rgba(255,255,255,.35)", marginBottom:9
            }}>
              {err && !size ? "⚠ Choose a size first" : "Size"}
            </div>
            <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
              {p.sizes.map(s => (
                <button
                  key={s}
                  className={"sbtn" + (size === s ? " on" : "")}
                  onClick={() => { setSize(s); setErr(false); }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Qty + price row */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
            <div style={{ display:"flex", alignItems:"center", background:"rgba(255,255,255,.05)", borderRadius:11, overflow:"hidden" }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))}
                style={{ width:38, height:38, background:"transparent", border:"none", color:"#F2F2F2", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <IMinus />
              </button>
              <span style={{ width:32, textAlign:"center", fontWeight:700 }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)}
                style={{ width:38, height:38, background:"transparent", border:"none", color:"#F2F2F2", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <IPlus />
              </button>
            </div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.5rem", fontWeight:800 }}>
              {(p.price * qty).toLocaleString()}{" "}
              <span style={{ fontSize:".85rem", color:"rgba(255,255,255,.35)", fontWeight:400 }}>EGP</span>
            </div>
          </div>

          {/* COD notice */}
          <div style={{
            background:"rgba(244,196,48,.07)", border:"1px solid rgba(244,196,48,.18)",
            borderRadius:10, padding:"10px 14px",
            fontSize:".78rem", color:"rgba(255,255,255,.55)",
            display:"flex", alignItems:"center", gap:8, marginBottom:14
          }}>
            💵 <span><strong style={{ color:"#F4C430" }}>Cash on Delivery</strong> — pay when it arrives</span>
          </div>

          <button className="ybtn" onClick={handleAdd}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
