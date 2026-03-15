import { useRef, useEffect } from "react";
import { Routes, Route, useNavigate, useParams, useLocation } from "react-router-dom";
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
import SEO           from "./components/SEO";
import { useProducts } from "./context/ProductContext";
import { useCart }     from "./context/CartContext";

const API = "https://hamedo-back-end-production-63a0.up.railway.app/api";

const trackVisit = (page = "home") =>
  fetch(`${API}/visits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ page }),
  }).catch(() => {});

// ── Sport selector page ───────────────────────────────────────────────
function SelectPage() {
  const navigate = useNavigate();
  const handleSelect = (cat) => {
    trackVisit(cat);
    navigate(`/shop/${cat}`);
  };
  return (
    <>
      <SEO />
      <SportSelector onSelect={handleSelect} />
    </>
  );
}

// ── Shop / home page ──────────────────────────────────────────────────
function ShopPage() {
  const navigate   = useNavigate();
  const { filter } = useParams();
  const shopRef    = useRef();
  const { products, productsLoaded } = useProducts();
  const { cart, cartOpen, openCart, closeCart, removeFromCart } = useCart();
  const activeFilter = filter || "all";

  const handleOpenProduct = (product) => {
    const id = product.slug || product._id;
    navigate(`/product/${id}`);
    window.scrollTo({ top: 0 });
  };

  const handleSetFilter = (f) => navigate(`/shop/${f}`);
  const handleGoCheckout = () => { closeCart(); navigate("/checkout"); window.scrollTo({ top: 0 }); };
  const goHome = () => navigate("/shop");

  return (
    <>
      <SEO />
      <Navbar
        filter={activeFilter}
        setFilter={handleSetFilter}
        cartCount={cart.length}
        onCartOpen={openCart}
        onLogoClick={goHome}
      />
      <main id="main-content" className="page-body page-anim">
        <Ticker />
        <Hero
          onShop={() => shopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          onFilter={handleSetFilter}
        />
        <ProductGrid
          products={products}
          productsLoaded={productsLoaded}
          filter={activeFilter}
          setFilter={handleSetFilter}
          onProductClick={handleOpenProduct}
          shopRef={shopRef}
        />
        <StoreInfo />
        <Footer />
      </main>
      <CartDrawer
        open={cartOpen} items={cart} onClose={closeCart}
        onRemove={removeFromCart} onCheckout={handleGoCheckout}
      />
    </>
  );
}

// ── Product detail page ───────────────────────────────────────────────
function ProductDetailPage() {
  const navigate   = useNavigate();
  const { slug }   = useParams();
  const { findProduct, productsLoaded } = useProducts();
  const { cart, cartOpen, openCart, closeCart, addToCart, removeFromCart } = useCart();

  const product = findProduct(slug);
  const goHome  = () => navigate("/shop");
  const handleSetFilter = (f) => navigate(`/shop/${f}`);
  const handleGoCheckout = () => { closeCart(); navigate("/checkout"); window.scrollTo({ top: 0 }); };

  useEffect(() => { window.scrollTo({ top: 0 }); }, [slug]);

  // Not loaded yet — wait
  if (!productsLoaded) return null;

  // Product not found — redirect home
  if (!product) { navigate("/shop", { replace: true }); return null; }

  return (
    <>
      <SEO
        title={product.name}
        description={product.subtitle || product.desc}
        image={product.images?.[0]}
      />
      <Navbar
        filter="all"
        setFilter={handleSetFilter}
        cartCount={cart.length}
        onCartOpen={openCart}
        onLogoClick={goHome}
      />
      <main id="main-content" className="page-body page-anim" key={slug}>
        <Ticker />
        <ProductPage
          product={product}
          onBack={goHome}
          onAdd={addToCart}
          onFilterClick={handleSetFilter}
        />
        <Footer />
      </main>
      <CartDrawer
        open={cartOpen} items={cart} onClose={closeCart}
        onRemove={removeFromCart} onCheckout={handleGoCheckout}
      />
    </>
  );
}

// ── Checkout page ─────────────────────────────────────────────────────
function CheckoutRoute() {
  const navigate = useNavigate();
  const { cart, cartOpen, openCart, closeCart, clearCart, removeFromCart } = useCart();
  const goHome = () => navigate("/shop");
  const handleGoCheckout = () => { closeCart(); navigate("/checkout"); };

  const handleDone = () => {
    clearCart();
    navigate("/shop");
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      <SEO title="Checkout" />
      <Navbar
        filter="all"
        setFilter={(f) => navigate(`/shop/${f}`)}
        cartCount={cart.length}
        onCartOpen={openCart}
        onLogoClick={goHome}
      />
      <main id="main-content" className="page-body page-anim">
        <Ticker />
        <CheckoutPage items={cart} onBack={goHome} onDone={handleDone} />
        <Footer />
      </main>
      <CartDrawer
        open={cartOpen} items={cart} onClose={closeCart}
        onRemove={removeFromCart} onCheckout={handleGoCheckout}
      />
    </>
  );
}

// ── Root — redirect / → /select ───────────────────────────────────────
function Root() {
  const navigate = useNavigate();
  useEffect(() => { navigate("/select", { replace: true }); }, []);
  return null;
}

// ── App shell ─────────────────────────────────────────────────────────
export default function App() {
  return (
    <Routes>
      <Route path="/"               element={<Root />} />
      <Route path="/select"         element={<SelectPage />} />
      <Route path="/shop"           element={<ShopPage />} />
      <Route path="/shop/:filter"   element={<ShopPage />} />
      <Route path="/product/:slug"  element={<ProductDetailPage />} />
      <Route path="/checkout"       element={<CheckoutRoute />} />
      <Route path="*"               element={<Root />} />
    </Routes>
  );
}
