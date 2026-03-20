import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaBolt, FaShippingFast, FaShieldAlt, FaSpinner } from "react-icons/fa";

import productApi from "../api/productApi";
import ProductCard from "../components/ProductCard";
import { getUsdUzsRate } from "../utils/money";

const HIGHLIGHT_SLUGS = [
  "nike",
  "adidas",
  "apple",
  "samsung",
  "sony",
  "xiaomi",
  "oneplus",
  "microsoft",
  "asus",
  "nvidia",
  "dell",
  "lg",
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brandChips, setBrandChips] = useState([]);

  useEffect(() => {
    let cancelled = false;
    productApi
      .getProducts({ is_featured: true, per_page: 8, sort: "created_at", order: "desc" })
      .then((data) => {
        if (!cancelled) setFeatured(data.items || []);
      })
      .catch(() => {
        if (!cancelled) setFeatured([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    productApi.getBrands().then((list) => {
      const set = new Set(HIGHLIGHT_SLUGS);
      const chips = (list || [])
        .filter((b) => set.has(b.slug))
        .sort((a, b) => a.name.localeCompare(b.name));
      setBrandChips(chips);
    });
  }, []);

  const rate = getUsdUzsRate();

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero__inner">
          <p className="home-hero__eyebrow">TechZone · Electronics marketplace</p>
          <h1 className="home-hero__title">
            Zamonaviy texnika — <span className="home-hero__accent">USD</span> va{" "}
            <span className="home-hero__accent">so&apos;m</span> da narxlar
          </h1>
          <p className="home-hero__lead">
            Noutbuklar, smartfonlar, audio, sport-texnika. Nike, Adidas, Apple, Samsung va boshqa
            mashhur brendlar.
          </p>
          <div className="home-hero__cta">
            <Link to="/products" className="home-hero__btn home-hero__btn--primary">
              Barcha mahsulotlar <FaArrowRight />
            </Link>
            <Link to="/categories" className="home-hero__btn home-hero__btn--ghost">
              Kategoriyalar
            </Link>
          </div>
          <p className="home-hero__rate">
            1 USD ≈ {rate.toLocaleString("ru-RU").replace(/,/g, " ")} so&apos;m —{" "}
            <code className="home-hero__code">REACT_APP_USD_TO_UZS</code> orqali sozlash mumkin
          </p>
        </div>
      </section>

      <section className="home-trust">
        <div className="home-trust__item">
          <FaShippingFast /> Yetkazib berish
        </div>
        <div className="home-trust__item">
          <FaShieldAlt /> Kafolat
        </div>
        <div className="home-trust__item">
          <FaBolt /> Tez buyurtma
        </div>
      </section>

      <section className="home-brands">
        <div className="home-brands__head">
          <h2>Mashhur brendlar</h2>
          <Link to="/products">Barcha mahsulotlar</Link>
        </div>
        <div className="home-brands__strip">
          {brandChips.map((b) => (
            <Link key={b.id} to={`/products?brand_id=${b.id}`} className="home-brands__chip">
              {b.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="home-featured">
        <div className="home-featured__head">
          <h2>Tanlangan mahsulotlar</h2>
          <Link to="/products">
            Katalog <FaArrowRight />
          </Link>
        </div>
        {loading ? (
          <div className="home-featured__loading">
            <FaSpinner className="spinner" /> Yuklanmoqda…
          </div>
        ) : featured.length === 0 ? (
          <p className="home-featured__empty">
            Hozircha tanlangan mahsulot yo&apos;q.{" "}
            <Link to="/products">Barcha mahsulotlarni ko&apos;rish</Link>
          </p>
        ) : (
          <div className="home-featured__grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
