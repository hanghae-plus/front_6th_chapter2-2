import { useCallback } from "react";
import { Product, Coupon } from "../../types";
import { useAutoCallback } from "../utils/hooks/useAutoCallbak";
import { withTryNotifySuccess, withTryNotifyError } from "../utils/withNotify";
import { EmptyOrderError, OrderCompletionError } from "../errors/Order.error";

interface UseAppHandlersProps {
  addToCartHook: (product: Product) => void;
  updateQuantity: (productId: string, newQuantity: number, products: Product[]) => void;
  calculateCartTotal: () => { totalBeforeDiscount: number; totalAfterDiscount: number };
  applyCoupon: (coupon: Coupon, currentTotal: number) => void;
  clearCart: () => void;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (couponCode: string) => void;
  addNotification: (message: string, type: "success" | "error") => void;
  cart: any[]; // 장바구니 아이템 배열
  products: Product[]; // 상품 목록
}

export const useAppHandlers = ({
  addToCartHook,
  updateQuantity,
  calculateCartTotal,
  applyCoupon,
  clearCart,
  setSelectedCoupon,
  addProduct,
  updateProduct,
  deleteProduct,
  addCoupon,
  deleteCoupon,
  addNotification,
  cart,
  products,
}: UseAppHandlersProps) => {
  // 장바구니에 상품 추가
  const addToCart = useAutoCallback(withTryNotifySuccess(addToCartHook, "장바구니에 담았습니다", addNotification));

  // 수량 업데이트
  const handleUpdateQuantity = useAutoCallback(
    withTryNotifyError((productId: string, newQuantity: number) => {
      updateQuantity(productId, newQuantity, products);
    }, addNotification)
  );

  // 쿠폰 적용
  const handleApplyCoupon = useAutoCallback(
    withTryNotifySuccess(
      (coupon: Coupon) => {
        const currentTotal = calculateCartTotal().totalAfterDiscount;
        applyCoupon(coupon, currentTotal);
      },
      "쿠폰이 적용되었습니다.",
      addNotification
    )
  );

  // 주문 완료
  const completeOrder = useAutoCallback(() => {
    try {
      // 장바구니가 비어있는지 확인
      if (cart.length === 0) {
        throw new EmptyOrderError();
      }

      const orderNumber = `ORD-${Date.now()}`;
      if (!orderNumber) {
        throw new OrderCompletionError("주문 번호 생성 실패");
      }

      addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, "success");
      clearCart();
      setSelectedCoupon(null);
    } catch (error) {
      if (error instanceof EmptyOrderError || error instanceof OrderCompletionError) {
        throw error;
      }
      throw new OrderCompletionError("주문 처리 중 오류가 발생했습니다.");
    }
  });

  // 상품 추가
  const handleAddProduct = useAutoCallback(withTryNotifySuccess(addProduct, "상품이 추가되었습니다.", addNotification));

  // 상품 수정
  const handleUpdateProduct = useAutoCallback(
    withTryNotifySuccess(
      (productId: string, updates: Partial<Product>) => {
        updateProduct(productId, updates);
      },
      "상품이 수정되었습니다.",
      addNotification
    )
  );

  // 상품 삭제
  const handleDeleteProduct = useAutoCallback(
    withTryNotifySuccess(deleteProduct, "상품이 삭제되었습니다.", addNotification)
  );

  // 쿠폰 추가
  const handleAddCoupon = useAutoCallback(withTryNotifySuccess(addCoupon, "쿠폰이 추가되었습니다.", addNotification));

  // 쿠폰 삭제
  const handleDeleteCoupon = useAutoCallback(
    withTryNotifySuccess(deleteCoupon, "쿠폰이 삭제되었습니다.", addNotification)
  );

  return {
    addToCart,
    handleUpdateQuantity,
    handleApplyCoupon,
    completeOrder,
    handleAddProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleAddCoupon,
    handleDeleteCoupon,
  };
};
