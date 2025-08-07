import { useCallback, useEffect, useState } from "react";

import { cartModel } from "@/advanced/features/cart/models/cart.model";
import { CartItem } from "@/advanced/features/cart/types/cart.type";
import { COUPON } from "@/advanced/features/coupon/constants/coupon";
import { Coupon } from "@/advanced/features/coupon/types/coupon.type";
import { DiscountType } from "@/advanced/features/discount/types/discount.type";
import { throwNotificationError } from "@/advanced/features/notification/utils/notificationError.util";
import { useProducts } from "@/advanced/features/product/hooks/useProducts";
import { ProductWithUI } from "@/advanced/features/product/types/product";
import { DEFAULTS } from "@/advanced/shared/constants/defaults";
import { PRODUCT } from "@/advanced/shared/constants/product";
import { useLocalStorage } from "@/advanced/shared/hooks/useLocalStorage";

interface Props {
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
}

export function useCart({ selectedCoupon, setSelectedCoupon }: Props) {
  const { products } = useProducts();
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);

  const [totalItemCount, setTotalItemCount] = useState<number>(DEFAULTS.TOTAL);

  const addToCart = useCallback((product: ProductWithUI) => {
    setCart((prevCart) => {
      const remainingStock = cartModel.getRemainingStock(product, prevCart);
      const isOutOfStock = remainingStock <= PRODUCT.OUT_OF_STOCK_THRESHOLD;

      if (isOutOfStock) {
        throwNotificationError.error("재고가 부족합니다!");

        return prevCart;
      }

      const existingCartItem = prevCart.find(
        (item) => item.product.id === product.id
      );

      if (existingCartItem) {
        const newQuantity = existingCartItem.quantity + 1;
        const isOverStock = newQuantity > product.stock;

        if (isOverStock) {
          throwNotificationError.error(
            `재고는 ${product.stock}개까지만 있습니다.`
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

    throwNotificationError.success("장바구니에 담았습니다");
  }, []);

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
        throwNotificationError.error(`재고는 ${maxStock}개까지만 있습니다.`);

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
    [products, removeFromCart]
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
        throwNotificationError.error(
          `percentage 쿠폰은 ${COUPON.MINIMUM_AMOUNT_FOR_PERCENTAGE.toLocaleString()}원 이상 구매 시 사용 가능합니다.`
        );

        return;
      }

      setSelectedCoupon(coupon);

      throwNotificationError.success("쿠폰이 적용되었습니다.");
    },
    [cart, selectedCoupon]
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
