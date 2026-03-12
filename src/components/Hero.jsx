// Hero — Padel focused
const HERO_IMGS = [
  "https://instagram.fcai20-2.fna.fbcdn.net/v/t51.82787-15/641934180_17856384075669926_8671623543778987870_n.jpg?stp=dst-jpegr_e35_p1080x1080_tt6&_nc_cat=105&ig_cache_key=Mzg0NjIzMDA1MjQ2Mzc2ODYyOQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5oZHIuQzMifQ%3D%3D&_nc_ohc=Sk786RH5GtkQ7kNvwF_seLb&_nc_oc=AdlsfbL2bMnW_zBXfdqOxWagoAuIdul1A0qs1KEjweWxvNnwLs556YI8nIVxYd2xwgw&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fcai20-2.fna&_nc_gid=IFL5wEupGTy03mM0ceGQvw&_nc_ss=8&oh=00_AfzIIfHALsykV0SAQn0UVioQ8Xt_FcXJ-py5xtvxFwsFCA&oe=69B4DCC6",
  "https://instagram.fcai20-3.fna.fbcdn.net/v/t51.82787-15/643711772_17856384120669926_3631359958462301821_n.jpg?stp=dst-jpegr_e35_s320x320_tt6&_nc_cat=111&ig_cache_key=Mzg0NjIzMDA3MDM5MDE5OTk0MQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5oZHIuQzMifQ%3D%3D&_nc_ohc=kpuZmDhUOQcQ7kNvwEPVG8Z&_nc_oc=Admjgz6cd4qgj0Qa_0PEADuMhOIHK6ESV6T7PkHZ0IWXXWOzY4mHfdLjK57GKXOPA0M&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fcai20-3.fna&_nc_gid=IFL5wEupGTy03mM0ceGQvw&_nc_ss=8&oh=00_AfyACfhBjL5pwRijlUG8MBI_ShlQza_uO0o73EYEf0zWWQ&oe=69B4C6A6",
  "https://instagram.fcai20-4.fna.fbcdn.net/v/t51.82787-15/641868119_17856385236669926_4923574850090693181_n.jpg?stp=dst-jpegr_e35_s320x320_tt6&_nc_cat=107&ig_cache_key=Mzg0NjIzMzQzODExNDI5NjA1Mg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5oZHIuQzMifQ%3D%3D&_nc_ohc=a6I1RC4w1uwQ7kNvwFIDT_J&_nc_oc=AdmA4Y34jljRAZsMdNhx63TD1ZZmYb8M3Xc6PWV94fXp8KEaH1PkifZcFzjmjhsSqi0&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fcai20-4.fna&_nc_gid=IFL5wEupGTy03mM0ceGQvw&_nc_ss=8&oh=00_AfwEZ26urvr48GzxDPlaAGK4zjbOneLRJ8m24pSOj2M5VA&oe=69B4D1C3",
];

// onFilter(category) → sets filter
// onShop()          → scrolls to grid
export default function Hero({ onShop, onFilter }) {

  const handleCat = (cat) => {
    // 1. set the filter
    onFilter(cat.toLowerCase());
    // 2. scroll to grid — wait a tick so the filter state updates first
    // Use 300ms so animation starts before scroll on mobile too
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
            <span style={{ color:"#F4C430" }}>Official</span><br />
            Padel Store
          </h1>
          <p className="hero-p fu d3">
            Official gear from BullPadel, NOX & Siux —
            rackets, shoes & circuit kits.
            Delivered across Monufia.
          </p>

          {/* Category pills — filter + scroll */}
          <div className="hero-cats fu d4">
            {["Rackets","Shoes","Accessories","Clothes"].map(cat => (
              <button key={cat} className="hero-cat-btn" onClick={() => handleCat(cat)}>
                {cat}
              </button>
            ))}
          </div>

          <div className="hero-btns fu d5">
            <button className="btn-y" onClick={onShop}>Shop Now</button>
            <button className="btn-g" onClick={() => window.open("https://www.instagram.com/hamedo.sport/","_blank")}>
              Instagram ↗
            </button>
          </div>
        </div>

        <div className="hero-photos">
          <div className="hcard fu d3" style={{ width:"57%", height:320, top:0, right:0 }}>
            <img src={HERO_IMGS[0]} alt="" />
          </div>
          <div className="hcard fu d4" style={{ width:"52%", height:270, bottom:0, left:0 }}>
            <img src={HERO_IMGS[1]} alt="" />
          </div>
          <div className="hcard fu d5" style={{ width:"44%", height:210, bottom:50, right:"5%" }}>
            <img src={HERO_IMGS[2]} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}