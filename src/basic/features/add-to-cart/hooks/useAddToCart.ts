import { useCallback } from "react";
import { ProductWithUI } from "../../../entities/product/types";
import { useGlobalNotification } from "../../../entities/notification/hooks/useGlobalNotification";
import { NotificationVariant } from "../../../entities/notification/types";
import { calculateRemainingStock } from "../../../entities/product/libs/stock";

interface UseAddToCartOptions {
  cart: Array<{ product: ProductWithUI; quantity: number }>;
  onAddItem: (item: { product: ProductWithUI; quantity: number }) => void;
}

export function useAddToCart({ cart, onAddItem }: UseAddToCartOptions) {
  const { addNotification } = useGlobalNotification();

  const getProductRemainingStock = useCallback(
    (product: ProductWithUI): number => {
      const cartItem = cart.find((item) => item.product.id === product.id);
      const cartQuantity = cartItem?.quantity || 0;
      return calculateRemainingStock(product.stock, cartQuantity);
    },
    [cart]
  );

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getProductRemainingStock(product);

      if (remainingStock <= 0) {
        addNotification("재고가 부족합니다!", NotificationVariant.ERROR);
        return;
      }

      const existingItem = cart.find((item) => item.product.id === product.id);
      const currentQuantity = existingItem?.quantity || 0;

      if (currentQuantity + 1 > product.stock) {
        addNotification(
          `재고는 ${product.stock}개까지만 있습니다.`,
          NotificationVariant.ERROR
        );
        return;
      }

      onAddItem({ product, quantity: 1 });
      addNotification("장바구니에 담았습니다", NotificationVariant.SUCCESS);
    },
    [cart, onAddItem, addNotification, getProductRemainingStock]
  );

  return {
    addToCart,
    getProductRemainingStock,
  };
}
