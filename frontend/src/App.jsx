import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "./components/Navbar";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { selectCartItems } from "./store/slices/cartSlice";

function CartPage() {
  const items = useSelector(selectCartItems);

  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "24px" }}>
      <h1>Shopping Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.name} x {item.quantity}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function NotFoundPage() {
  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "24px" }}>
      <h1>Page not found</h1>
    </main>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
        <Route path="/search" element={<ProductListPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
