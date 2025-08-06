import { useCallback, useMemo, useState } from "react";
import { CartItem, Product } from "../../../types";
import { ProductWithUI } from "../products/product.types";
import { NotificationType } from "../../hooks/useNotifications";
import { calculateRemainingStock } from "../../utils/calculateRemainingStock";
import { useLocalStorageState } from "../../utils/hooks/useLocalStorageState";
import { cartModel } from "./cart.model";

//TODO : 카트에서 노티피케이션 제거하기!
export const useCart = (
  addNotification: (message: string, type: NotificationType) => void
) => {
  const [cart, setCart] = useLocalStorageState<CartItem[]>("cart", []);

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = cartModel.getRemainingStock(product, cart);
      if (remainingStock <= 0) {
        addNotification("재고가 부족합니다!", "error");
        return;
      }

      const newCart = cartModel.addToCart(cart, product);
      const addFailed = newCart === cart; // 장바구니에 담기지 않은 경우

      if (addFailed) {
        addNotification(`재고는 ${product.stock}개까지만 있습니다.`, "error");
        return;
      }

      setCart(newCart);

      addNotification("장바구니에 담았습니다", "success");
    },
    [cart, addNotification, calculateRemainingStock]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => cartModel.removeFromCart(prevCart, productId));
  }, []);

  const totalItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  return {
    cart,
    setCart,
    addToCart,
    totalItemCount,
    removeFromCart,
  };
};
