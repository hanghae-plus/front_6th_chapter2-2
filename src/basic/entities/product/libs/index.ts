import { Product } from "../types";

export const getProductStockStatus = ({
  product,
  cartQuantity,
}: {
  product: Product;
  cartQuantity: number;
}): string => {
  return isProductSoldOut({ product, cartQuantity }) ? "SOLD OUT" : "";
};

export const isProductSoldOut = ({
  product,
  cartQuantity,
}: {
  product: Product;
  cartQuantity: number;
}): boolean => {
  return getRemainingStock(product, cartQuantity) <= 0;
};

export const getRemainingStock = (
  product: Product,
  cartQuantity: number
): number => {
  const remaining = product.stock - cartQuantity;

  return remaining;
};
