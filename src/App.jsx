import { useRef, useEffect } from "react";
import { Routes, Route, useNavigate, useParams, useLocation } from "react-router-dom";
import "./styles/global.css";
import SportSelector  from "./components/SportSelector";
import Navbar         from "./components/Navbar";
import Ticker         from "./components/Ticker";
import Hero           from "./components/Hero";
import ProductGrid    from "./components/ProductGrid";
import ProductPage    from "./components/ProductPage";
import CartDrawer     from "./components/CartDrawer";
import CheckoutPage   from "./pages/CheckoutPage";
import NotFound       from "./pages/NotFound";
import StoreInfo      from "./components/StoreInfo";
import Footer         from "./components/Footer";
import SEO            from "./components/SEO";
import RouteProgress  from "./components/RouteProgress";
import { useProducts } from "./context/ProductContext";
import { useCart }     from "./context/CartContext";

const API = "https://hamedo-back-end-production-63a0.up.railway.app/api";

const trackVisit = (page = "home") =>
  fetch(`${API}/visits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ page }),
  }).catch(() => {});

// ── Sport selector ────────────────────────────────────────────────────
function SelectPage() {
  const navigate = useNavigate();
  const handleSelect = (cat) => {
    trackVisit(cat);
    // Pass state so ShopPage knows to auto-scroll to grid
    navigate(`/shop/${cat}`, { state: { scrollToGrid: true } });
  };
  return (
    <>
      <SEO />
      <SportSelector onSelect={handleSelect} />
    </>
  );
}

// ── Shop page ─────────────────────────────────────────────────────────
function ShopPage() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { filter } = useParams();
  const shopRef    = useRef();
  const { products, productsLoaded } = useProducts();
  const { cart, cartOpen, openCart, closeCart, removeFromCart } = useCart();
  const activeFilter = filter || "all";

  // Auto-scroll to product grid when coming from the select page
  useEffect(() => {
    if (location.state?.scrollToGrid) {
      const timeout = setTimeout(() => {
        shopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 400); // wait for page animation to start
      return () => clearTimeout(timeout);
    }
  }, [location.state]);

  const goHome           = () => navigate("/shop");
  const handleSetFilter  = (f) => navigate(`/shop/${f}`);
  const handleGoCheckout = () => { closeCart(); navigate("/checkout"); window.scrollTo({ top: 0 }); };
  const handleOpenProd   = (p) => { navigate(`/product/${p.slug || p._id}`); window.scrollTo({ top: 0 }); };

  return (
    <>
      <SEO />
      <Navbar filter={activeFilter} setFilter={handleSetFilter}
        cartCount={cart.length} onCartOpen={openCart} onLogoClick={goHome} />
      <main id="main-content" className="page-body page-anim">
        <Ticker />
        <Hero
          onShop={() => shopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          onFilter={handleSetFilter}
        />
        <ProductGrid products={products} productsLoaded={productsLoaded}
          filter={activeFilter} setFilter={handleSetFilter}
          onProductClick={handleOpenProd} shopRef={shopRef} />
        <StoreInfo />
        <Footer />
      </main>
      <CartDrawer open={cartOpen} items={cart} onClose={closeCart}
        onRemove={removeFromCart} onCheckout={handleGoCheckout} />
    </>
  );
}

// ── Product detail ────────────────────────────────────────────────────
function ProductDetailPage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { findProduct, products, productsLoaded } = useProducts();
  const { cart, cartOpen, openCart, closeCart, addToCart, removeFromCart } = useCart();

  useEffect(() => { window.scrollTo({ top: 0 }); }, [slug]);

  const product        = findProduct(slug);
  const goHome         = () => navigate("/shop");
  const handleFilter   = (f) => navigate(`/shop/${f}`);
  const handleCheckout = () => { closeCart(); navigate("/checkout"); window.scrollTo({ top: 0 }); };
  const handleBack     = (item) => {
    if (item && (item.slug || item._id)) {
      navigate(`/product/${item.slug || item._id}`);
      window.scrollTo({ top: 0 });
    } else {
      navigate("/shop");
    }
  };

  // Buy Now — add to cart silently then go straight to checkout (no cart drawer popup)
  const handleBuyNow = (product, size, qty) => {
    addToCart(product, size, qty, true);
    navigate("/checkout");
    window.scrollTo({ top: 0 });
  };

  if (!productsLoaded) return null;
  if (!product) return <NotFound />;

  return (
    <>
      <SEO title={product.name} description={product.subtitle || product.desc} image={product.images?.[0]} />
      <Navbar filter="all" setFilter={handleFilter}
        cartCount={cart.length} onCartOpen={openCart} onLogoClick={goHome} />
      <main id="main-content" className="page-body page-anim" key={slug}>
        <Ticker />
        <ProductPage
          product={product}
          allProducts={products}
          onBack={handleBack}
          onAdd={addToCart}
          onBuyNow={handleBuyNow}
          onFilterClick={handleFilter}
        />
        <Footer />
      </main>
      <CartDrawer open={cartOpen} items={cart} onClose={closeCart}
        onRemove={removeFromCart} onCheckout={handleCheckout} />
    </>
  );
}

// ── Checkout ──────────────────────────────────────────────────────────
function CheckoutRoute() {
  const navigate = useNavigate();
  const { cart, cartOpen, openCart, closeCart, clearCart, removeFromCart } = useCart();
  const goHome         = () => navigate("/shop");
  const handleCheckout = () => { closeCart(); navigate("/checkout"); };

  return (
    <>
      <SEO title="Checkout" />
      <Navbar filter="all" setFilter={(f) => navigate(`/shop/${f}`)}
        cartCount={cart.length} onCartOpen={openCart} onLogoClick={goHome} />
      <main id="main-content" className="page-body page-anim">
        <Ticker />
        <CheckoutPage items={cart} onBack={goHome}
          onDone={() => { clearCart(); navigate("/shop"); window.scrollTo({ top: 0 }); }} />
        <Footer />
      </main>
      <CartDrawer open={cartOpen} items={cart} onClose={closeCart}
        onRemove={removeFromCart} onCheckout={handleCheckout} />
    </>
  );
}

function Root() {
  const navigate = useNavigate();
  useEffect(() => { navigate("/select", { replace: true }); }, []);
  return null;
}

export default function App() {
  return (
    <>
      <RouteProgress />
      <Routes>
        <Route path="/"              element={<Root />} />
        <Route path="/select"        element={<SelectPage />} />
        <Route path="/shop"          element={<ShopPage />} />
        <Route path="/shop/:filter"  element={<ShopPage />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/checkout"      element={<CheckoutRoute />} />
        <Route path="*"              element={<NotFound />} />
      </Routes>
    </>
  );
}