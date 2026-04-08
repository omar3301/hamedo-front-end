import { useState, useEffect } from "react";
import { Logo, ICart } from "./ui";

const CATS = [
  { id: "all",         label: "All" },
  { id: "rackets",     label: "Rackets" },
  { id: "socks",       label: "Socks" },
  { id: "accessories", label: "Accessories" },
  { id: "clothes",     label: "Clothes" },
];

export default function Navbar({ filter, setFilter, cartCount, onCartOpen, onLogoClick }) {
  const [sc, setSc] = useState(false);
  useEffect(() => {
    const h = () => setSc(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav className={"nav" + (sc ? " sc" : "")} role="navigation" aria-label="Main navigation">
      <button
        onClick={onLogoClick}
        aria-label="HamedoSport — go to home page"
        style={{ cursor: "pointer", background: "none", border: "none", padding: 0 }}
      >
        <Logo size={28} aria-hidden="true" />
      </button>

      <div className="hm nav-pill" role="menubar" aria-label="Product categories">
        {CATS.map(c => (
          <button
            key={c.id}
            className={"npb" + (filter === c.id ? " on" : "")}
            onClick={() => setFilter(c.id)}
            role="menuitem"
            aria-current={filter === c.id ? "page" : undefined}
            aria-label={"Filter by " + c.label}
          >
            {c.label}
          </button>
        ))}
      </div>

      <button
        className="nav-cart"
        onClick={onCartOpen}
        aria-label={
          cartCount > 0
            ? "Open cart — " + cartCount + " item" + (cartCount !== 1 ? "s" : "")
            : "Open cart — empty"
        }
      >
        <ICart aria-hidden="true" />
        {cartCount > 0 && (
          <span className="cbadge" aria-hidden="true">{cartCount}</span>
        )}
      </button>
    </nav>
  );
}
