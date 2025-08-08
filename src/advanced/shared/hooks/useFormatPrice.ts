import { useCallback } from "react";
import { ProductWithUI } from "../../domain/product/models";
import { formatUserPrice, formatAdminPrice, SOLD_OUT_TEXT } from "../utils";

/**
 * 가격 포맷팅 훅
 * - 품절 상품 처리
 * - 관리자/사용자 모드별 포맷팅
 */
export const useFormatPrice = (
  products: ProductWithUI[],
  isAdmin: boolean,
  getRemainingStock: (product: ProductWithUI) => number
) => {
  const formatPrice = useCallback(
    (price: number, productId?: string): string => {
      if (productId) {
        const product = products.find((p: ProductWithUI) => p.id === productId);
        if (product && getRemainingStock(product) <= 0) {
          return SOLD_OUT_TEXT;
        }
      }

      if (isAdmin) {
        return formatAdminPrice(price);
      }

      return formatUserPrice(price);
    },
    [products, isAdmin, getRemainingStock]
  );

  return { formatPrice };
};
