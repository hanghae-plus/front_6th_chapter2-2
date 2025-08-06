import { useCallback, useEffect, useState } from "react";

import { COUPON, DEFAULTS, NOTIFICATION, PRODUCT } from "@/basic/constants";
import { useLocalStorage } from "@/basic/hooks";
import { cartModel } from "@/basic/models";
import {
  CartItem,
  Coupon,
  DiscountType,
  NotificationType,
  ProductWithUI,
} from "@/types";

interface Props {
  addNotification: (message: string, type: NotificationType) => void;
  products: ProductWithUI[];
}

export function useCart({ addNotification, products }: Props) {
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);

  const [totalItemCount, setTotalItemCount] = useState<number>(DEFAULTS.TOTAL);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

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
    selectedCoupon,
  };
}
