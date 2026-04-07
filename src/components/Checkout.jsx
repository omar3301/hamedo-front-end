// ─────────────────────────────────────────────
//  Checkout — Egypt only, Cash on Delivery
//  27 Egyptian governorates dropdown
// ─────────────────────────────────────────────
import { useState } from "react";
import { IX, ICheck } from "./ui";

const GOVERNORATES = [
  "Cairo","Alexandria","Giza","Qalyubia","Port Said","Suez",
  "Ismailia","Dakahlia","Sharqia","Gharbia","Kafr El Sheikh",
  "Menoufiya","Beheira","Minya","Beni Suef","Fayoum","Asyut",
  "Sohag","Qena","Luxor","Aswan","Red Sea","Matrouh",
  "North Sinai","South Sinai","New Valley","Damietta",
];

export default function Checkout({ items, onClose, onDone }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName:"", lastName:"", address:"", apt:"",
    city:"", governorate:"", phone:"+20",
  });

  const set   = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const isValid = form.firstName && form.lastName && form.address && form.city && form.governorate && form.phone.length > 4;

  if (step === 3) return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ textAlign:"center", padding:"54px 44px" }}>
        <div style={{ width:72,height:72,background:"rgba(34,197,94,.1)",border:"2px solid #22C55E",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",color:"#22C55E",fontSize:"1.8rem" }}>✓</div>
        <div style={{ fontFamily:"'Syne',sans-serif",fontSize:"1.6rem",fontWeight:800,marginBottom:8 }}>Order Placed! 🎉</div>
        <div style={{ color:"rgba(255,255,255,.5)",fontSize:".88rem",marginBottom:6 }}>We'll call <strong style={{ color:"#F2F2F2" }}>{form.phone}</strong> to confirm</div>
        <div style={{ color:"rgba(255,255,255,.32)",fontSize:".8rem",marginBottom:24 }}>{form.address}, {form.city}, {form.governorate}</div>
        <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:"rgba(244,196,48,.1)",border:"1px solid rgba(244,196,48,.25)",borderRadius:100,padding:"8px 20px",fontSize:".78rem",color:"#F4C430",fontWeight:800,letterSpacing:".06em",marginBottom:32 }}>
          💵 {total.toLocaleString()} EGP — Cash on Delivery
          {total >= 1000 && <span style={{ background:"#22C55E",color:"#000",borderRadius:100,padding:"2px 8px",fontSize:".65rem",fontWeight:900 }}>FREE SHIPPING</span>}
        </div>
        <br/>
        <button className="ybtn" style={{ width:"auto",padding:"13px 44px" }} onClick={onDone}>Done</button>
      </div>
    </div>
  );

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ padding:"22px 26px",borderBottom:"1px solid rgba(255,255,255,.07)",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <span style={{ fontFamily:"'Syne',sans-serif",fontWeight:800 }}>{step===1?"Delivery Address":"Review Order"}</span>
          <div style={{ display:"flex",gap:6,alignItems:"center" }}>
            {[1,2].map(s=><div key={s} style={{ width:24,height:3,borderRadius:2,background:step>=s?"#F4C430":"rgba(255,255,255,.1)",transition:"background .3s" }}/>)}
            <button className="icon-btn" onClick={onClose} style={{ marginLeft:10 }}><IX/></button>
          </div>
        </div>

        <div style={{ padding:"26px" }}>
          {step === 1 && (
            <div style={{ display:"flex",flexDirection:"column",gap:0 }}>
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
              <div className="co-field-group">
                <label className="co-label">ADDRESS</label>
                <input className="field" placeholder="Street address" value={form.address} onChange={set("address")}/>
              </div>
              <div className="co-field-group">
                <label className="co-label">APARTMENT / FLOOR (OPTIONAL)</label>
                <input className="field" placeholder="Apt, suite, floor..." value={form.apt} onChange={set("apt")}/>
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
              <div className="co-field-group" style={{ marginBottom:16 }}>
                <label className="co-label">PHONE</label>
                <input className="field" placeholder="+20..." value={form.phone} onChange={set("phone")} type="tel"/>
              </div>
              <div style={{ background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:12,padding:"16px 18px",marginBottom:20 }}>
                <div style={{ fontSize:".72rem",fontWeight:800,letterSpacing:".12em",color:"rgba(255,255,255,.55)",marginBottom:6 }}>CASH ON DELIVERY</div>
                <div style={{ fontSize:".82rem",color:"rgba(255,255,255,.38)",lineHeight:1.65 }}>Our team will contact you to arrange delivery at your convenience. Payment is collected upon arrival.</div>
              </div>
              <button className="ybtn" onClick={()=>setStep(2)} disabled={!isValid} style={{ letterSpacing:".1em" }}>CONTINUE TO REVIEW →</button>
            </div>
          )}

          {step === 2 && (
            <div>
              {items.map((it,i)=>(
                <div key={i} style={{ display:"flex",gap:12,paddingBottom:14,marginBottom:14,borderBottom:"1px solid rgba(255,255,255,.05)" }}>
                  <div style={{ width:54,height:54,borderRadius:9,overflow:"hidden",background:"#1a1a1a",flexShrink:0 }}>
                    <img src={it.images[0]} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",objectPosition:"top center" }} onError={e=>e.target.style.opacity=".1"}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700,fontSize:".88rem" }}>{it.name}</div>
                    <div style={{ fontSize:".72rem",color:"rgba(255,255,255,.35)" }}>{it.color} · Size {it.size} · Qty {it.qty}</div>
                  </div>
                  <div style={{ fontWeight:800,fontFamily:"'Syne',sans-serif" }}>{(it.price*it.qty).toLocaleString()} EGP</div>
                </div>
              ))}
              <div style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,.05)",fontSize:".85rem",marginBottom:4 }}>
                <span style={{ color:"rgba(255,255,255,.45)" }}>Shipping</span>
                {total>=1000?<span style={{ color:"#22C55E",fontWeight:700 }}>FREE 🎉</span>:<span style={{ fontWeight:600 }}>To be confirmed</span>}
              </div>
              <div style={{ display:"flex",justifyContent:"space-between",margin:"16px 0",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.1rem" }}>
                <span>Total</span><span>{total.toLocaleString()} EGP</span>
              </div>
              <div style={{ background:"rgba(255,255,255,.04)",borderRadius:12,padding:"14px 16px",marginBottom:22,fontSize:".84rem",color:"rgba(255,255,255,.45)",lineHeight:1.8 }}>
                <strong style={{ color:"#F2F2F2",display:"block",marginBottom:4 }}>{form.firstName} {form.lastName}</strong>
                📞 {form.phone}<br/>
                📍 {form.address}{form.apt?", "+form.apt:""}<br/>
                {form.city}, {form.governorate}, Egypt
              </div>
              <div style={{ display:"flex",gap:10 }}>
                <button className="gbtn" onClick={()=>setStep(1)}>← Back</button>
                <button className="ybtn" style={{ flex:2 }} onClick={()=>setStep(3)}>Confirm Order ✓</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}