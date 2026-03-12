// Navbar — Padel categories
import { useState, useEffect } from "react";
import { Logo, ICart } from "./ui";

const CATS = [
  { id: "all",         label: "All" },
  { id: "rackets",     label: "Rackets" },
  { id: "shoes",       label: "Shoes" },
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
    <nav className={"nav" + (sc ? " sc" : "")}>
      <div onClick={onLogoClick} style={{ cursor: "pointer" }}>
        <Logo size={28} />
      </div>
      <div className="hm nav-pill">
        {CATS.map(c => (
          <button
            key={c.id}
            className={"npb" + (filter === c.id ? " on" : "")}
            onClick={() => setFilter(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>
      <button className="nav-cart" onClick={onCartOpen} aria-label="Open cart">
        <ICart />
        {cartCount > 0 && <span className="cbadge">{cartCount}</span>}
      </button>
    </nav>
  );
}