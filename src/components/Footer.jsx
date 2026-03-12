// ─────────────────────────────────────────────
//  Footer
// ─────────────────────────────────────────────
import { Logo, IInsta } from "./ui";

export default function Footer() {
  return (
    <div className="footer">
      <div className="footer-inner">
        <Logo size={26} />
        <a
          href="https://www.instagram.com/hamedo.sport/"
          target="_blank"
          rel="noreferrer"
          style={{
            display:"flex", alignItems:"center", gap:6,
            color:"rgba(255,255,255,.35)", fontSize:".8rem",
            textDecoration:"none", fontWeight:600, transition:"color .2s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#F4C430"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.35)"}
        >
          <IInsta />@hamedo.sport
        </a>
        <div style={{ fontSize:".68rem", color:"rgba(255,255,255,.18)" }}>
          Cairo, Egypt · 💵 Cash on Delivery
        </div>
      </div>
    </div>
  );
}
