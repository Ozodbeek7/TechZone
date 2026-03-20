import React from "react";
import { formatUsd, formatUzs } from "../utils/money";

/**
 * Shows USD and UZS (derived) on two lines for product UIs.
 */
export default function PriceDisplay({ usd, className = "" }) {
  const n = Number(usd);
  if (!Number.isFinite(n)) return null;

  return (
    <div className={`price-display ${className}`.trim()}>
      <span className="price-display__usd">{formatUsd(n)}</span>
      <span className="price-display__uzs">{formatUzs(n)}</span>
    </div>
  );
}
