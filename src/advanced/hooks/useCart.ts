import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Product } from "../../types";
import { useAutoCallback } from "../utils/hooks/useAutoCallbak";
import { useSetAtom as useNotificationSetAtom } from "jotai";
import { addNotificationAtom } from "../stores/notificationStore";
import {
  cartAtom,
  totalItemCountAtom,
  addToCartAtom,
  removeFromCartAtom,
  updateQuantityAtom,
  clearCartAtom,
  getRemainingStockAtom,
} from "../stores/cartStore";

export const useCart = (addNotification?: (message: string, type?: "error" | "success" | "warning") => void) => {
  const [cart] = useAtom(cartAtom);
  const totalItemCount = useAtomValue(totalItemCountAtom);
  const getRemainingStock = useAtomValue(getRemainingStockAtom);

  const addToCartSet = useSetAtom(addToCartAtom);
  const removeFromCartSet = useSetAtom(removeFromCartAtom);
  const updateQuantitySet = useSetAtom(updateQuantityAtom);
  const clearCartSet = useSetAtom(clearCartAtom);
  const addNotificationSet = useNotificationSetAtom(addNotificationAtom);

  const addToCart = (product: Product) => {
    try {
      addToCartSet(product);
      if (addNotification) {
        addNotification("장바구니에 담았습니다.", "success");
      } else {
        addNotificationSet({ message: "장바구니에 담았습니다.", type: "success" });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "오류가 발생했습니다";
      if (addNotification) {
        addNotification(errorMessage, "error");
      } else {
        addNotificationSet({ message: errorMessage, type: "error" });
      }
    }
  };

  const removeFromCart = (productId: string) => {
    try {
      removeFromCartSet(productId);
      if (addNotification) {
        addNotification("장바구니에서 제거되었습니다.", "success");
      } else {
        addNotificationSet({ message: "장바구니에서 제거되었습니다.", type: "success" });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "오류가 발생했습니다";
      if (addNotification) {
        addNotification(errorMessage, "error");
      } else {
        addNotificationSet({ message: errorMessage, type: "error" });
      }
    }
  };

  const updateQuantity = (productId: string, newQuantity: number, products: Product[]) => {
    try {
      updateQuantitySet({ productId, newQuantity, products });
      if (addNotification) {
        addNotification("수량이 업데이트되었습니다.", "success");
      } else {
        addNotificationSet({ message: "수량이 업데이트되었습니다.", type: "success" });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "오류가 발생했습니다";
      if (addNotification) {
        addNotification(errorMessage, "error");
      } else {
        addNotificationSet({ message: errorMessage, type: "error" });
      }
    }
  };

  const clearCart = () => {
    try {
      clearCartSet();
      if (addNotification) {
        addNotification("장바구니가 비워졌습니다.", "success");
      } else {
        addNotificationSet({ message: "장바구니가 비워졌습니다.", type: "success" });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "오류가 발생했습니다";
      if (addNotification) {
        addNotification(errorMessage, "error");
      } else {
        addNotificationSet({ message: errorMessage, type: "error" });
      }
    }
  };

  return {
    cart,
    totalItemCount,
    getRemainingStock,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};
