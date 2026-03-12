// ─────────────────────────────────────────────
//  HAMEDOSPORT — SHARED UI ATOMS
// ─────────────────────────────────────────────

export const LOGO_URL =
  "https://i.ibb.co/cKDd9XNZ/Whats-App-Image-2026-03-09-at-7-40-33-PM.jpg";

/* ── ICONS ── */
export const ICart  = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
export const IX = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
export const IPlus = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
export const IMinus = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
export const ICheck = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
export const IInsta = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
export const IChev = ({ dir = "right" }) => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    style={{ transform: dir === "left" ? "rotate(180deg)" : dir === "down" ? "rotate(90deg)" : "none" }}>
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

/* ── LOGO ── */
export function Logo({ size = 30 }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
      <img
        src={LOGO_URL}
        alt="HamedoSport"
        style={{ width:size, height:size, borderRadius:"50%", objectFit:"cover", border:"1.5px solid rgba(244,196,48,.3)" }}
        onError={e => {
          e.target.style.display = "none";
          e.target.nextSibling.style.display = "flex";
        }}
      />
      <div style={{
        display:"none", width:size, height:size, background:"#F4C430",
        borderRadius:"50%", alignItems:"center", justifyContent:"center",
        fontSize:size*.44+"px", fontFamily:"'Bebas Neue',sans-serif", color:"#000"
      }}>HS</div>
      <span style={{
        fontFamily:"'Syne',sans-serif", fontWeight:800,
        fontSize:size*.48+"px", letterSpacing:"-.02em"
      }}>
        Hamedo<span style={{ color:"#F4C430" }}>Sport</span>
      </span>
    </div>
  );
}

/* ── ICON BUTTON ── */
export function IconBtn({ onClick, children, style = {} }) {
  return (
    <button className="icon-btn" onClick={onClick} style={style}>
      {children}
    </button>
  );
}

/* ── TOAST ── */
import { useEffect } from "react";
export function Toast({ msg, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="toast">
      <ICheck/>{msg}
    </div>
  );
}
