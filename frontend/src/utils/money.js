/**
 * USD is the canonical price from the API. UZS is derived for display.
 * Override rate: REACT_APP_USD_TO_UZS (e.g. 12750).
 */
const RATE = (() => {
  const n = Number(process.env.REACT_APP_USD_TO_UZS);
  return Number.isFinite(n) && n > 0 ? n : 12750;
})();

export function usdToUzs(usd) {
  return Math.round(Number(usd) * RATE);
}

export function formatUsd(usd) {
  const n = Number(usd);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

/** Uzbek so'm — space as thousands separator */
export function formatUzs(usdOrAmount, { fromUsd = true } = {}) {
  const amount = fromUsd ? usdToUzs(usdOrAmount) : Math.round(Number(usdOrAmount));
  const formatted = new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${formatted.replace(/,/g, " ")} so'm`;
}

export function getUsdUzsRate() {
  return RATE;
}
