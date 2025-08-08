import { useAtomValue, useSetAtom } from "jotai";
import { Product } from "../../types";
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
import { productsAtom } from "../stores/productStore";
import { withTryNotifySuccess } from "../utils/withNotify";

// 라이브러리 훅을 래핑하는 엔티티 Hook
export const useCart = (addNotification?: (message: string, type?: "error" | "success" | "warning") => void) => {
  // Jotai 라이브러리 훅들을 래핑
  const cart = useAtomValue(cartAtom);
  const totalItemCount = useAtomValue(totalItemCountAtom);
  const getRemainingStock = useAtomValue(getRemainingStockAtom);
  const products = useAtomValue(productsAtom);

  const addToCartSet = useSetAtom(addToCartAtom);
  const removeFromCartSet = useSetAtom(removeFromCartAtom);
  const updateQuantitySet = useSetAtom(updateQuantityAtom);
  const clearCartSet = useSetAtom(clearCartAtom);
  const addNotificationSet = useSetAtom(addNotificationAtom);

  // withNotify 유틸리티를 사용하여 엔티티 특화 로직으로 래핑
  const addToCart = withTryNotifySuccess(
    (product: Product) => addToCartSet(product),
    "장바구니에 담았습니다.",
    (message, type) => (addNotification ? addNotification(message, type) : addNotificationSet({ message, type }))
  );

  const removeFromCart = withTryNotifySuccess(
    (productId: string) => removeFromCartSet(productId),
    "장바구니에서 제거되었습니다.",
    (message, type) => (addNotification ? addNotification(message, type) : addNotificationSet({ message, type }))
  );

  const updateQuantity = withTryNotifySuccess(
    (productId: string, newQuantity: number) => updateQuantitySet({ productId, newQuantity, products }),
    "수량이 업데이트되었습니다.",
    (message, type) => (addNotification ? addNotification(message, type) : addNotificationSet({ message, type }))
  );

  const clearCart = withTryNotifySuccess(
    () => clearCartSet(),
    "장바구니가 비워졌습니다.",
    (message, type) => (addNotification ? addNotification(message, type) : addNotificationSet({ message, type }))
  );

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
