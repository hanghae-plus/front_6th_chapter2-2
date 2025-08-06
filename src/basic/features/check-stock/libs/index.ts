import { Product } from "../../../entities/product/types";
import { calculateStock } from "../../../entities/product/libs/stock";

export const getProductStockStatus = ({
  product,
  cartQuantity,
}: {
  product: Product;
  cartQuantity: number;
}) => {
  return calculateStock(product.stock, cartQuantity) <= 0 ? "SOLD OUT" : "";
};
