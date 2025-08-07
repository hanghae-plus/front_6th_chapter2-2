import type { ProductWithUI } from "../App";
import { CartItem } from "../../types";
import { getRemainingStock } from "../models/cart";

// TODO: 포맷팅 유틸리티 함수들
// 구현할 함수:
// - formatPrice(price: number): string - 가격을 한국 원화 형식으로 포맷
// - formatDate(date: Date): string - 날짜를 YYYY-MM-DD 형식으로 포맷
// - formatPercentage(rate: number): string - 소수를 퍼센트로 변환 (0.1 → 10%)

// TODO: 구현
export const formatPrice = ({
  price,
  productId,
  products,
  isAdmin,
  cart,
}: {
  price: number;
  productId?: string;
  products: ProductWithUI[];
  isAdmin: boolean;
  cart: CartItem[];
}): string => {
  if (productId) {
    const product = products.find((p) => p.id === productId);
    if (product && getRemainingStock({ product, cart }) <= 0) {
      return "SOLD OUT";
    }
  }

  if (isAdmin) {
    return `${price.toLocaleString()}원`;
  }

  return `₩${price.toLocaleString()}`;
};

export const formatPercentage = (rate: number): string => {
  return `${Math.round(rate * 100)}%`;
};
