import { useCallback } from "react";
import { ProductWithUI } from "./product.types";
import { CartItem } from "../../../types";
import { calculateRemainingStock } from "../../utils/calculateRemainingStock";

interface UseProductUtilsProps {
  products: ProductWithUI[];
  cart: CartItem[];
}

export const useProductUtils = ({ products, cart }: UseProductUtilsProps) => {
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
