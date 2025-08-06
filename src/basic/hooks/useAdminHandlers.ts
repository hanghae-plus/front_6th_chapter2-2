import { useCallback } from "react";
import { ProductWithUI } from "../entities/products/product.types";
import { ProductFormData } from "../entities/products/useProductForm";
import { CouponWithUI, CouponFormData } from "../entities/coupon";

interface UseAdminHandlersProps {
  // Product 네임스페이스 구조 활용
  productActions: {
    add: (product: Omit<ProductWithUI, "id">) => void;
    update: (productId: string, updates: Partial<ProductWithUI>) => void;
  };

  // Coupon 네임스페이스 구조 활용
  couponActions: {
    add: (coupon: Omit<CouponWithUI, "id">) => void;
  };

  // 알림 처리
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;

  // Form 상태들
  productForm: ProductFormData;
  editingProduct: string | null;
  setEditingProduct: (product: string | null) => void;
  setShowProductForm: (show: boolean) => void;
  couponForm: CouponFormData;
  closeCouponForm: () => void;
}

/**
 * 관리자 페이지 핸들러들을 제공하는 훅 (네임스페이스 구조)
 */
export const useAdminHandlers = ({
  productActions,
  couponActions,
  addNotification,
  productForm,
  editingProduct,
  setEditingProduct,
  setShowProductForm,
  couponForm,
  closeCouponForm,
}: UseAdminHandlersProps) => {
  const handleProductSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const productData = {
        name: productForm.name,
        price: productForm.price,
        stock: productForm.stock,
        description: productForm.description,
        discounts: productForm.discounts,
      };

      if (editingProduct === "new") {
        productActions.add(productData);
        addNotification("상품이 추가되었습니다", "success");
      } else if (editingProduct) {
        productActions.update(editingProduct, productData);
        addNotification("상품이 수정되었습니다", "success");
      }

      setEditingProduct(null);
      setShowProductForm(false);
    },
    [
      editingProduct,
      productForm,
      productActions,
      addNotification,
      setEditingProduct,
      setShowProductForm,
    ]
  );

  const handleCouponSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      couponActions.add({
        name: couponForm.name,
        code: couponForm.code,
        discountType: couponForm.discountType,
        discountValue: couponForm.discountValue,
      });

      addNotification("쿠폰이 추가되었습니다", "success");
      closeCouponForm();
    },
    [couponForm, couponActions, addNotification, closeCouponForm]
  );

  return {
    // 네임스페이스 구조
    actions: {
      handleProductSubmit,
      handleCouponSubmit,
    },

    // 하위 호환성을 위해 기존 방식도 유지
    handleProductSubmit,
    handleCouponSubmit,
  };
};
