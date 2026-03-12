# HamedoSport — Frontend

## Quick Start

```bash
npm install
npm run dev
```
Opens at http://localhost:5173

---

## File Structure

```
src/
├── App.jsx                  ← Main app (global state only)
├── main.jsx                 ← React entry point
├── styles/
│   └── global.css           ← ALL styling here
├── data/
│   └── products.js          ← ADD / EDIT products here ✏️
└── components/
    ├── ui.jsx               ← Logo, icons, Toast (shared atoms)
    ├── SportSelector.jsx    ← Splash screen (Padel / Football)
    ├── Navbar.jsx           ← Top navigation bar
    ├── Ticker.jsx           ← Yellow scrolling bar
    ├── Hero.jsx             ← Homepage hero section
    ├── ProductGrid.jsx      ← Product grid + filter buttons
    ├── ProductCard.jsx      ← Individual product card
    ├── ProductModal.jsx     ← Product detail popup
    ├── CartDrawer.jsx       ← Slide-in cart
    ├── Checkout.jsx         ← Order form (Cash on Delivery)
    ├── PadelExplainer.jsx   ← "What is padel?" section
    ├── Breadcrumb.jsx       ← Navigation trail
    └── Footer.jsx           ← Footer
```

---

## How to Add a Product

Open `src/data/products.js` and add an entry:

```js
{
  id: "unique-id",
  sport: "padel",           // "padel" or "football"
  category: "Shirts",       // "Shirts" or "Jerseys"
  brand: "BullPadel",
  name: "Product Name",
  subtitle: "Short desc",
  color: "Black",
  colorHex: "#1a1a1a",      // for the colour dot
  price: 850,               // in EGP
  badge: "NEW",             // or null
  sizes: ["S","M","L","XL"],
  images: [
    "https://...url1...",
    "https://...url2...",   // optional extra photos
  ],
  desc: "Description text shown in popup.",
}
```

---

## Payment
Cash on Delivery only. Paymob can be added later in `Checkout.jsx`.

## Instagram
[@hamedo.sport](https://www.instagram.com/hamedo.sport/)
