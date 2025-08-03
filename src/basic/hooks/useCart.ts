import { useState, useEffect, useMemo, useCallback } from "react";
import { CartItem, Product, Coupon } from "../types";
import * as composedModels from "../models";
import * as cartModel from "../models/cart";
import * as productModel from "../models/product";
import * as couponModel from "../models/coupon";
import { INITIAL_COUPONS } from "../constants";

// 장바구니 + 쿠폰 통합 관리 훅
export function useCart(
  addNotification?: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void
) {
  // ========== 장바구니 상태 ==========
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // ========== 쿠폰 상태 ==========
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem("coupons");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_COUPONS;
      }
    }
    return INITIAL_COUPONS;
  });

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // ========== localStorage 동기화 ==========
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("coupons", JSON.stringify(coupons));
  }, [coupons]);

  // ========== 계산된 값들 (useMemo로 최적화) ==========
  const totals = useMemo(() => {
    return composedModels.calculateCartTotal(cart, selectedCoupon);
  }, [cart, selectedCoupon]);

  const getRemainingStock = useMemo(() => {
    return (product: Product) => productModel.getRemainingStock(product, cart);
  }, [cart]);

  const calculateItemTotal = useMemo(() => {
    return (item: CartItem) => composedModels.calculateItemTotal(item, cart);
  }, [cart]);

  // ========== 장바구니 비즈니스 로직 ==========
  const addToCart = useCallback(
    (product: Product) => {
      // 1. 재고 확인
      const remainingStock = productModel.getRemainingStock(product, cart);
      if (remainingStock <= 0) {
        addNotification?.("재고가 부족합니다!", "error");
        return;
      }

      // 2. 수량 초과 확인
      const existingItem = cart.find((item) => item.product.id === product.id);
      const newQuantity = (existingItem?.quantity || 0) + 1;

      if (newQuantity > product.stock) {
        addNotification?.(`재고는 ${product.stock}개까지만 있습니다.`, "error");
        return;
      }

      // 3. 상태 변경
      setCart((prevCart) => cartModel.addItemToCart(prevCart, product));

      // 4. 성공 알림
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

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification?.(`재고는 ${maxStock}개까지만 있습니다.`, "error");
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
      if (couponModel.checkDuplicateCoupon(coupons, newCoupon.code)) {
        addNotification?.("이미 존재하는 쿠폰 코드입니다.", "error");
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

      // models/index의 조합 함수 사용
      const result = composedModels.applyCouponToCart(cart, coupon);
      
      if (!result.success) {
        addNotification?.(result.reason!, "error");
        return;
      }

      setSelectedCoupon(result.selectedCoupon!);
      addNotification?.("쿠폰이 적용되었습니다.", "success");
    },
    [cart, addNotification]
  );

  return {
    // ========== 장바구니 상태 및 기능 ==========
    cart,
    totals,
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
