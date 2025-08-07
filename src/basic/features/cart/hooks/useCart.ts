import { useCallback, useEffect, useState } from "react";

import { cartModel } from "@/basic/features/cart/models/cart.model";
import { COUPON } from "@/basic/features/coupon/constants/coupon";
import { AddNotification } from "@/basic/features/notification/types/notification";
import { DEFAULTS } from "@/basic/shared/constants/defaults";
import { NOTIFICATION } from "@/basic/shared/constants/notification";
import { PRODUCT } from "@/basic/shared/constants/product";
import { useLocalStorage } from "@/basic/shared/hooks/useLocalStorage";
import { CartItem, Coupon, DiscountType, ProductWithUI } from "@/types";

interface Props {
  addNotification: AddNotification;
  products: ProductWithUI[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
}

export function useCart({
  addNotification,
  products,
  selectedCoupon,
  setSelectedCoupon,
}: Props) {
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);

  const [totalItemCount, setTotalItemCount] = useState<number>(DEFAULTS.TOTAL);

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = cartModel.getRemainingStock(product, cart);

      if (remainingStock <= PRODUCT.OUT_OF_STOCK_THRESHOLD) {
        addNotification("재고가 부족합니다!", NOTIFICATION.TYPES.ERROR);
        return;
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + DEFAULTS.QUANTITY;

          if (newQuantity > product.stock) {
            addNotification(
              `재고는 ${product.stock}개까지만 있습니다.`,
              NOTIFICATION.TYPES.ERROR
            );
            return prevCart;
          }

          return prevCart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
        }

        return [...prevCart, { product, quantity: DEFAULTS.QUANTITY }];
      });

      addNotification("장바구니에 담았습니다", NOTIFICATION.TYPES.SUCCESS);
    },
    [cart, addNotification]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.product.id !== productId);
      return newCart;
    });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= PRODUCT.OUT_OF_STOCK_THRESHOLD) {
        removeFromCart(productId);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification(
          `재고는 ${maxStock}개까지만 있습니다.`,
          NOTIFICATION.TYPES.ERROR
        );
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    },
    [products, removeFromCart, addNotification]
  );

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = cartModel.calculateCartTotal(
        cart,
        selectedCoupon
      ).totalAfterDiscount;

      if (
        currentTotal < COUPON.MINIMUM_AMOUNT_FOR_PERCENTAGE &&
        coupon.discountType === DiscountType.PERCENTAGE
      ) {
        addNotification(
          `percentage 쿠폰은 ${COUPON.MINIMUM_AMOUNT_FOR_PERCENTAGE.toLocaleString()}원 이상 구매 시 사용 가능합니다.`,
          NOTIFICATION.TYPES.ERROR
        );
        return;
      }

      setSelectedCoupon(coupon);
      addNotification("쿠폰이 적용되었습니다.", NOTIFICATION.TYPES.SUCCESS);
    },
    [addNotification, cart, selectedCoupon]
  );

  const resetCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  return {
    cart,
    setCart,
    totalItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    resetCoupon,
    clearCart,
  };
}
