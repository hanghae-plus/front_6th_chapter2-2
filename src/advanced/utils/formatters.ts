import { Product } from "../../types";

export const displayPrice = (
  product: Product,
  { suffix = "", prefix = "" }: { suffix?: string; prefix?: string } = {}
): string => {
  if (product.stock <= 0) {
    return "SOLD OUT";
  }

  return `${prefix}${product.price.toLocaleString()}${suffix}`;
};

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

/**
 * 소수를 퍼센트로 변환 (0.1 → 10%)
 */
export const formatPercentage = (rate: number): string => {
  return `${(rate * 100).toFixed(0)}%`;
};
