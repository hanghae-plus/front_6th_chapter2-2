import { useState } from "react";
import { useProducts } from "./useProducts";
import { useCart } from "./useCart";
import { useOrder } from "./useOrder";
import { useSearch } from "../utils/hooks/useSearch";

export const useAppState = (addNotification?: (message: string, type?: "error" | "success" | "warning") => void) => {
  // 각 도메인별 상태 관리
  const { cart, totalItemCount, addToCart, removeFromCart, updateQuantity, clearCart } = useCart(addNotification);

  // 주문 기능
  const { completeOrder } = useOrder({ clearCart, addNotification });

  // UI 상태
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleAdmin = () => setIsAdmin(!isAdmin);

  return {
    // 도메인별 상태
    cart,

    // 도메인별 액션
    addToCart,
    removeFromCart,
    updateQuantity,
    completeOrder,

    // UI 상태
    isAdmin,
    toggleAdmin,
    totalItemCount,
  };
};
