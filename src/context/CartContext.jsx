import { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart,     setCart]     = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = useCallback((product, size, qty) => {
    const price = product.discountActive && product.discountPrice
      ? product.discountPrice
      : product.price;

    setCart((c) => [
      ...c,
      { ...product, size, qty, price, originalPrice: product.price },
    ]);
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((index) => {
    setCart((c) => c.filter((_, i) => i !== index));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart, cartOpen, cartTotal, cartCount,
        addToCart, removeFromCart, clearCart,
        openCart:  () => setCartOpen(true),
        closeCart: () => setCartOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
};
