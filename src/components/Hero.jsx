// Hero — Padel focused
// Three lifestyle shots: boy with bag (action), heart NOX girl (close-up love), duo couple (community)
const HERO_IMGS = [
  "https://res.cloudinary.com/dsbnexvia/image/upload/c_scale,w_800/q_auto/f_auto/v1775080622/C0009.00_00_15_29.Still001_qtmoa8.png",
  "https://res.cloudinary.com/dsbnexvia/image/upload/c_scale,w_800/q_auto/f_auto/v1775080764/IMG_5564_yimru5.jpg",
  "https://res.cloudinary.com/dsbnexvia/image/upload/c_scale,w_800/q_auto/f_auto/v1775076523/IMG_5625_nxtbnl.jpg",
];

export default function Hero({ onShop, onFilter }) {

  const handleCat = (cat) => {
    onFilter(cat.toLowerCase());
    setTimeout(() => onShop(), 300);
  };

  return (
    <section className="hero">
      <div className="hero-grid" />
      <div className="hero-glow" />
      <div className="hero-inner">
        <div>
          <div className="hero-eye fu d1">Monufia · Egypt · Official Padel Gear</div>
          <h1 className="hero-h1 fu d2">
            Monufia's<br />
            <span style={{ color: "#F4C430" }}>Official</span><br />
            Padel Store
          </h1>
          <p className="hero-p fu d3">
            Official gear from BullPadel, NOX &amp; Siux —
            rackets, shoes &amp; circuit kits.
            Delivered across Monufia.
          </p>

          <div className="hero-cats fu d4">
            {["Rackets", "Shoes", "Accessories", "Clothes"].map(cat => (
              <button key={cat} className="hero-cat-btn"
                onClick={() => handleCat(cat)}
                aria-label={`Browse ${cat}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="hero-btns fu d5">
            <button className="btn-y" onClick={onShop} aria-label="Shop all products">Shop Now</button>
            <button className="btn-g"
              onClick={() => window.open("https://www.instagram.com/hamedo.sport/", "_blank")}
              aria-label="Visit HamedoSport on Instagram">
              Instagram ↗
            </button>
          </div>
        </div>

        {/* ── Desktop: overlapping stacked cards ── */}
        <div className="hero-photos-desktop">
          <div className="hcard fu d3" style={{ width: "58%", height: 320, top: 0, right: 0 }}>
            <img
              src={HERO_IMGS[0]}
              alt="Padel player with HEAD bag courtside"
              fetchpriority="high"
              loading="eager"
              decoding="sync"
              width="464"
              height="320"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
            />
          </div>
          <div className="hcard fu d4" style={{ width: "52%", height: 260, bottom: 0, left: 0 }}>
            <img
              src={HERO_IMGS[1]}
              alt="Girl making heart shape over NOX shirt"
              loading="lazy"
              decoding="async"
              width="416"
              height="260"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center" }}
            />
          </div>
          <div className="hcard fu d5" style={{ width: "44%", height: 200, bottom: 44, right: "4%" }}>
            <img
              src={HERO_IMGS[2]}
              alt="Padel duo — Siux and orange kits"
              loading="lazy"
              decoding="async"
              width="352"
              height="200"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
            />
          </div>
        </div>

        {/* ── Mobile: 2-photo grid ── */}
        <div className="hero-photos-mobile">
          <div className="hero-mobile-card fu d3">
            <img src={HERO_IMGS[0]} alt="Padel player courtside" loading="eager" fetchpriority="high"
              style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top", display:"block" }} />
          </div>
          <div className="hero-mobile-card fu d4">
            <img src={HERO_IMGS[2]} alt="Padel duo" loading="lazy"
              style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top", display:"block" }} />
          </div>
        </div>

      </div>
    </section>
  );
}