import { useState, useRef, useEffect } from "react";
import "./styles/global.css";
import SportSelector from "./components/SportSelector";
import Navbar        from "./components/Navbar";
import Ticker        from "./components/Ticker";
import Hero          from "./components/Hero";
import ProductGrid   from "./components/ProductGrid";
import ProductPage   from "./components/ProductPage";
import CartDrawer    from "./components/CartDrawer";
import CheckoutPage  from "./pages/CheckoutPage";
import StoreInfo     from "./components/StoreInfo";
import Footer        from "./components/Footer";
import { PRODUCTS }  from "./data/products";

const API = "http://localhost:4000/api";

const normalizeProduct = (p) => ({
  ...p,
  id:             p.slug || p._id,
  variants:       p.variants || [],
  color:          p.variants?.[0]?.color    || p.color    || "",
  colorHex:       p.variants?.[0]?.colorHex || p.colorHex || "#888",
  sizes:          [...new Set(p.variants?.flatMap(v => v.sizes?.map(s => typeof s==="string"?s:s.label))||p.sizes||[])],
  images:         p.variants?.[0]?.images?.length ? p.variants[0].images : (p.images||[]),
  discountPrice:  p.discountPrice  ?? null,
  discountActive: p.discountActive ?? false,
});

// ── hash helpers ──────────────────────────────────────────────────
const getHash     = () => window.location.hash.replace("#","") || "/";
const setHash     = (p) => window.history.pushState({ path:p },"","#"+p);
const replaceHash = (p) => window.history.replaceState({ path:p },"","#"+p);

const parseRoute = (hash) => {
  const parts = hash.replace(/^\//,"").split("/").filter(Boolean);
  if (!parts.length)           return { phase:"select",   filter:"all",           productId:null };
  if (parts[0]==="shop")       return { phase:"home",     filter:parts[1]||"all", productId:null };
  if (parts[0]==="product")    return { phase:"product",  filter:"all",           productId:parts[1]||null };
  if (parts[0]==="checkout")   return { phase:"checkout", filter:"all",           productId:null };
  return { phase:"select", filter:"all", productId:null };
};

const trackVisit = (page="home") =>
  fetch(`${API}/visits`,{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({page}) }).catch(()=>{});

// ─────────────────────────────────────────────────────────────────
export default function App() {
  const [phase,      setPhase]      = useState("select");
  const [filter,     setFilter]     = useState("all");
  const [activeProd, setActiveProd] = useState(null);
  const [cart,       setCart]       = useState([]);
  const [cartOpen,   setCartOpen]   = useState(false);
  const [products,   setProducts]   = useState(PRODUCTS);
  const shopRef = useRef();

  const [productsLoaded, setProductsLoaded] = useState(false);
  const pendingRoute = useRef(null);

  useEffect(() => {
    fetch(`${API}/products`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        if (data?.length) setProducts(data.map(normalizeProduct));
        setProductsLoaded(true);
      })
      .catch(()=>{ setProductsLoaded(true); }); // even on fail, unblock
  }, []);

  // Read URL on first load — save product routes until products are loaded
  useEffect(() => {
    const hash  = getHash();
    const route = parseRoute(hash);
    replaceHash(hash);
    if (route.phase === "product") {
      // Can't resolve yet — save and handle after products load
      pendingRoute.current = route;
      setPhase("home"); // show home as fallback while loading
    } else if (route.phase !== "select") {
      setPhase(route.phase);
      setFilter(route.filter);
    }
  }, []);

  // Once products load, resolve any pending product route
  useEffect(() => {
    if (!productsLoaded || !pendingRoute.current) return;
    const route = pendingRoute.current;
    pendingRoute.current = null;
    const prod = products.find(p => p.id===route.productId || p.slug===route.productId);
    if (prod) { setActiveProd(prod); setPhase("product"); }
    else       { setPhase("home"); }
  }, [productsLoaded, products]);

  // Handle Android / iPhone back button via popstate
  useEffect(() => {
    const onPop = () => {
      const route = parseRoute(getHash());
      setPhase(route.phase);
      setFilter(route.filter || "all");
      if (route.phase==="product" && route.productId) {
        const prod = products.find(p => p.id===route.productId || p.slug===route.productId);
        if (prod) setActiveProd(prod); else setPhase("home");
      } else {
        setActiveProd(null);
        window.scrollTo({top:0});
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [products]);

  // ── Navigation helpers ────────────────────────────────────────────
  const goHome = () => { setHash("/shop"); setPhase("home"); setActiveProd(null); setFilter("all"); window.scrollTo({top:0}); };

  const handleSelectSport = (cat) => {
    trackVisit(cat);
    setHash(`/shop/${cat}`); setFilter(cat); setPhase("home");
    setTimeout(() => shopRef.current?.scrollIntoView({behavior:"smooth"}), 150);
  };

  const handleOpenProduct = (product) => {
    const id = product.id || product.slug || product._id;
    setHash(`/product/${id}`); setActiveProd(product); setPhase("product"); window.scrollTo({top:0});
  };

  const handleSetFilter = (f) => {
    setHash(`/shop/${f}`); setFilter(f);
    if (phase!=="home") { setPhase("home"); setActiveProd(null); window.scrollTo({top:0}); }
  };

  const handleGoCheckout = () => { setHash("/checkout"); setCartOpen(false); setPhase("checkout"); window.scrollTo({top:0}); };

  const handleAddToCart = (product, size, qty) => {
    const cartItem = {
      ...product,
      price:         (product.discountActive && product.discountPrice) ? product.discountPrice : product.price,
      originalPrice: product.price,
      size, qty,
    };
    setCart(c => [...c, cartItem]);
    setCartOpen(true);
  };

  const handleRemoveFromCart = (index) => setCart(c => c.filter((_,i) => i!==index));

  const handleCheckoutDone = () => { setCart([]); setHash("/shop"); setPhase("home"); window.scrollTo({top:0}); };

  // ── Render ─────────────────────────────────────────────────────────
  if (phase==="select") return <SportSelector onSelect={handleSelectSport} />;

  const cartDrawer = (
    <CartDrawer open={cartOpen} items={cart}
      onClose={()=>setCartOpen(false)} onRemove={handleRemoveFromCart} onCheckout={handleGoCheckout} />
  );
  const navbar = (
    <Navbar filter={filter} setFilter={handleSetFilter}
      cartCount={cart.length} onCartOpen={()=>setCartOpen(true)} onLogoClick={goHome} />
  );

  if (phase==="checkout") return (
    <>{navbar}
      <div className="page-body page-anim">
        <Ticker />
        <CheckoutPage items={cart} onBack={goHome} onDone={handleCheckoutDone} />
        <Footer />
      </div>
      {cartDrawer}</>
  );

  if (phase==="product" && activeProd) return (
    <>{navbar}
      <div key={activeProd.id||activeProd._id} className="page-body page-anim">
        <Ticker />
        <ProductPage product={activeProd} onBack={goHome} onAdd={handleAddToCart} onFilterClick={handleSetFilter} />
        <Footer />
      </div>
      {cartDrawer}</>
  );

  return (
    <>{navbar}
      <div className="page-body page-anim">
        <Ticker />
        <Hero
          onShop={() => shopRef.current?.scrollIntoView({ behavior:"smooth", block:"start" })}
          onFilter={handleSetFilter}
        />
        <ProductGrid products={products} productsLoaded={productsLoaded} filter={filter} setFilter={handleSetFilter} onProductClick={handleOpenProduct} shopRef={shopRef} />
        <StoreInfo />
        <Footer />
      </div>
      {cartDrawer}</>
  );
}