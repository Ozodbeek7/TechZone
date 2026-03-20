import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaSpinner, FaLayerGroup } from "react-icons/fa";

import {
  fetchCategories,
  selectCategories,
  selectCategoriesLoading,
} from "../store/slices/productSlice";

export default function CategoriesPage() {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectCategoriesLoading);

  useEffect(() => {
    dispatch(fetchCategories(true));
  }, [dispatch]);

  return (
    <main className="categories-page">
      <header className="categories-page__header">
        <FaLayerGroup className="categories-page__icon" />
        <div>
          <h1 className="categories-page__title">Categories</h1>
          <p className="categories-page__subtitle">Browse electronics by category</p>
        </div>
      </header>

      {loading ? (
        <div className="categories-page__loading">
          <FaSpinner className="spinner" /> Loading categories…
        </div>
      ) : (
        <div className="categories-page__grid">
          {(categories || []).map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category_id=${cat.id}`}
              className="categories-page__card"
            >
              <h2 className="categories-page__card-title">{cat.name}</h2>
              {cat.description && (
                <p className="categories-page__card-desc">{cat.description}</p>
              )}
              <span className="categories-page__card-meta">
                {cat.product_count ?? 0} products
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
