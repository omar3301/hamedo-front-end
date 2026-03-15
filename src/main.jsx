import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CartProvider }    from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import ErrorBoundary       from "./components/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ProductProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </ProductProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
