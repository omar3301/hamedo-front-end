// SportSelector — modern splash, high contrast, tech feel
// Background: deep navy-to-black gradient with yellow glow
// NOT black text on black background
import { Logo } from "./ui";

const CATEGORIES = [
  { id: "clothes",     label: "Clothes",     icon: "👕", desc: "Official circuit kits" },
  { id: "accessories", label: "Accessories", icon: "🎒", desc: "Bags · Balls · Grips" },
  { id: "socks",       label: "Socks",       icon: "🧦", desc: "Moisture-wicking" },
  { id: "rackets",     label: "Rackets",     icon: "🥎", desc: "BullPadel · NOX · Head" },
  
];

const TRUST = ["100% Original", "14-Day Returns", "6-Month Warranty", "Free Ship 1000+ EGP"];

export default function SportSelector({ onSelect }) {
  return (
    <div className="sp-root">
      {/* Ambient glow blobs */}
      <div className="sp-blob sp-blob1" />
      <div className="sp-blob sp-blob2" />
      <div className="sp-blob sp-blob3" />

      {/* Dot grid overlay */}
      <div className="sp-dots" />

      <div className="sp-inner fi">

        {/* Logo row — extra top padding on mobile to clear Safari UI chrome */}
        <div className="sp-logo-row" style={{ paddingTop:"env(safe-area-inset-top, 20px)", marginTop: 24 }}>
          <Logo size={30} />
        </div>

        {/* Hero headline */}
        <div className="sp-headline-wrap">
          <div className="sp-kicker">🎾 &nbsp; Egypt's #1 Padel Store</div>
          <h1 className="sp-headline">
            <span className="sp-h-yellow">PADEL</span>
            <span className="sp-h-white"> STORE</span>
          </h1>
          <p className="sp-tagline">Khub · Shebin El Kom · Delivered all over Egypt</p>
        </div>

        {/* Category buttons */}
        <div className="sp-grid">
          {CATEGORIES.map((c, i) => (
            <button
              key={c.id}
              className="sp-card"
              style={{ animationDelay: `${0.08 + i * 0.07}s` }}
              onClick={() => onSelect(c.id)}
            >
              <span className="sp-card-icon">{c.icon}</span>
              <div className="sp-card-text">
                <span className="sp-card-label">{c.label}</span>
                <span className="sp-card-desc">{c.desc}</span>
              </div>
              <span className="sp-card-arrow">→</span>
            </button>
          ))}
        </div>

        {/* Browse all */}
        <button className="sp-all-btn" onClick={() => onSelect("all")}>
          Browse All Products ↓
        </button>

      </div>
    </div>
  );
}