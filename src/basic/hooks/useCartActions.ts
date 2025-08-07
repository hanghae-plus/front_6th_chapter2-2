import { useCallback } from "react";
import { useCart } from "./useCart";
import { ProductWithUI } from "../App";

interface CartActionCallbacks {
  onSuccess?: (action: string) => void;
  onError?: (message: string) => void;
}

export function useCartActions(callbacks?: CartActionCallbacks) {
  const {
    cart,
    addToCart: addToCartOriginal,
    removeFromCart: removeFromCartOriginal,
    updateQuantity: updateQuantityOriginal,
    completeOrder: completeOrderOriginal,
    calculateItemTotal,
  } = useCart();

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const result = addToCartOriginal(product);

      if (result.status === "success") {
        callbacks?.onSuccess?.("장바구니에 담았습니다");
      } else {
        callbacks?.onError?.(result.message);
      }

      return result;
    },
    [addToCartOriginal, callbacks]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      const result = removeFromCartOriginal(productId);

      if (result.status === "success") {
        callbacks?.onSuccess?.("장바구니에서 제거했습니다");
      } else {
        callbacks?.onError?.(result.message);
      }

      return result;
    },
    [removeFromCartOriginal, callbacks]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      const result = updateQuantityOriginal(productId, quantity);

      if (result.status === "success") {
        callbacks?.onSuccess?.("수량이 변경되었습니다");
      } else {
        callbacks?.onError?.(result.message);
      }

      return result;
    },
    [updateQuantityOriginal, callbacks]
  );

  const completeOrder = useCallback(() => {
    const result = completeOrderOriginal();

    if (result.status === "success") {
      callbacks?.onSuccess?.("주문이 완료되었습니다");
    } else {
      callbacks?.onError?.(result.message);
    }

    return result;
  }, [completeOrderOriginal, callbacks]);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    completeOrder,
    calculateItemTotal,
  };
}
