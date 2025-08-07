// TODO: 장바구니 관리 Hook
// 힌트:
// 1. 장바구니 상태 관리 (localStorage 연동)
// 2. 상품 추가/삭제/수량 변경
// 3. 쿠폰 적용
// 4. 총액 계산
// 5. 재고 확인
//
// 사용할 모델 함수:
// - cartModel.addItemToCart
// - cartModel.removeItemFromCart
// - cartModel.updateCartItemQuantity
// - cartModel.calculateCartTotal
// - cartModel.getRemainingStock
//
// 반환할 값:
// - cart: 장바구니 아이템 배열
// - selectedCoupon: 선택된 쿠폰
// - addToCart: 상품 추가 함수
// - removeFromCart: 상품 제거 함수
// - updateQuantity: 수량 변경 함수
// - applyCoupon: 쿠폰 적용 함수
// - calculateTotal: 총액 계산 함수
// - getRemainingStock: 재고 확인 함수
// - clearCart: 장바구니 비우기 함수

import { useState, useCallback, useEffect } from "react";
import { CartItem, Coupon, ProductWithUI } from "../type/types";
import {
  COUPON_TYPE_AMOUNT,
  COUPON_TYPE_PERCENTAGE,
  MIN_ORDER_AMOUNT_FOR_PERCENTAGE,
} from "../constants/coupon";

interface CartTotals {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
}

interface UseCartProps {
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

/**
 * 장바구니 관련 상태와 로직을 관리하는 훅
 *
 * 주요 기능:
 * 1. 장바구니 상태 관리 (items, selectedCoupon)
 * 2. 상품 추가/제거/수량 업데이트
 * 3. 쿠폰 적용/해제
 * 4. 할인 계산 (상품별, 전체)
 * 5. 재고 관리
 * 6. 주문 완료 처리
 * 7. localStorage 동기화
 *
 * @param addNotification 알림 메시지 표시 함수
 * @returns 장바구니 관련 상태와 함수들
 */
export const useCart = ({ addNotification }: UseCartProps) => {
  // 장바구니 상태
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

  // localStorage 동기화
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  // 쿠폰 상태
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // Origin의 getMaxApplicableDiscount 함수
  // 상품의 수량별 할인율과 대량 구매 보너스 할인을 계산
  const getMaxApplicableDiscount = useCallback(
    (item: CartItem): number => {
      const { discounts } = item.product;
      const { quantity } = item;

      // 기본 할인율 계산 (수량에 따른 최대 할인율)
      const baseDiscount = discounts.reduce((maxDiscount, discount) => {
        return quantity >= discount.quantity && discount.rate > maxDiscount
          ? discount.rate
          : maxDiscount;
      }, 0);

      // 대량 구매 보너스: 장바구니에 10개 이상 상품이 있으면 추가 5% 할인
      const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
      if (hasBulkPurchase) {
        return Math.min(baseDiscount + 0.05, 0.5); // 최대 50% 할인 제한
      }

      return baseDiscount;
    },
    [cart]
  );

  // Origin의 calculateItemTotal 함수
  // 개별 상품의 할인이 적용된 총 가격 계산
  const calculateItemTotal = useCallback(
    (item: CartItem): number => {
      const { price } = item.product;
      const { quantity } = item;
      const discount = getMaxApplicableDiscount(item);

      return Math.round(price * quantity * (1 - discount));
    },
    [getMaxApplicableDiscount]
  );

  // Origin의 calculateCartTotal 함수
  // 장바구니 전체의 할인 전/후 총액 계산 (쿠폰 적용 포함)
  const calculateCartTotal = useCallback((): CartTotals => {
    let totalBeforeDiscount = 0;
    let totalAfterDiscount = 0;

    // 각 상품별 가격 합산
    cart.forEach((item) => {
      const itemPrice = item.product.price * item.quantity;
      totalBeforeDiscount += itemPrice;
      totalAfterDiscount += calculateItemTotal(item);
    });

    // 쿠폰 할인 적용
    if (selectedCoupon) {
      if (selectedCoupon.discountType === COUPON_TYPE_AMOUNT) {
        totalAfterDiscount = Math.max(
          0,
          totalAfterDiscount - selectedCoupon.discountValue
        );
      } else {
        totalAfterDiscount = Math.round(
          totalAfterDiscount * (1 - selectedCoupon.discountValue / 100)
        );
      }
    }

    return {
      totalBeforeDiscount: Math.round(totalBeforeDiscount),
      totalAfterDiscount: Math.round(totalAfterDiscount),
    };
  }, [cart, selectedCoupon, calculateItemTotal]);

  // Origin의 getRemainingStock 함수
  // 상품의 남은 재고 수량 계산 (현재 장바구니에 담긴 수량 제외)
  const getRemainingStock = useCallback(
    (product: ProductWithUI): number => {
      const cartItem = cart.find((item) => item.product.id === product.id);
      const remaining = product.stock - (cartItem?.quantity || 0);

      return remaining;
    },
    [cart]
  );

  // 장바구니에 상품 추가
  // 재고 확인 후 기존 상품이면 수량 증가, 새 상품이면 추가
  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(product);
      if (remainingStock <= 0) {
        addNotification("재고가 부족합니다!", "error");
        return;
      }

      setCart((prevCart) => {
        // Origin 로직: 기존 상품이 있으면 수량 증가, 없으면 새로 추가
        const existingItem = prevCart.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;
          if (newQuantity > product.stock) {
            addNotification(
              `재고는 ${product.stock}개까지만 있습니다.`,
              "error"
            );
            return prevCart;
          }

          return prevCart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
        } else {
          return [...prevCart, { product, quantity: 1 }];
        }
      });

      addNotification("장바구니에 담았습니다", "success");
    },
    [getRemainingStock, addNotification]
  );

  // 장바구니에서 상품 제거
  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  }, []);

  // 장바구니 상품 수량 변경
  // 0 이하로 설정하면 상품 제거, 재고 초과시 최대 재고로 제한
  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) => {
          if (item.product.id === productId) {
            const maxQuantity = item.product.stock;
            const finalQuantity = Math.min(newQuantity, maxQuantity);

            if (finalQuantity !== newQuantity) {
              addNotification(
                `재고는 ${maxQuantity}개까지만 있습니다.`,
                "error"
              );
            }

            return { ...item, quantity: finalQuantity };
          }
          return item;
        })
      );
    },
    [removeFromCart, addNotification]
  );

  // Origin의 applyCoupon 로직 - percentage 쿠폰은 10,000원 이상 구매시만 사용 가능
  // 쿠폰 적용 가능 여부 확인 후 적용
  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal().totalAfterDiscount;

      // percentage 쿠폰은 10,000원 이상 구매시에만 사용 가능
      if (
        currentTotal < MIN_ORDER_AMOUNT_FOR_PERCENTAGE &&
        coupon.discountType === COUPON_TYPE_PERCENTAGE
      ) {
        addNotification(
          "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
          "error"
        );
        return;
      }

      setSelectedCoupon(coupon);
      addNotification("쿠폰이 적용되었습니다.", "success");
    },
    [calculateCartTotal, addNotification]
  );

  // 적용된 쿠폰 제거
  const removeCoupon = useCallback(() => {
    setSelectedCoupon(null);
    addNotification("쿠폰 적용이 해제되었습니다.", "success");
  }, [addNotification]);

  // Origin의 completeOrder 로직
  // 주문 완료 처리 (주문번호 생성, 장바구니 초기화)
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification]);

  return {
    // 상태값
    cart,
    selectedCoupon,

    // 장바구니 조작 함수들
    addToCart,
    removeFromCart,
    updateQuantity,

    // 쿠폰 관리 함수들
    applyCoupon,
    removeCoupon,

    // 주문 관리 함수들
    completeOrder,

    // 계산 함수들
    calculateItemTotal,
    calculateCartTotal,
    getRemainingStock,
  };
};
