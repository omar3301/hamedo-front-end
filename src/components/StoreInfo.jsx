import { useState, useEffect } from "react";

const API = "https://hamedo-back-end-production-63a0.up.railway.app/api";

const WaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.72A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

export default function StoreInfo() {
  const [waNumber, setWaNumber] = useState("201010886611");

  // Pull WhatsApp number from backend settings
  useEffect(() => {
    // Defer settings fetch until after main content renders (improves LCP)
    const timer = setTimeout(() => {
      fetch(`${API}/settings`)
        .then(r => r.json())
        .then(s => { if (s.whatsapp_number) setWaNumber(s.whatsapp_number); })
        .catch(() => {});
    }, 2000); // wait 2s after mount — user doesn't need WA number immediately
    return () => clearTimeout(timer);
  }, []);

  const waLink   = `https://wa.me/${waNumber}?text=${encodeURIComponent("مرحبا HamedoSport، محتاج مساعدة في اختيار معدات البادل")}`;
  const callLink = `tel:+${waNumber}`;
  const mapsLink = "https://maps.app.goo.gl/HKk3zXd8LvQJNuKz6";

  return (
    <div className="si-wrap container">

      <div className="si-section-label fu">
        <div className="si-label-line"/>
        <span>FIND US</span>
        <div className="si-label-line"/>
      </div>

      {/* ── MAIN CARD ROW ── */}
      <div className="si-top fu d2">

        {/* Left — location card */}
        <div className="si-store-card">
          <div className="si-store-corner"/>
          <div className="si-store-tag">SHOWROOM</div>
          <h2 className="si-store-title">Come<br/>see us</h2>

          {/* Address block */}
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:22 }}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:10, color:"rgba(255,255,255,.55)", fontSize:".85rem", lineHeight:1.6 }}>
              <span style={{ color:"#F4C430", marginTop:2, flexShrink:0 }}><MapPinIcon /></span>
              <span>
                <strong style={{ color:"#F2F2F2", display:"block", marginBottom:2 }}>Khub, Shebin El Kom</strong>
                Menofia Governorate, Egypt
              </span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10, color:"rgba(255,255,255,.55)", fontSize:".85rem" }}>
              <span style={{ color:"#F4C430", flexShrink:0 }}><ClockIcon /></span>
              <span>Sat – Fri &nbsp;·&nbsp; <strong style={{ color:"#F2F2F2" }}>6:00 PM – 12:00 AM</strong></span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10, color:"rgba(255,255,255,.55)", fontSize:".85rem" }}>
              <span style={{ color:"#F4C430", flexShrink:0 }}><PhoneIcon /></span>
              <a href={callLink} style={{ color:"#F2F2F2", textDecoration:"none", fontWeight:600 }}>
                +{waNumber}
              </a>
            </div>
          </div>

          <a className="si-map-btn" href={mapsLink} target="_blank" rel="noreferrer">
            <MapPinIcon /> Open in Google Maps
          </a>
        </div>

        {/* Right — hours + contact */}
        <div className="si-right-panel">
          <div className="si-hours-block">
            <div className="si-block-tag">WE'RE OPEN</div>
            <div className="si-hours-row">
              <div className="si-hours-live">
                <div className="si-live-dot"/>
                Open today
              </div>
              <div className="si-hours-time">Every day</div>
            </div>
            <div className="si-hours-big">6 PM – 12 AM</div>
            <p className="si-hours-note">
              Drop in for a demo, fitting, or same-day pickup on in-stock items.
            </p>
          </div>

          <div className="si-divider"/>

          <div className="si-help-block">
            <div className="si-block-tag">TALK TO US</div>
            <h3 className="si-help-title">Not sure<br/>what to get?</h3>
            <p className="si-help-desc">
              Send us a message — a real player on our team will help you pick the right gear for your level.
            </p>

            {/* WhatsApp + Call buttons */}
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <a className="si-wa-btn" href={waLink} target="_blank" rel="noreferrer">
                <WaIcon />
                WhatsApp Us
              </a>
              <a href={callLink}
                style={{
                  display:"inline-flex", alignItems:"center", gap:9,
                  background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)",
                  borderRadius:11, padding:"11px 20px", color:"rgba(255,255,255,.6)",
                  fontSize:".82rem", fontWeight:700, textDecoration:"none", transition:"all .2s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor="rgba(255,255,255,.25)"}
                onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,.1)"}
              >
                <PhoneIcon />
                +{waNumber}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── TRUST BADGES ── */}
      <div className="si-trust-strip fu d3">
        {[
          { icon:"★", title:"Genuine Gear Only",    desc:"Every product ships direct from official brand distributors in Spain and Europe." },
          { icon:"↩", title:"Change Your Mind?",    desc:"Return or swap anything within 14 days — no awkward questions." },
          { icon:"⬡", title:"6-Month Warranty",     desc:"Every racket and pair of socks carries full manufacturer warranty." },
          { icon:"◉", title:"Played & Tested",      desc:"Our picks aren't just catalogue items — we play with them every week." },
        ].map((t, i) => (
          <div key={i} className="si-trust-card">
            <div className="si-trust-icon">{t.icon}</div>
            <div className="si-trust-title">{t.title}</div>
            <div className="si-trust-desc">{t.desc}</div>
          </div>
        ))}
      </div>

    </div>
  );
}