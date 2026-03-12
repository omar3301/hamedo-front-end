export default function Breadcrumb({ crumbs }) {
  return (
    <div className="breadcrumb">
      {crumbs.map((c, i) => (
        <span key={i} style={{ display:"flex", alignItems:"center", gap:5 }}>
          {i > 0 && <span className="sep">›</span>}
          <span
            className={i===crumbs.length-1 ? "active" : (c.onClick ? "crumb-link" : "")}
            onClick={c.onClick || undefined}
            style={{ cursor: c.onClick ? "pointer" : "default" }}
          >
            {c.label}
          </span>
        </span>
      ))}
    </div>
  );
}