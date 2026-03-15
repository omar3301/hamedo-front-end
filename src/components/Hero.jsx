// Hero — Padel focused
//
// ⚠️  IMPORTANT: Instagram CDN URLs expire and hurt performance + Best Practices score.
//     These are now replaced with the Cloudinary product images already in your database.
//     To use your own hero photos: upload them via the admin panel → copy the Cloudinary URLs
//     and paste them into HERO_IMGS below.
//
const HERO_IMGS = [
  // First image = LCP element — must be fast. Using a Cloudinary product image.
  "https://res.cloudinary.com/dsbnexvia/image/upload/f_auto,q_auto,w_800/v1773322480/black_shirt_nox_exeugt.jpg",
  "https://res.cloudinary.com/dsbnexvia/image/upload/f_auto,q_auto,w_600/v1773322480/white_shirt_nox_17bhjd.jpg",
  "https://res.cloudinary.com/dsbnexvia/image/upload/f_auto,q_auto,w_500/v1773321610/white_shirt_cupra_zdkqvb.jpg",
];

// onFilter(category) → sets filter
// onShop()          → scrolls to grid
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
              <button key={cat} className="hero-cat-btn" onClick={() => handleCat(cat)}
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

        <div className="hero-photos">
          {/* First image — LCP element. fetchpriority=high + eager loading */}
          <div className="hcard fu d3" style={{ width: "57%", height: 320, top: 0, right: 0 }}>
            <img
              src={HERO_IMGS[0]}
              alt="Nox padel jersey — official kit"
              fetchpriority="high"
              loading="eager"
              decoding="sync"
              width="456"
              height="320"
            />
          </div>
          {/* Second + third images — lazy load, not critical */}
          <div className="hcard fu d4" style={{ width: "52%", height: 270, bottom: 0, left: 0 }}>
            <img
              src={HERO_IMGS[1]}
              alt="Nox white padel shirt"
              loading="lazy"
              decoding="async"
              width="416"
              height="270"
            />
          </div>
          <div className="hcard fu d5" style={{ width: "44%", height: 210, bottom: 50, right: "5%" }}>
            <img
              src={HERO_IMGS[2]}
              alt="Cupra padel training shirt"
              loading="lazy"
              decoding="async"
              width="352"
              height="210"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
