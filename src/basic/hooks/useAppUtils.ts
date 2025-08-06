import { useCallback } from "react";
import { ProductWithUI } from "../entities/products/product.types";
import { CartItem } from "../../types";
import { calculateRemainingStock } from "../utils/calculateRemainingStock";

interface UseAppUtilsProps {
  products: ProductWithUI[];
  cart: CartItem[];
}

export const useAppUtils = ({ products, cart }: UseAppUtilsProps) => {
  const checkSoldOutByProductId = useCallback(
    (productId: string) => {
      const product = products.find((p) => p.id === productId);
      if (product && calculateRemainingStock(product, cart) <= 0) {
        return true;
      }
      return false;
    },
    [products, cart]
  );

  return {
    checkSoldOutByProductId,
  };
};
