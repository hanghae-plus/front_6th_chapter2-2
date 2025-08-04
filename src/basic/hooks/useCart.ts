import { useState, useMemo, useCallback } from "react";
import { CartItem, Product, Coupon } from "../types";
import * as composedModels from "../models";
import * as cartModel from "../models/cart";
import * as productModel from "../models/product";
import * as couponModel from "../models/coupon";
import { INITIAL_COUPONS } from "../constants";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import {
  validateCartStock,
  validateCouponAvailable,
  validateCouponCode,
} from "../utils/validators";

// 장바구니 + 쿠폰 통합 관리 훅
export function useCart(
  addNotification?: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void
) {
  // ========== 장바구니 상태 ==========
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);

  // ========== 쿠폰 상태 ==========
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    "coupons",
    INITIAL_COUPONS
  );

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // ========== 계산된 값들 (useMemo로 최적화) ==========
  const cartTotal = useMemo(() => {
    return composedModels.calculateCartTotal(cart, selectedCoupon);
  }, [cart, selectedCoupon]);

  const getRemainingStock = useCallback(
    (product: Product) => productModel.getRemainingStock(product, cart),
    [cart]
  );

  const calculateItemTotal = useCallback(
    (item: CartItem) => composedModels.calculateItemTotal(item, cart),
    [cart]
  );

  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ========== 장바구니 비즈니스 로직 ==========
  const addToCart = useCallback(
    (product: Product) => {
      // 장바구니 수량 + 1로 재고 검증
      const existingItem = cart.find((item) => item.product.id === product.id);
      const newQuantity = (existingItem?.quantity || 0) + 1;

      const validation = validateCartStock(product, newQuantity, cart);
      if (validation.errorMessage) {
        addNotification?.(validation.errorMessage, "error");
        return;
      }

      // 상태 변경
      setCart((prevCart) => cartModel.addItemToCart(prevCart, product));

      // 성공 알림
      addNotification?.("장바구니에 담았습니다", "success");
    },
    [cart, addNotification]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => cartModel.removeItemFromCart(prevCart, productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number, products?: Product[]) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products?.find((p) => p.id === productId);
      if (!product) return;

      // 재고 검증
      const validation = validateCartStock(product, newQuantity, cart);
      if (validation.errorMessage) {
        addNotification?.(validation.errorMessage, "error");
        return;
      }

      setCart((prevCart) =>
        cartModel.updateCartItemQuantity(prevCart, productId, newQuantity)
      );
    },
    [removeFromCart, addNotification]
  );

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification?.(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification]);

  // ========== 쿠폰 비즈니스 로직 ==========
  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const validation = validateCouponCode(coupons, newCoupon.code);
      if (validation.errorMessage) {
        addNotification?.(validation.errorMessage, "error");
        return;
      }
      setCoupons((prev) => couponModel.addCouponToList(prev, newCoupon));
      addNotification?.("쿠폰이 추가되었습니다.", "success");
    },
    [coupons, addNotification]
  );

  const removeCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => couponModel.removeCouponFromList(prev, couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification?.("쿠폰이 삭제되었습니다.", "success");
    },
    [selectedCoupon, addNotification]
  );

  const applyCoupon = useCallback(
    (coupon: Coupon | null) => {
      if (!coupon) {
        setSelectedCoupon(null);
        return;
      }

      // 쿠폰 검증
      const cartTotalForValidation = composedModels.calculateCartTotal(cart, null);
      const validation = validateCouponAvailable(
        coupon,
        cartTotalForValidation.totalAfterDiscount
      );

      if (validation.errorMessage) {
        addNotification?.(validation.errorMessage, "error");
        return;
      }

      setSelectedCoupon(coupon);
      addNotification?.("쿠폰이 적용되었습니다.", "success");
    },
    [cart, addNotification]
  );

  return {
    // ========== 장바구니 상태 및 기능 ==========
    cart,
    cartTotal,
    totalItemCount,
    getRemainingStock,
    calculateItemTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    completeOrder,

    // ========== 쿠폰 상태 및 기능 ==========
    coupons,
    selectedCoupon,
    addCoupon,
    removeCoupon,
    applyCoupon,
  };
}
