import { useCallback, useEffect, useState } from "react";

import { cartModel } from "@/basic/features/cart/models/cart.model";
import { CartItem } from "@/basic/features/cart/types/cart.type";
import { COUPON } from "@/basic/features/coupon/constants/coupon";
import { Coupon } from "@/basic/features/coupon/types/coupon.type";
import { DiscountType } from "@/basic/features/discount/types/discount.type";
import { AddNotification } from "@/basic/features/notification/types/notification";
import { useProducts } from "@/basic/features/product/hooks/useProducts";
import { ProductWithUI } from "@/basic/features/product/types/product";
import { DEFAULTS } from "@/basic/shared/constants/defaults";
import { NOTIFICATION } from "@/basic/shared/constants/notification";
import { PRODUCT } from "@/basic/shared/constants/product";
import { useLocalStorage } from "@/basic/shared/hooks/useLocalStorage";

interface Props {
  addNotification: AddNotification;
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
}

export function useCart({
  addNotification,
  selectedCoupon,
  setSelectedCoupon,
}: Props) {
  const { products } = useProducts({
    addNotification,
  });
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);

  const [totalItemCount, setTotalItemCount] = useState<number>(DEFAULTS.TOTAL);

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      setCart((prevCart) => {
        const remainingStock = cartModel.getRemainingStock(product, prevCart);
        const isOutOfStock = remainingStock <= PRODUCT.OUT_OF_STOCK_THRESHOLD;

        if (isOutOfStock) {
          addNotification("재고가 부족합니다!", NOTIFICATION.TYPES.ERROR);
          return prevCart;
        }

        const existingCartItem = prevCart.find(
          (item) => item.product.id === product.id
        );

        if (existingCartItem) {
          const newQuantity = existingCartItem.quantity + 1;
          const isOverStock = newQuantity > product.stock;

          if (isOverStock) {
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

        return [...prevCart, { product, quantity: 1 }];
      });

      addNotification("장바구니에 담았습니다", NOTIFICATION.TYPES.SUCCESS);
    },
    [addNotification]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => {
      return prevCart.filter((item) => item.product.id !== productId);
    });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      const isOutOfStock = newQuantity <= PRODUCT.OUT_OF_STOCK_THRESHOLD;

      if (isOutOfStock) {
        removeFromCart(productId);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      const isOverStock = newQuantity > maxStock;

      if (isOverStock) {
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

      const isNotOverMinimumAmount =
        currentTotal < COUPON.MINIMUM_AMOUNT_FOR_PERCENTAGE;

      const isPercentageCoupon =
        coupon.discountType === DiscountType.PERCENTAGE;

      if (isNotOverMinimumAmount && isPercentageCoupon) {
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
