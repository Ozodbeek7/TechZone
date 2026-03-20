import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "./components/Navbar";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CategoriesPage from "./pages/CategoriesPage";
import AccountPage from "./pages/AccountPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Link } from "react-router-dom";
import { selectCartItems } from "./store/slices/cartSlice";

function CartPage() {
  const items = useSelector(selectCartItems);

  return (
    <main className="cart-page">
      <h1 className="cart-page__title">Shopping cart</h1>
      {items.length === 0 ? (
        <div className="cart-page__empty">
          <p>Your cart is empty.</p>
          <Link to="/products" className="cart-page__link">
            Browse products
          </Link>
        </div>
      ) : (
        <ul className="cart-page__list">
          {items.map((item) => (
            <li key={item.id} className="cart-page__item">
              <span className="cart-page__name">{item.name}</span>
              <span className="cart-page__qty">× {item.quantity}</span>
              <span className="cart-page__price">
                ${(Number(item.price) * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="not-found-page">
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
      <Link to="/products">Back to products</Link>
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
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
