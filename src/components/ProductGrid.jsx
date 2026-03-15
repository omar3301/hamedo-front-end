import { useState, useEffect, useMemo } from "react";
import ProductCard from "./ProductCard";
import { useProducts } from "../context/ProductContext";

const CATS = [
  { id:"all",         label:"All" },
  { id:"rackets",     label:"Rackets" },
  { id:"shoes",       label:"Shoes" },
  { id:"accessories", label:"Accessories" },
  { id:"clothes",     label:"Clothes" },
];

const SORTS = [
  { id:"default",    label:"Featured" },
  { id:"price-asc",  label:"Price ↑" },
  { id:"price-desc", label:"Price ↓" },
  { id:"newest",     label:"Newest" },
];

// Search icon
const ISearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
);

// ── Skeleton card ─────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="pcard" style={{ pointerEvents:"none" }}>
    <div className="pcard-img">
      <div className="skel skel-img" />
    </div>
    <div className="pcard-info">
      <div className="skel skel-line" style={{ width:"40%", height:10, marginBottom:8 }} />
      <div className="skel skel-line" style={{ width:"85%", height:14, marginBottom:6 }} />
      <div className="skel skel-line" style={{ width:"55%", height:10, marginBottom:16 }} />
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div className="skel skel-line" style={{ width:"35%", height:16 }} />
        <div className="skel skel-circle" />
      </div>
    </div>
  </div>
);

export default function ProductGrid({ products=[], productsLoaded=false, filter, setFilter, onProductClick, shopRef }) {
  const { apiError } = useProducts();
  const [search,  setSearch]  = useState("");
  const [brand,   setBrand]   = useState("all");
  const [sort,    setSort]    = useState("default");
  const [fading,  setFading]  = useState(false);
  const [visible, setVisible] = useState([]);

  // Extract unique brands from products
  const brands = useMemo(() => {
    const b = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();
    return b;
  }, [products]);

  const filterFn = (p) => {
    // Category filter
    if (filter !== "all") {
      const cat = (p.category||"").toLowerCase();
      const f   = filter.toLowerCase();
      if (!cat.includes(f) && p.sport !== f) return false;
    }
    // Brand filter
    if (brand !== "all" && p.brand !== brand) return false;
    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      const haystack = `${p.name} ${p.brand} ${p.category} ${p.sport} ${p.color}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  };

  const sortFn = (a, b) => {
    const priceA = (a.discountActive && a.discountPrice) ? a.discountPrice : a.price;
    const priceB = (b.discountActive && b.discountPrice) ? b.discountPrice : b.price;
    if (sort === "price-asc")  return priceA - priceB;
    if (sort === "price-desc") return priceB - priceA;
    if (sort === "newest")     return new Date(b.createdAt||0) - new Date(a.createdAt||0);
    return (a.sortOrder||0) - (b.sortOrder||0);
  };

  // Fade out → swap → fade in on any filter change
  useEffect(() => {
    setFading(true);
    const t = setTimeout(() => {
      setVisible(products.filter(filterFn).sort(sortFn));
      setFading(false);
    }, 220);
    return () => clearTimeout(t);
  }, [filter, brand, search, sort, products]);

  const activeLabel = CATS.find(c=>c.id===filter)?.label || "All";

  return (
    <div ref={shopRef} className="container" style={{ paddingTop:56, paddingBottom:80 }}>

      {/* ── Header row ── */}
      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between",
                    flexWrap:"wrap", gap:14, marginBottom:22 }}>
        <div>
          <div style={{ fontSize:".58rem", fontWeight:800, color:"#F4C430",
                        letterSpacing:".18em", textTransform:"uppercase", marginBottom:5 }}>
            Padel Collection
          </div>
          <h2 className="fu d1" style={{ fontFamily:"'Syne',sans-serif",
                 fontSize:"clamp(1.6rem,3.5vw,2.6rem)", fontWeight:800, letterSpacing:"-.02em" }}>
            {activeLabel==="All" ? "All Gear" : activeLabel}{" "}
            <span style={{ color:"#F4C430" }}>→</span>
          </h2>
        </div>
        {/* Category pills */}
        <div className="filter-row">
          {CATS.map(c => (
            <button key={c.id} className={"fbtn"+(filter===c.id?" on":"")}
              onClick={()=>{ setFilter(c.id); setBrand("all"); setSearch(""); }}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Search + Brand + Sort bar ── */}
      <div className="grid-toolbar">
        {/* Search */}
        <div className="grid-search-wrap">
          <ISearch />
          <input
            className="grid-search"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={()=>setSearch("")}
              style={{ background:"none", border:"none", color:"rgba(255,255,255,.35)",
                       cursor:"pointer", padding:"0 4px", fontSize:"1rem", lineHeight:1 }}>
              ×
            </button>
          )}
        </div>

        {/* Brand filter */}
        {brands.length > 0 && (
          <select className="grid-select" value={brand} onChange={e=>setBrand(e.target.value)}>
            <option value="all">All Brands</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        )}

        {/* Sort */}
        <select className="grid-select" value={sort} onChange={e=>setSort(e.target.value)}>
          {SORTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      {/* ── Result count ── */}
      {(search || brand!=="all") && (
        <div style={{ fontSize:".72rem", color:"rgba(255,255,255,.3)", marginBottom:16, marginTop:-4 }}>
          {visible.length} result{visible.length!==1?"s":""}
          {search ? ` for "${search}"` : ""}
          {brand!=="all" ? ` · ${brand}` : ""}
        </div>
      )}

      {/* ── Grid ── */}
      {!productsLoaded ? (
        // Skeleton placeholders while API loads
        <div className="pgrid">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className={"pgrid"+(fading?" switching":"")}>
          {visible.map(p => (
            <ProductCard key={p.id||p._id} product={p} onClick={onProductClick} />
          ))}
          {visible.length===0 && (
            <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"60px 20px" }}>
              {apiError ? (
                <div style={{ display:"inline-flex", flexDirection:"column", alignItems:"center", gap:14 }}>
                  <span style={{ fontSize:"2.2rem" }}>🔌</span>
                  <p style={{ color:"rgba(255,255,255,.55)", fontSize:".95rem", fontWeight:600, margin:0 }}>
                    Can't connect to the store right now
                  </p>
                  <p style={{ color:"rgba(255,255,255,.28)", fontSize:".78rem", margin:0, maxWidth:280 }}>
                    The server may be starting up. Please wait a moment and refresh.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    style={{ marginTop:4, padding:"9px 22px", background:"rgba(244,196,48,.12)", border:"1px solid rgba(244,196,48,.3)", borderRadius:8, color:"#F4C430", fontSize:".8rem", fontWeight:700, cursor:"pointer", letterSpacing:".06em" }}
                  >
                    ↻ Retry
                  </button>
                </div>
              ) : (
                <p style={{ color:"rgba(255,255,255,.22)", fontSize:".9rem", margin:0 }}>
                  {search ? `No results for "${search}"` : "No products in this category yet."}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}