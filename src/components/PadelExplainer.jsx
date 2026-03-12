// ─────────────────────────────────────────────
//  PadelExplainer — beginner info section
// ─────────────────────────────────────────────

const IMG =
  "https://instagram.fcai20-4.fna.fbcdn.net/v/t51.82787-15/641868119_17856385236669926_4923574850090693181_n.jpg?stp=dst-jpegr_e35_s320x320_tt6&_nc_cat=107&ig_cache_key=Mzg0NjIzMzQzODExNDI5NjA1Mg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5oZHIuQzMifQ%3D%3D&_nc_ohc=a6I1RC4w1uwQ7kNvwFIDT_J&_nc_oc=AdmA4Y34jljRAZsMdNhx63TD1ZZmYb8M3Xc6PWV94fXp8KEaH1PkifZcFzjmjhsSqi0&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fcai20-4.fna&_nc_gid=IFL5wEupGTy03mM0ceGQvw&_nc_ss=8&oh=00_AfwEZ26urvr48GzxDPlaAGK4zjbOneLRJ8m24pSOj2M5VA&oe=69B4D1C3";

export default function PadelExplainer() {
  return (
    <div className="container" style={{ paddingBottom:70 }}>
      <div className="explainer fu">
        {/* Text */}
        <div>
          <div style={{ fontSize:".6rem", fontWeight:800, color:"#F4C430", letterSpacing:".18em", textTransform:"uppercase", marginBottom:10 }}>
            New to Padel?
          </div>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.8rem", fontWeight:800, letterSpacing:"-.02em", lineHeight:1.1 }}>
            The fastest-growing sport in the world 🎾
          </h3>
          <p style={{ fontSize:".85rem", color:"rgba(255,255,255,.42)", lineHeight:1.78, marginTop:12 }}>
            Padel is played on an enclosed glass court — smaller than tennis, very social, and growing fast.
            The official Premier Padel circuit shirts we carry are worn by pros worldwide.
          </p>
          <div className="exp-stats">
            {[["25M+","Players globally"],["90+","Countries"],["#1","Fastest growing"]].map(([n,l]) => (
              <div key={l} style={{ textAlign:"center" }}>
                <div className="exp-num">{n}</div>
                <div className="exp-nl">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Photo */}
        <div style={{ borderRadius:14, overflow:"hidden", height:280 }}>
          <img
            src={IMG}
            alt="Padel shirt"
            style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top center" }}
          />
        </div>
      </div>
    </div>
  );
}
