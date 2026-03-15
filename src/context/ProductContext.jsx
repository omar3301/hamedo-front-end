import { createContext, useContext, useState, useEffect } from "react";

const API       = "https://hamedo-back-end-production-63a0.up.railway.app/api";
const CACHE_KEY = "hs_products_v2";
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const normalizeProduct = (p) => ({
  ...p,
  id:             p.slug || p._id,
  variants:       p.variants || [],
  color:          p.variants?.[0]?.color    || p.color    || "",
  colorHex:       p.variants?.[0]?.colorHex || p.colorHex || "#888",
  sizes:          [...new Set(p.variants?.flatMap((v) => v.sizes?.map((s) => (typeof s === "string" ? s : s.label))) || p.sizes || [])],
  images:         p.variants?.[0]?.images?.length ? p.variants[0].images : (p.images || []),
  discountPrice:  p.discountPrice  ?? null,
  discountActive: p.discountActive ?? false,
});

const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) { localStorage.removeItem(CACHE_KEY); return null; }
    return data;
  } catch { return null; }
};

const writeCache = (list) => {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data: list, ts: Date.now() })); } catch {}
};

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products,       setProducts]       = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [apiError,       setApiError]       = useState(false);

  useEffect(() => {
    // Try cache first — instant display
    const cached = readCache();
    if (cached) {
      setProducts(cached.map(normalizeProduct));
      setProductsLoaded(true);
      // Still refresh in background silently
      fetch(`${API}/products`)
        .then((r) => r.ok ? r.json() : Promise.reject())
        .then((data) => {
          const list = Array.isArray(data) ? data : data.products || [];
          if (list.length) { writeCache(list); setProducts(list.map(normalizeProduct)); }
        })
        .catch(() => {});
      return;
    }

    // No cache — fetch and show
    fetch(`${API}/products`)
      .then((r) => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then((data) => {
        const list = Array.isArray(data) ? data : data.products || [];
        writeCache(list);
        setProducts(list.map(normalizeProduct));
        setApiError(false);
        setProductsLoaded(true);
      })
      .catch(() => {
        setProducts([]);
        setApiError(true);
        setProductsLoaded(true);
      });
  }, []);

  const findProduct = (id) =>
    products.find((p) => p.id === id || p.slug === id || p._id === id);

  return (
    <ProductContext.Provider value={{ products, productsLoaded, apiError, findProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used inside <ProductProvider>");
  return ctx;
};
