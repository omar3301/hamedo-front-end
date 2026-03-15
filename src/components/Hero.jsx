// Hero — Padel focused
// Images use Cloudinary transformations: f_auto (WebP/AVIF), q_auto, exact display dimensions
const HERO_IMGS = [
  // LCP image — 57% of hero width ≈ 456px wide, 320px tall
  "https://res.cloudinary.com/dsbnexvia/image/upload/f_auto,q_auto,w_456,h_320,c_fill/v1773322480/black_shirt_nox_exeugt.jpg",
  // Second card — 52% wide ≈ 416px, 270px tall — using back image (front was 404)
  "https://res.cloudinary.com/dsbnexvia/image/upload/f_auto,q_auto,w_416,h_270,c_fill/v1773322479/back_black_shirt_nox_wvdkwo.jpg",
  // Third card — 44% wide ≈ 352px, 210px tall
  "https://res.cloudinary.com/dsbnexvia/image/upload/f_auto,q_auto,w_352,h_210,c_fill/v1773321610/white_shirt_cupra_zdkqvb.jpg",
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

        <div className="hero-photos">
          {/* LCP — fetchpriority high, explicit dimensions, no lazy */}
          <div className="hcard fu d3" style={{ width: "57%", height: 320, top: 0, right: 0 }}>
            <img
              src={HERO_IMGS[0]}
              alt="HamedoSport — official padel kit"
              fetchpriority="high"
              loading="eager"
              decoding="sync"
              width="456"
              height="320"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div className="hcard fu d4" style={{ width: "52%", height: 270, bottom: 0, left: 0 }}>
            <img
              src={HERO_IMGS[1]}
              alt="Nox padel shirt — back view"
              loading="lazy"
              decoding="async"
              width="416"
              height="270"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div className="hcard fu d5" style={{ width: "44%", height: 210, bottom: 50, right: "5%" }}>
            <img
              src={HERO_IMGS[2]}
              alt="Cupra padel training shirt — white"
              loading="lazy"
              decoding="async"
              width="352"
              height="210"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
