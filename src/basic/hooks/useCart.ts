import { useCallback, useState } from "react";
import { CartItem, Coupon } from "../../types";

import { ProductWithUI } from "../App";
import {
  addItemToCart,
  calculateCartTotal,
  getRemainingStock,
  removeItemFromCart,
  updateCartItemQuantity,
} from "../models/cart";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

export function useCart(
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void
) {
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []); // 장바구니 상태
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(product, cart);

      if (remainingStock <= 0) {
        addNotification("재고가 부족합니다!", "error");
        return;
      }

      const existingItem = cart.find((item) => item.product.id === product.id);
      const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

      if (newQuantity > product.stock) {
        addNotification(`재고는 ${product.stock}개까지만 있습니다.`, "error");
        return;
      }

      setCart((prevCart) => addItemToCart(prevCart, product));
      addNotification("장바구니에 담았습니다", "success");
    },
    [cart, addNotification, getRemainingStock]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => removeItemFromCart(prevCart, productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      console.log("updateQuantity", productId, newQuantity);

      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const cartItem = cart.find((item) => item.product.id === productId);

      if (!cartItem?.product) return;

      const maxStock = cartItem.product.stock;

      if (newQuantity > maxStock) {
        addNotification(`재고는 ${maxStock}개까지만 있습니다.`, "error");
        return;
      }

      setCart((prevCart) =>
        updateCartItemQuantity(prevCart, productId, newQuantity)
      );
    },
    [cart, removeFromCart, addNotification]
  );

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal(cart, coupon).totalAfterDiscount;

      console.log(currentTotal);

      if (currentTotal < 10000 && coupon.discountType === "percentage") {
        addNotification(
          "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
          "error"
        );
        return;
      }

      setSelectedCoupon(coupon);
      addNotification("쿠폰이 적용되었습니다.", "success");
    },
    [cart, addNotification]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedCoupon(null);
  }, []);

  const calculateTotal = useCallback(
    (cart: CartItem[], selectedCoupon: Coupon | null) => {
      return calculateCartTotal(cart, selectedCoupon);
    },
    []
  );

  return {
    cart,
    selectedCoupon,
    setSelectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    clearCart,
  };
}
