import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Product } from "../../types";
import { withTryNotifySuccess } from "../utils/withNotify";
import { useAutoCallback } from "../utils/hooks/useAutoCallbak";
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

  const addToCart = (product: Product) => {
    addToCartSet(product);
  };

  const removeFromCart = (productId: string) => {
    removeFromCartSet(productId);
  };

  const updateQuantity = (productId: string, newQuantity: number, products: Product[]) => {
    updateQuantitySet({ productId, newQuantity, products });
  };

  const clearCart = () => {
    clearCartSet();
  };

  const handleAddToCart = useAutoCallback(
    withTryNotifySuccess(addToCart, "장바구니에 담았습니다.", addNotification ?? (() => {}))
  );

  const handleRemoveFromCart = useAutoCallback(
    withTryNotifySuccess(removeFromCart, "장바구니에서 제거되었습니다.", addNotification ?? (() => {}))
  );

  const handleUpdateQuantity = useAutoCallback(
    withTryNotifySuccess(updateQuantity, "수량이 업데이트되었습니다.", addNotification ?? (() => {}))
  );

  const handleClearCart = useAutoCallback(
    withTryNotifySuccess(clearCart, "장바구니가 비워졌습니다.", addNotification ?? (() => {}))
  );

  return {
    cart,
    totalItemCount,
    getRemainingStock,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
  };
};
