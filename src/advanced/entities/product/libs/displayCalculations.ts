import { Product } from "../types";
import { formatPrice } from "@shared/libs/price";
import { getStockDisplay } from "./stock";

/**
 * 상품 가격 표시 로직
 */
export const getDisplayPrice = (
  product: Product,
  usedQuantity: number = 0
): string => {
  const stockStatus = getStockDisplay(product.stock, usedQuantity);
  if (stockStatus) return stockStatus;

  const formattedPrice = formatPrice(product.price);
  return `₩${formattedPrice}`;
};
