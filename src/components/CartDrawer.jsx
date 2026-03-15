// ─────────────────────────────────────────────
//  CartDrawer — slide-in cart
// ─────────────────────────────────────────────
import { IX } from "./ui";

export default function CartDrawer({ open, items, onClose, onRemove, onCheckout }) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <>
      {open && <div className="dback" onClick={onClose} />}
      <div className={"drawer" + (open ? " open" : "")} role="dialog" aria-modal="true" aria-label="Shopping cart">
        {/* Header */}
        <div style={{ padding:"18px 20px", borderBottom:"1px solid rgba(255,255,255,.07)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1rem" }}>
            Cart <span style={{ color:"#F4C430" }}>({items.length})</span>
          </span>
          <button className="icon-btn" onClick={onClose} aria-label="Close cart"><IX aria-hidden="true" /></button>
        </div>

        {/* Items */}
        <div style={{ flex:1, overflowY:"auto", padding:"14px 20px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign:"center", color:"rgba(255,255,255,.55)", padding:"60px 0", fontSize:".88rem" }}>
              Your cart is empty
            </div>
          ) : (
            items.map((it, i) => (
              <div key={i} style={{ display:"flex", gap:10, paddingBottom:14, marginBottom:14, borderBottom:"1px solid rgba(255,255,255,.05)" }}>
                {/* Thumb */}
                <div style={{ width:58, height:58, borderRadius:9, overflow:"hidden", background:"#1a1a1a", flexShrink:0 }}>
                  <img
                    src={it.images[0]}
                    alt={it.name}
                    style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top center" }}
                    onError={e => { e.target.style.opacity=".1"; }}
                  />
                </div>
                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:600, fontSize:".84rem", lineHeight:1.3 }}>{it.name}</div>
                  <div style={{ fontSize:".7rem", color:"rgba(255,255,255,.55)" }}>
                    {it.color} · Size {it.size} · Qty {it.qty}
                  </div>
                  <div style={{ fontWeight:700, fontSize:".9rem", marginTop:3 }}>
                    {(it.price * it.qty).toLocaleString()} EGP
                  </div>
                </div>
                {/* Remove */}
                <button
                  onClick={() => onRemove(i)}
                  style={{ background:"none", border:"none", color:"rgba(255,255,255,.28)", cursor:"pointer", padding:2, alignSelf:"flex-start" }}>
                  <IX />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:"18px 20px", borderTop:"1px solid rgba(255,255,255,.07)" }}>
          {/* COD badge */}
          <div style={{ fontSize:".72rem", color:"rgba(255,255,255,.55)", textAlign:"center", marginBottom:12 }}>
            💵 Cash on Delivery only
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
            <span style={{ color:"rgba(255,255,255,.6)" }}>Total</span>
            <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.15rem" }}>
              {total.toLocaleString()} EGP
            </span>
          </div>
          <button className="ybtn" onClick={onCheckout} disabled={!items.length}>
            Checkout →
          </button>
        </div>
      </div>
    </>
  );
}
