// CheckoutPage — with delivery method + payment selector
import { useState, useEffect } from "react";

const API = "https://hamedo-back-end-production-63a0.up.railway.app/api";

const GOVERNORATES = [
  "Cairo","Alexandria","Giza","Qalyubia","Port Said","Suez",
  "Ismailia","Dakahlia","Sharqia","Gharbia","Kafr El Sheikh",
  "Monufia","Beheira","Minya","Beni Suef","Fayoum","Asyut",
  "Sohag","Qena","Luxor","Aswan","Red Sea","Matrouh",
  "North Sinai","South Sinai","New Valley","Damietta",
];

const TruckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

export default function CheckoutPage({ items, onBack, onDone }) {
  const [step,        setStep]        = useState(1);
  const [SHIPPING_COST,   setShippingCost]   = useState(70);
  const [FREE_THRESHOLD,  setFreeThreshold]  = useState(1000);

  // Fetch real shipping cost from backend settings
  useEffect(() => {
    fetch(`${API}/settings`)
      .then(r => r.json())
      .then(s => {
        if (s.shipping_cost)       setShippingCost(Number(s.shipping_cost));
        if (s.free_shipping_above) setFreeThreshold(Number(s.free_shipping_above));
      })
      .catch(() => {}); // silent fail — use defaults
  }, []);
  const [submitting,  setSubmitting]  = useState(false);
  const [apiError,    setApiError]    = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [delivery,    setDelivery]    = useState("standard"); // "standard" | "pickup"
  const [form, setForm] = useState({
    firstName:"", lastName:"",
    address:"", apt:"", city:"", governorate:"",
    phone:"",
  });

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const subtotal  = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipCost  = delivery === "pickup" ? 0 : (subtotal >= FREE_THRESHOLD ? 0 : SHIPPING_COST);
  const total     = subtotal + shipCost;
  const freeShip  = subtotal >= FREE_THRESHOLD;

  const isValid = form.firstName && form.lastName && form.phone.length >= 8 &&
    (delivery === "pickup" || (form.address && form.city && form.governorate));

  const confirmOrder = async () => {
    setSubmitting(true); setApiError("");
    try {
      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { firstName: form.firstName, lastName: form.lastName, phone: "+20" + form.phone.replace(/^0/, "") },
          delivery: delivery === "pickup"
            ? { address: "Store Pickup — Khub, Shebin El Kom, Menofia", apt: "", city: "Shebin El Kom", governorate: "Monufia" }
            : { address: form.address, apt: form.apt, city: form.city, governorate: form.governorate },
          items: items.map(i => ({
            productId: i.id || i._id || i.slug, name: i.name, brand: i.brand||"",
            sport: i.sport||"", color: i.color||"", colorHex: i.colorHex||"",
            size: i.size, qty: i.qty, price: i.price, image: i.images?.[0]||"",
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to place order");
      setOrderNumber(data.orderNumber);
      setStep(3);
    } catch (err) {
      if (err.message === "Failed to fetch") {
        setOrderNumber("HS-" + Math.random().toString(36).substring(2,8).toUpperCase());
        setStep(3);
      } else { setApiError(err.message); }
    } finally { setSubmitting(false); }
  };

  // ── Success ─────────────────────────────────────────────────────
  if (step === 3) return (
    <div className="container" style={{ maxWidth:620,paddingTop:60,paddingBottom:100,textAlign:"center" }}>
      <div style={{ width:80,height:80,background:"rgba(34,197,94,.1)",border:"2px solid #22C55E",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 28px",color:"#22C55E",fontSize:"2rem" }}>✓</div>
      <h2 style={{ fontFamily:"'Syne',sans-serif",fontSize:"2rem",fontWeight:800,marginBottom:10 }}>You're all set! 🎾</h2>
      <div style={{ display:"inline-block",background:"rgba(244,196,48,.1)",border:"1px solid rgba(244,196,48,.25)",borderRadius:8,padding:"8px 20px",fontFamily:"monospace",fontSize:"1rem",fontWeight:700,color:"#F4C430",letterSpacing:".1em",marginBottom:18 }}>
        {orderNumber}
      </div>
      <p style={{ color:"rgba(255,255,255,.45)",fontSize:".92rem",marginBottom:6 }}>
        We'll call <strong style={{ color:"#F2F2F2" }}>+20{form.phone}</strong> to confirm
      </p>
      <p style={{ color:"rgba(255,255,255,.32)",fontSize:".84rem",marginBottom:28 }}>
        {delivery === "pickup" ? "📍 Store Pickup — Khub, Shebin El Kom" : `📍 ${form.address}, ${form.city}, ${form.governorate}`}
      </p>
      <div style={{ background:"rgba(244,196,48,.08)",border:"1px solid rgba(244,196,48,.2)",borderRadius:14,padding:"18px 22px",marginBottom:36,textAlign:"left" }}>
        {items.map((it,i)=>(
          <div key={i} style={{ display:"flex",justifyContent:"space-between",padding:"7px 0",fontSize:".88rem",borderBottom:i<items.length-1?"1px solid rgba(255,255,255,.06)":"none" }}>
            <span style={{ color:"rgba(255,255,255,.6)" }}>{it.name} × {it.qty} · {it.size}</span>
            <span style={{ fontWeight:700 }}>{(it.price*it.qty).toLocaleString()} EGP</span>
          </div>
        ))}
        <div style={{ display:"flex",justifyContent:"space-between",marginTop:10,paddingTop:10,borderTop:"1px solid rgba(255,255,255,.1)",fontSize:".85rem",color:"rgba(255,255,255,.45)" }}>
          <span>Shipping</span>
          <span style={{ color:(shipCost===0?"#22C55E":"#F2F2F2"),fontWeight:600 }}>
            {delivery==="pickup" ? "Free (Pickup)" : freeShip ? "FREE 🎉" : `${SHIPPING_COST} EGP`}
          </span>
        </div>
        <div style={{ display:"flex",justifyContent:"space-between",marginTop:8,fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.1rem",color:"#F4C430" }}>
          <span>Total</span><span>{total.toLocaleString()} EGP</span>
        </div>
      </div>
      <button className="ybtn" style={{ width:"auto",padding:"14px 50px" }} onClick={onDone}>Back to Shop</button>
    </div>
  );

  // ── Form ─────────────────────────────────────────────────────────
  return (
    <div className="co-page-grid container" style={{ paddingTop:28,paddingBottom:80 }}>
      <div className="co-left">

        {/* ── STEP 1: Delivery method + address ── */}
        {step === 1 && (
          <>
            {/* Delivery method picker */}
            <div className="co-section-title">How would you like to receive it?</div>
            <div className="co-del-pick">
              <button
                className={"co-del-opt" + (delivery==="standard" ? " active" : "")}
                onClick={() => setDelivery("standard")}
              >
                <div className="co-del-opt-icon"><TruckIcon/></div>
                <div className="co-del-opt-body">
                  <div className="co-del-opt-name">Home Delivery</div>
                  <div className="co-del-opt-sub">3–5 days · Cairo & Giza</div>
                </div>
                <div className="co-del-opt-price">
                  <div className="co-del-opt-amount">{freeShip ? <span style={{color:"#22C55E"}}>FREE</span> : "70 EGP"}</div>
                  {!freeShip && <div className="co-del-opt-free">Free over 1000 EGP</div>}
                </div>
              </button>

              <button
                className={"co-del-opt" + (delivery==="pickup" ? " active" : "")}
                onClick={() => setDelivery("pickup")}
              >
                <div className="co-del-opt-icon"><HomeIcon/></div>
                <div className="co-del-opt-body">
                  <div className="co-del-opt-name">Store Pickup</div>
                  <div className="co-del-opt-sub">Khub · Shebin El Kom · Menofia</div>
                </div>
                <div className="co-del-opt-price">
                  <div className="co-del-opt-amount" style={{color:"#22C55E"}}>Free</div>
                </div>
              </button>
            </div>

            {/* Payment info strip */}
            <div className="co-pay-strip">
              <div className="co-pay-opt co-pay-on">
                <span className="co-pay-icon">💵</span>
                <div>
                  <div className="co-pay-name">Cash on Delivery</div>
                  <div className="co-pay-sub">Pay when your order arrives</div>
                </div>
                <span className="co-pay-badge">✓ Available</span>
              </div>
              <div className="co-pay-opt co-pay-off">
                <span className="co-pay-icon">💳</span>
                <div>
                  <div className="co-pay-name">Card Payment</div>
                  <div className="co-pay-sub">Mastercard · Visa</div>
                </div>
                <span className="co-pay-badge-soon">Coming Soon</span>
              </div>
            </div>

            <div className="co-section-title" style={{marginTop:28}}>Your Details</div>

            <div className="co-row">
              <div className="co-field-group">
                <label className="co-label">FIRST NAME</label>
                <input className="field" placeholder="First name" value={form.firstName} onChange={set("firstName")}/>
              </div>
              <div className="co-field-group">
                <label className="co-label">LAST NAME</label>
                <input className="field" placeholder="Last name" value={form.lastName} onChange={set("lastName")}/>
              </div>
            </div>

            <div className="co-field-group" style={{marginBottom:4}}>
              <label className="co-label">PHONE</label>
              <div style={{ display:"flex",alignItems:"stretch" }}>
                <div style={{ background:"rgba(255,255,255,.06)",border:"1.5px solid rgba(255,255,255,.08)",borderRight:"none",borderRadius:"10px 0 0 10px",padding:"0 14px",fontSize:".88rem",color:"rgba(255,255,255,.6)",display:"flex",alignItems:"center",whiteSpace:"nowrap",flexShrink:0 }}>🇪🇬 +20</div>
                <input className="field" placeholder="1XX XXX XXXX" value={form.phone} onChange={set("phone")} type="tel" style={{ borderRadius:"0 10px 10px 0",borderLeft:"none" }}/>
              </div>
            </div>

            {delivery === "standard" && (
              <>
                <div className="co-field-group">
                  <label className="co-label">STREET ADDRESS</label>
                  <input className="field" placeholder="Street address" value={form.address} onChange={set("address")}/>
                </div>
                <div className="co-field-group">
                  <label className="co-label">APARTMENT / FLOOR (OPTIONAL)</label>
                  <input className="field" placeholder="Apt, floor..." value={form.apt} onChange={set("apt")}/>
                </div>
                <div className="co-row">
                  <div className="co-field-group">
                    <label className="co-label">CITY</label>
                    <input className="field" placeholder="City" value={form.city} onChange={set("city")}/>
                  </div>
                  <div className="co-field-group">
                    <label className="co-label">GOVERNORATE</label>
                    <select className="field co-select" value={form.governorate} onChange={set("governorate")}>
                      <option value="">Select...</option>
                      {GOVERNORATES.map(g=><option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
              </>
            )}

            {delivery === "pickup" && (
              <div style={{ background:"rgba(244,196,48,.06)",border:"1px solid rgba(244,196,48,.18)",borderRadius:12,padding:"16px 18px",marginTop:16,marginBottom:4 }}>
                <div style={{ fontSize:".72rem",fontWeight:800,letterSpacing:".1em",color:"#F4C430",marginBottom:6 }}>PICKUP LOCATION</div>
                <div style={{ fontSize:".88rem",fontWeight:600,marginBottom:4 }}>Khub · Shebin El Kom · Menofia</div>
                <div style={{ fontSize:".78rem",color:"rgba(255,255,255,.38)",marginBottom:12 }}>Sat – Fri · 6:00 PM – 12:00 AM</div>
                <a href="https://maps.app.goo.gl/HKk3zXd8LvQJNuKz6" target="_blank" rel="noreferrer"
                  style={{ fontSize:".75rem",color:"rgba(255,255,255,.5)",textDecoration:"none",fontWeight:600,display:"inline-flex",alignItems:"center",gap:5,border:"1px solid rgba(255,255,255,.12)",borderRadius:7,padding:"5px 12px",transition:"all .2s" }}
                  onMouseEnter={e=>e.currentTarget.style.color="#F4C430"}
                  onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.5)"}
                >
                  📍 Open in Maps
                </a>
              </div>
            )}

            <button className="ybtn" style={{marginTop:20,letterSpacing:".1em"}} onClick={()=>setStep(2)} disabled={!isValid}>
              REVIEW ORDER →
            </button>
          </>
        )}

        {/* ── STEP 2: Review ── */}
        {step === 2 && (
          <>
            <div className="co-section-title">Review Your Order</div>
            <div style={{ background:"rgba(255,255,255,.04)",borderRadius:12,padding:"16px 18px",marginBottom:20,fontSize:".85rem",color:"rgba(255,255,255,.45)",lineHeight:1.85 }}>
              <strong style={{ color:"#F2F2F2",display:"block",marginBottom:4 }}>{form.firstName} {form.lastName}</strong>
              📞 +20{form.phone}<br/>
              {delivery === "pickup"
                ? "📍 Store Pickup — Khub, Shebin El Kom, Menofia"
                : `📍 ${form.address}${form.apt?", "+form.apt:""}, ${form.city}, ${form.governorate}, Egypt`
              }
              <button onClick={()=>setStep(1)} style={{ display:"block",marginTop:8,background:"none",border:"none",color:"#F4C430",fontSize:".76rem",fontWeight:700,cursor:"pointer",padding:0,letterSpacing:".06em",fontFamily:"'DM Sans',sans-serif" }}>
                Edit →
              </button>
            </div>
            {apiError && (
              <div style={{ background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.3)",borderRadius:8,padding:"12px 16px",marginBottom:16,fontSize:".84rem",color:"#F87171" }}>
                ⚠️ {apiError}
              </div>
            )}
            <div style={{ display:"flex",gap:10 }}>
              <button className="gbtn" onClick={()=>setStep(1)} disabled={submitting}>← Back</button>
              <button className="ybtn" style={{ flex:2 }} onClick={confirmOrder} disabled={submitting}>
                {submitting ? "Placing Order…" : "Confirm Order ✓"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── ORDER SUMMARY ── */}
      <div className="co-right">
        <div className="co-section-title">Order Summary</div>
        {items.map((it,i)=>(
          <div key={i} style={{ display:"flex",gap:12,paddingBottom:16,marginBottom:16,borderBottom:"1px solid rgba(255,255,255,.07)" }}>
            <div style={{ width:70,height:70,borderRadius:10,overflow:"hidden",background:"#1a1a1a",flexShrink:0,position:"relative" }}>
              <img src={it.images?.[0]} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",objectPosition:"top center" }} onError={e=>e.target.style.opacity=".1"}/>
              <div style={{ position:"absolute",top:-6,right:-6,width:20,height:20,background:"#F4C430",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".6rem",fontWeight:900,color:"#000" }}>{it.qty}</div>
            </div>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontWeight:700,fontSize:".88rem",lineHeight:1.3 }}>{it.name}</div>
              <div style={{ fontSize:".72rem",color:"rgba(255,255,255,.35)",marginTop:2 }}>{it.color} · Size {it.size}</div>
              <div style={{ fontWeight:800,fontSize:".95rem",marginTop:4,fontFamily:"'Syne',sans-serif" }}>{(it.price*it.qty).toLocaleString()} <span style={{ fontSize:".7rem",color:"rgba(255,255,255,.35)",fontWeight:400 }}>EGP</span></div>
            </div>
          </div>
        ))}
        <div style={{ borderTop:"1px solid rgba(255,255,255,.08)",paddingTop:16 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:".86rem",color:"rgba(255,255,255,.45)" }}>
            <span>Subtotal</span><span>{subtotal.toLocaleString()} EGP</span>
          </div>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:16,fontSize:".86rem" }}>
            <span style={{ color:"rgba(255,255,255,.45)" }}>Shipping</span>
            {delivery === "pickup"
              ? <span style={{ color:"#22C55E",fontWeight:700 }}>Free (Pickup)</span>
              : freeShip
                ? <span style={{ color:"#22C55E",fontWeight:700 }}>FREE 🎉</span>
                : <span style={{ fontWeight:600 }}>{SHIPPING_COST} EGP</span>
            }
          </div>
          {delivery === "standard" && !freeShip && (
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:".7rem",color:"rgba(255,255,255,.3)",marginBottom:6 }}>
                {(FREE_THRESHOLD-subtotal).toLocaleString()} EGP away from free shipping
              </div>
              <div style={{ height:4,background:"rgba(255,255,255,.08)",borderRadius:2,overflow:"hidden" }}>
                <div style={{ height:"100%",background:"#F4C430",borderRadius:2,width:Math.min(subtotal/FREE_THRESHOLD*100,100)+"%" }}/>
              </div>
            </div>
          )}
          <div style={{ display:"flex",justifyContent:"space-between",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.2rem",paddingTop:12,borderTop:"1px solid rgba(255,255,255,.1)" }}>
            <span>Total</span>
            <span style={{ color:"#F4C430" }}>{total.toLocaleString()} EGP</span>
          </div>
        </div>
        <div style={{ marginTop:18,background:"rgba(244,196,48,.08)",border:"1px solid rgba(244,196,48,.18)",borderRadius:10,padding:"12px 14px",display:"flex",alignItems:"center",gap:8,fontSize:".8rem",color:"rgba(255,255,255,.55)" }}>
          💵 <span><strong style={{ color:"#F4C430" }}>Cash on Delivery</strong> — pay on arrival</span>
        </div>
      </div>
    </div>
  );
}