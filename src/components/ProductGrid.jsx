// ProductGrid — filters by padel category
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

const CATS = [
  { id: "all",         label: "All" },
  { id: "rackets",     label: "Rackets" },
  { id: "shoes",       label: "Shoes" },
  { id: "accessories", label: "Accessories" },
  { id: "clothes",     label: "Clothes" },
];

export default function ProductGrid({ products = [], filter, setFilter, onProductClick, shopRef }) {
  const [visible, setVisible] = useState([]);
  const [fading,  setFading]  = useState(false);

  const filterFn = (p) => {
    if (filter === "all") return true;
    // Match by category field (case-insensitive) or sport
    const cat = (p.category || "").toLowerCase();
    const f   = filter.toLowerCase();
    return cat.includes(f) || p.sport === f;
  };

  useEffect(() => {
    setFading(true);
    const t = setTimeout(() => {
      setVisible(products.filter(filterFn));
      setFading(false);
    }, 200);
    return () => clearTimeout(t);
  }, [filter, products]);

  const activeLabel = CATS.find(c => c.id === filter)?.label || "All";

  return (
    <div ref={shopRef} className="container" style={{ paddingTop:56, paddingBottom:80 }}>
      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:14, marginBottom:22 }}>
        <div>
          <div style={{ fontSize:".6rem", fontWeight:800, color:"#F4C430", letterSpacing:".18em", textTransform:"uppercase", marginBottom:5 }}>
            Padel Collection
          </div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.6rem,3.5vw,2.6rem)", fontWeight:800, letterSpacing:"-.02em" }} className="fu d1">
            {activeLabel === "All" ? "All Gear" : activeLabel}{" "}
            <span style={{ color:"#F4C430" }}>→</span>
          </h2>
        </div>
        <div className="filter-row">
          {CATS.map(c => (
            <button key={c.id} className={"fbtn" + (filter === c.id ? " on" : "")} onClick={() => setFilter(c.id)}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className={"pgrid" + (fading ? " switching" : "")}>
        {visible.map((p, i) => (
          <div key={p.id || p._id || i} className={"fu d" + Math.min(i + 1, 6)}>
            <ProductCard product={p} onClick={onProductClick} />
          </div>
        ))}
        {visible.length === 0 && (
          <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"60px 0", color:"rgba(255,255,255,.25)", fontSize:".9rem" }}>
            No products in this category yet.
          </div>
        )}
      </div>
    </div>
  );
}