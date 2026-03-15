export default function SkeletonCard() {
  return (
    <div style={{
      background: "#161616", borderRadius: "12px", overflow: "hidden",
      display: "flex", flexDirection: "column",
    }}>
      {/* image placeholder */}
      <div className="img-shimmer" style={{ width: "100%", paddingBottom: "100%", position: "relative" }} />
      {/* text placeholders */}
      <div style={{ padding: "14px 12px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <div className="img-shimmer" style={{ height: "12px", borderRadius: "6px", width: "60%" }} />
        <div className="img-shimmer" style={{ height: "14px", borderRadius: "6px", width: "80%" }} />
        <div className="img-shimmer" style={{ height: "14px", borderRadius: "6px", width: "40%" }} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
      gap: "12px",
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
