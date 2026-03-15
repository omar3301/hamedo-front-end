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
import { useProducts } from "./context/ProductContext";
import { useCart }     from "./context/CartContext";

const API = import.meta.env.VITE_API_URL;

// ── Hash routing helpers ──────────────────────────────────────────
const getHash     = () => window.location.hash.replace("#", "") || "/";
const setHash     = (p) => window.history.pushState({ path: p }, "", "#" + p);
const replaceHash = (p) => window.history.replaceState({ path: p }, "", "#" + p);

const parseRoute = (hash) => {
  const parts = hash.replace(/^\//, "").split("/").filter(Boolean);
  if (!parts.length)           return { phase: "select",   filter: "all", productId: null };
  if (parts[0] === "shop")     return { phase: "home",     filter: parts[1] || "all", productId: null };
  if (parts[0] === "product")  return { phase: "product",  filter: "all", productId: parts[1] || null };
  if (parts[0] === "checkout") return { phase: "checkout", filter: "all", productId: null };
  return { phase: "select", filter: "all", productId: null };
};

const trackVisit = (page = "home") =>
  fetch(`${API}/visits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ page }),
  }).catch(() => {});

// ─────────────────────────────────────────────────────────────────
export default function App() {
  const { products, productsLoaded, findProduct } = useProducts();
  const { cart, cartOpen, addToCart, removeFromCart, clearCart, openCart, closeCart } = useCart();

  const [phase,      setPhase]      = useState("select");
  const [filter,     setFilter]     = useState("all");
  const [activeProd, setActiveProd] = useState(null);
  const shopRef      = useRef();
  const pendingRoute = useRef(null);

  // Read URL on first load
  useEffect(() => {
    const hash  = getHash();
    const route = parseRoute(hash);
    replaceHash(hash);
    if (route.phase === "product") {
      // Defer until products are loaded
      pendingRoute.current = route;
      setPhase("home");
    } else if (route.phase !== "select") {
      setPhase(route.phase);
      setFilter(route.filter);
    }
  }, []);

  // Resolve pending product route once products load
  useEffect(() => {
    if (!productsLoaded || !pendingRoute.current) return;
    const route = pendingRoute.current;
    pendingRoute.current = null;
    const prod = findProduct(route.productId);
    if (prod) { setActiveProd(prod); setPhase("product"); }
    else       { setPhase("home"); }
  }, [productsLoaded, products]);

  // Handle Android / iOS back button
  useEffect(() => {
    const onPop = () => {
      const route = parseRoute(getHash());
      setPhase(route.phase);
      setFilter(route.filter || "all");
      if (route.phase === "product" && route.productId) {
        const prod = findProduct(route.productId);
        if (prod) setActiveProd(prod);
        else      setPhase("home");
      } else {
        setActiveProd(null);
        window.scrollTo({ top: 0 });
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [products]);

  // ── Navigation helpers ────────────────────────────────────────────
  const goHome = () => {
    setHash("/shop");
    setPhase("home");
    setActiveProd(null);
    setFilter("all");
    window.scrollTo({ top: 0 });
  };

  const handleSelectSport = (cat) => {
    trackVisit(cat);
    setHash(`/shop/${cat}`);
    setFilter(cat);
    setPhase("home");
    setTimeout(() => shopRef.current?.scrollIntoView({ behavior: "smooth" }), 150);
  };

  const handleOpenProduct = (product) => {
    const id = product.id || product.slug || product._id;
    setHash(`/product/${id}`);
    setActiveProd(product);
    setPhase("product");
    window.scrollTo({ top: 0 });
  };

  const handleSetFilter = (f) => {
    setHash(`/shop/${f}`);
    setFilter(f);
    if (phase !== "home") {
      setPhase("home");
      setActiveProd(null);
      window.scrollTo({ top: 0 });
    }
  };

  const handleGoCheckout = () => {
    setHash("/checkout");
    closeCart();
    setPhase("checkout");
    window.scrollTo({ top: 0 });
  };

  const handleCheckoutDone = () => {
    clearCart();
    setHash("/shop");
    setPhase("home");
    window.scrollTo({ top: 0 });
  };

  // ── Shared layout pieces ──────────────────────────────────────────
  const navbar = (
    <Navbar
      filter={filter}
      setFilter={handleSetFilter}
      cartCount={cart.length}
      onCartOpen={openCart}
      onLogoClick={goHome}
    />
  );

  const cartDrawer = (
    <CartDrawer
      open={cartOpen}
      items={cart}
      onClose={closeCart}
      onRemove={removeFromCart}
      onCheckout={handleGoCheckout}
    />
  );

  // ── Phases ────────────────────────────────────────────────────────
  if (phase === "select") return <SportSelector onSelect={handleSelectSport} />;

  if (phase === "checkout") return (
    <>
      {navbar}
      <div className="page-body page-anim">
        <Ticker />
        <CheckoutPage items={cart} onBack={goHome} onDone={handleCheckoutDone} />
        <Footer />
      </div>
      {cartDrawer}
    </>
  );

  if (phase === "product" && activeProd) return (
    <>
      {navbar}
      <div key={activeProd.id || activeProd._id} className="page-body page-anim">
        <Ticker />
        <ProductPage
          product={activeProd}
          onBack={goHome}
          onAdd={addToCart}
          onFilterClick={handleSetFilter}
        />
        <Footer />
      </div>
      {cartDrawer}
    </>
  );

  return (
    <>
      {navbar}
      <div className="page-body page-anim">
        <Ticker />
        <Hero
          onShop={() => shopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          onFilter={handleSetFilter}
        />
        <ProductGrid
          products={products}
          productsLoaded={productsLoaded}
          filter={filter}
          setFilter={handleSetFilter}
          onProductClick={handleOpenProduct}
          shopRef={shopRef}
        />
        <StoreInfo />
        <Footer />
      </div>
      {cartDrawer}
    </>
  );
}
