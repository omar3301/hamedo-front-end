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
          aria-label="HamedoSport on Instagram"
          style={{
            display: "flex", alignItems: "center", gap: 6,
            color: "rgba(255,255,255,.6)",
            fontSize: ".8rem", textDecoration: "none",
            fontWeight: 600, transition: "color .2s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#F4C430"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.6)"}
        >
          <IInsta aria-hidden="true" />@hamedo.sport
        </a>
        <div style={{ fontSize: ".68rem", color: "rgba(255,255,255,.5)" }}>
          Shebin El Kom, Egypt · 💵 Cash on Delivery
        </div>
      </div>

      <div style={{
        borderTop: "1px solid rgba(255,255,255,.06)",
        padding: "12px 24px",
        textAlign: "center",
      }}>
        <span style={{
          fontSize: ".62rem",
          color: "rgba(255,255,255,.45)",
          fontWeight: 500,
          letterSpacing: ".06em",
        }}>
          ⚡ Built by{" "}
          <span style={{
            color: "rgba(255,255,255,.6)",
            fontWeight: 700,
            transition: "color .2s",
            cursor: "default",
          }}
            onMouseEnter={e => e.currentTarget.style.color = "#F4C430"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.6)"}
          >
            Omar Abomosslam
          </span>
        </span>
      </div>
    </div>
  );
}
