import { useMemo, useCallback } from "react";
import { useAtom, useSetAtom, useAtomValue } from "jotai";
import { CartItem, Product, Coupon } from "../types";
import * as composedModels from "../models";
import * as cartModel from "../models/cart";
import * as productModel from "../models/product";
import * as couponModel from "../models/coupon";
import {
  validateCartStock,
  validateCouponAvailable,
  validateCouponCode,
} from "../utils/validators";
import {
  addNotificationAtom,
  cartAtom,
  couponsAtom,
  selectedCouponAtom,
  totalItemCountAtom,
} from "../atoms";

// 장바구니 + 쿠폰 통합 관리 훅
export function useCart() {
  // ========== 알림 관리 (Jotai) ==========
  const addNotification = useSetAtom(addNotificationAtom);

  // ========== 장바구니 상태 (Jotai) ==========
  const [cart, setCart] = useAtom(cartAtom);

  // ========== 쿠폰 상태 (Jotai) ==========
  const [coupons, setCoupons] = useAtom(couponsAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);

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

  const totalItemCount = useAtomValue(totalItemCountAtom);

  // ========== 장바구니 비즈니스 로직 ==========
  const addToCart = useCallback(
    (product: Product) => {
      setCart((prev) => {
        // 장바구니 수량 + 1로 재고 검증
        const existingItem = prev.find(
          (item) => item.product.id === product.id
        );
        const newQuantity = (existingItem?.quantity || 0) + 1;

        const validation = validateCartStock(product, newQuantity, prev);
        if (validation.errorMessage) {
          addNotification(validation.errorMessage, "error");
          return prev;
        }

        // 성공 알림
        addNotification("장바구니에 담았습니다", "success");
        return cartModel.addItemToCart(prev, product);
      });
    },
    [setCart, addNotification]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prevCart) => cartModel.removeItemFromCart(prevCart, productId));
    },
    [setCart]
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number, products?: Product[]) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products?.find((p) => p.id === productId);
      if (!product) return;

      setCart((prevCart) => {
        // prevCart로 검증
        const validation = validateCartStock(product, newQuantity, prevCart);
        if (validation.errorMessage) {
          addNotification(validation.errorMessage, "error");
          return prevCart; // 기존 상태 유지
        }
        return cartModel.updateCartItemQuantity(
          prevCart,
          productId,
          newQuantity
        );
      });
    },
    [setCart, removeFromCart, addNotification]
  );

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification, setCart, setSelectedCoupon]);

  // ========== 쿠폰 비즈니스 로직 ==========
  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const validation = validateCouponCode(coupons, newCoupon.code);
      if (validation.errorMessage) {
        addNotification(validation.errorMessage, "error");
        return;
      }
      setCoupons((prev) => couponModel.addCouponToList(prev, newCoupon));
      addNotification("쿠폰이 추가되었습니다.", "success");
    },
    [coupons, setCoupons, addNotification]
  );

  const removeCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => couponModel.removeCouponFromList(prev, couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification("쿠폰이 삭제되었습니다.", "success");
    },
    [setCoupons, selectedCoupon?.code, addNotification, setSelectedCoupon]
  );

  const applyCoupon = useCallback(
    (coupon: Coupon | null) => {
      if (!coupon) {
        setSelectedCoupon(null);
        return;
      }

      // 쿠폰 검증
      const cartTotalForValidation = composedModels.calculateCartTotal(
        cart,
        null
      );
      const validation = validateCouponAvailable(
        coupon,
        cartTotalForValidation.totalAfterDiscount
      );

      if (validation.errorMessage) {
        addNotification(validation.errorMessage, "error");
        return;
      }

      setSelectedCoupon(coupon);
      addNotification("쿠폰이 적용되었습니다.", "success");
    },
    [cart, setSelectedCoupon, addNotification]
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
