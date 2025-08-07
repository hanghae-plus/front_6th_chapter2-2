import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { CartItem, Coupon } from "../../types";
import { ProductWithUI } from "../App";
import {
  getRemainingStock,
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  getMaxApplicableDiscount,
  hasBulkPurchase,
  calculateItemTotal,
} from "../models/cart";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

// 장바구니 관리 Hook
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

export function useCart({
  products,
  addNotification,
  selectedCoupon,
  setSelectedCoupon,
  setTotalItemCount,
}: {
  products: ProductWithUI[];
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
  selectedCoupon: Coupon | null;
  setSelectedCoupon: Dispatch<SetStateAction<Coupon | null>>;
  setTotalItemCount: Dispatch<SetStateAction<number>>;
}) {
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  const addToCart = useCallback(
    ({ product, cart }: { product: ProductWithUI; cart: CartItem[] }) => {
      const {
        success,
        message,
        cart: newCart,
      } = addItemToCart({
        product,
        cart,
      });
      if (!success) {
        addNotification(message, "error");
        return;
      }
      setCart(newCart);
      addNotification(message, "success");
    },
    [cart, addNotification]
  );

  const removeFromCart = useCallback(
    ({ productId, cart }: { productId: string; cart: CartItem[] }) => {
      const {
        success,
        message,
        cart: newCart,
      } = removeItemFromCart({
        productId,
        cart,
      });
      if (!success) {
        addNotification(message, "error");
        return;
      }
      setCart(newCart);
      if (message) {
        addNotification(message, "success");
      }
    },
    [cart, addNotification]
  );

  const updateQuantity = useCallback(
    ({
      productId,
      newQuantity,
      cart,
      products,
    }: {
      productId: string;
      newQuantity: number;
      cart: CartItem[];
      products: ProductWithUI[];
    }) => {
      const {
        success,
        message,
        cart: newCart,
      } = updateCartItemQuantity({
        products,
        productId,
        newQuantity,
        cart,
      });
      if (!success) {
        addNotification(message, "error");
        return;
      }
      setCart(newCart);
      addNotification(message, "success");
    },
    [cart, addNotification, products]
  );

  const calculateCartTotal = useCallback(
    ({
      cart,
      selectedCoupon,
    }: {
      cart: CartItem[];
      selectedCoupon: Coupon | null;
    }): {
      totalBeforeDiscount: number;
      totalAfterDiscount: number;
    } => {
      let totalBeforeDiscount = 0;
      let totalAfterDiscount = 0;

      cart.forEach((item) => {
        const itemPrice = item.product.price * item.quantity;
        totalBeforeDiscount += itemPrice;

        const discount = getMaxApplicableDiscount({
          discounts: item.product.discounts,
          quantity: item.quantity,
          hasBulkPurchase: hasBulkPurchase(cart),
        });

        totalAfterDiscount += calculateItemTotal({ item, discount });
      });

      if (selectedCoupon) {
        if (selectedCoupon.discountType === "amount") {
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
    },
    [cart, selectedCoupon]
  );

  const applyCoupon = useCallback(
    ({ coupon, cart }: { coupon: Coupon; cart: CartItem[] }) => {
      const currentTotal = calculateCartTotal({
        cart,
        selectedCoupon: coupon,
      }).totalAfterDiscount;

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
    [addNotification, calculateCartTotal]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem("cart");
  }, []);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateCartTotal,
    getRemainingStock,
    clearCart,
  };
}
