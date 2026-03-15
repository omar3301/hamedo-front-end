import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <SEO title="Page Not Found" />
      <div style={{
        minHeight: "100vh",
        background: "#080808",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        textAlign: "center",
        gap: "20px",
      }}>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(5rem, 20vw, 9rem)",
          fontWeight: 800,
          color: "rgba(244,196,48,0.15)",
          lineHeight: 1,
          letterSpacing: "-0.04em",
        }}>
          404
        </div>

        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(1.4rem, 4vw, 2rem)",
          fontWeight: 800,
          color: "#F2F2F2",
          margin: 0,
          letterSpacing: "-0.02em",
        }}>
          Page not found
        </h1>

        <p style={{
          fontSize: ".9rem",
          color: "rgba(255,255,255,0.38)",
          maxWidth: "320px",
          lineHeight: 1.7,
          margin: 0,
        }}>
          The page you're looking for doesn't exist or was moved.
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginTop: "8px" }}>
          <button
            onClick={() => navigate("/shop")}
            className="ybtn"
            style={{ padding: "13px 32px", fontSize: ".88rem", letterSpacing: ".1em", width: "auto" }}
          >
            GO TO SHOP
          </button>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "13px 24px",
              fontSize: ".88rem",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "12px",
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              letterSpacing: ".06em",
              transition: "all .2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.color = "#F2F2F2"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
          >
            ← Go back
          </button>
        </div>
      </div>
    </>
  );
}
