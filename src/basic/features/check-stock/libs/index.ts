import { Product } from "../../../entities/product/types";

export const getRemainingStock = (product: Product, cartQuantity: number) => {
  return product.stock - cartQuantity;
};

export const getProductStockStatus = ({
  product,
  cartQuantity,
}: {
  product: Product;
  cartQuantity: number;
}) => {
  return getRemainingStock(product, cartQuantity) <= 0 ? "SOLD OUT" : "";
};
