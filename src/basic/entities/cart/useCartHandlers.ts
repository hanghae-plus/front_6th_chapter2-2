import { useCallback } from "react";
import { ProductWithUI } from "../products/product.types";
import { useCart } from "./useCart";

interface UseCartHandlersProps {
  addNotification: (
    message: string,
    type: "success" | "error" | "warning"
  ) => void;
}

export const useCartHandlers = ({ addNotification }: UseCartHandlersProps) => {
  const {
    cart,
    setCart,
    addToCart: addToCartAction,
    removeFromCart,
    updateQuantity: updateQuantityAction,
    totalItemCount,
  } = useCart();

  // 장바구니에 상품 추가 핸들러
  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const result = addToCartAction(product);
      if (result.type) {
        addNotification(result.message, result.type);
      }
    },
    [addToCartAction, addNotification]
  );

  // 수량 변경 핸들러
  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      const result = updateQuantityAction(productId, newQuantity);
      if (result.type) {
        addNotification(result.message, result.type);
      }
    },
    [updateQuantityAction, addNotification]
  );

  return {
    // 상태
    cart,
    setCart,
    totalItemCount,
    // 핸들러들
    addToCart,
    removeFromCart,
    updateQuantity,
  };
};
