import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CartProvider, useCart } from "../context/CartContext";

const mockProduct = {
  _id: "p1", slug: "test-product", name: "Test Racket",
  price: 500, discountPrice: 400, discountActive: true,
  images: ["https://example.com/img.jpg"],
};

function CartDisplay() {
  const { cart, cartCount, cartTotal, addToCart, removeFromCart, clearCart } = useCart();
  return (
    <div>
      <div data-testid="count">{cartCount}</div>
      <div data-testid="total">{cartTotal}</div>
      <div data-testid="items">{cart.length}</div>
      <button onClick={() => addToCart(mockProduct, "M", 1)}>Add</button>
      <button onClick={() => removeFromCart(0)}>Remove</button>
      <button onClick={clearCart}>Clear</button>
    </div>
  );
}

describe("CartContext", () => {
  it("starts empty", () => {
    render(<CartProvider><CartDisplay /></CartProvider>);
    expect(screen.getByTestId("count").textContent).toBe("0");
    expect(screen.getByTestId("total").textContent).toBe("0");
  });

  it("adds item and uses discountPrice when active", () => {
    render(<CartProvider><CartDisplay /></CartProvider>);
    fireEvent.click(screen.getByText("Add"));
    expect(screen.getByTestId("count").textContent).toBe("1");
    expect(screen.getByTestId("total").textContent).toBe("400"); // discountPrice
  });

  it("removes item", () => {
    render(<CartProvider><CartDisplay /></CartProvider>);
    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Remove"));
    expect(screen.getByTestId("count").textContent).toBe("0");
  });

  it("clears all items", () => {
    render(<CartProvider><CartDisplay /></CartProvider>);
    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Clear"));
    expect(screen.getByTestId("items").textContent).toBe("0");
  });

  it("uses regular price when discount is inactive", () => {
    const noDiscount = { ...mockProduct, discountActive: false };
    function AddNoDiscount() {
      const { cartTotal, addToCart } = useCart();
      return (
        <div>
          <div data-testid="total">{cartTotal}</div>
          <button onClick={() => addToCart(noDiscount, "M", 1)}>Add</button>
        </div>
      );
    }
    render(<CartProvider><AddNoDiscount /></CartProvider>);
    fireEvent.click(screen.getByText("Add"));
    expect(screen.getByTestId("total").textContent).toBe("500");
  });
});
